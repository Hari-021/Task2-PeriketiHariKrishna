const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  static async registerUser({ name, email, password }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already registered with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName: name,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.fullName || user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  }

  static async loginUser({ email, password }) {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password || user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.fullName || user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  }

  static async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      name: user.fullName || user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  static generateToken(user) {
    const payload = { 
      id: user._id, 
      email: user.email, 
      name: user.fullName || user.name 
    };
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_cyber_fintech_key_99812',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
  }
}

module.exports = AuthService;
