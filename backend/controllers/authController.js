const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.registerUser({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'User already registered with this email') {
        res.status(400).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser({ email, password });
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        res.status(400).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }

  static async getProfile(req, res, next) {
    try {
      const profile = await AuthService.getUserProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = AuthController;
