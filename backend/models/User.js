const mongoose = require('mongoose');
const { getIsFallback, readData, writeData } = require('../config/database');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for backwards compatibility
UserSchema.virtual('name')
  .get(function() { return this.fullName; })
  .set(function(v) { this.fullName = v; });

UserSchema.virtual('passwordHash')
  .get(function() { return this.password; })
  .set(function(v) { this.password = v; });

// Compile / retrieve Mongoose Model
const MongooseUser = mongoose.models.User || mongoose.model('User', UserSchema);

class User {
  static async findOne(query) {
    // Check if query is querying by compatibility names and map them
    const mappedQuery = { ...query };
    if (mappedQuery.name !== undefined) {
      mappedQuery.fullName = mappedQuery.name;
      delete mappedQuery.name;
    }
    if (mappedQuery.passwordHash !== undefined) {
      mappedQuery.password = mappedQuery.passwordHash;
      delete mappedQuery.passwordHash;
    }

    if (!getIsFallback()) {
      return await MongooseUser.findOne(mappedQuery);
    }

    // JSON fallback querying
    const data = readData();
    const user = data.users.find(u => {
      return Object.keys(mappedQuery).every(key => {
        const queryVal = mappedQuery[key];
        const userVal = u[key];
        
        if (typeof queryVal === 'string' && typeof userVal === 'string') {
          return userVal.toLowerCase() === queryVal.toLowerCase();
        }
        return userVal === queryVal;
      });
    });

    if (user) {
      return {
        ...user,
        _id: user.id,
        name: user.fullName,
        passwordHash: user.password
      };
    }
    return null;
  }

  static async findById(id) {
    if (!getIsFallback()) {
      return await MongooseUser.findById(id);
    }
    const data = readData();
    const user = data.users.find(u => u.id === id);
    if (user) {
      return {
        ...user,
        _id: user.id,
        name: user.fullName,
        passwordHash: user.password
      };
    }
    return null;
  }

  static async create(userData) {
    // Map compatibility fields if provided
    const fullName = userData.fullName || userData.name;
    const password = userData.password || userData.passwordHash;
    
    if (!getIsFallback()) {
      return await MongooseUser.create({
        fullName,
        email: userData.email,
        password
      });
    }

    const data = readData();
    const now = new Date().toISOString();
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      fullName,
      email: userData.email,
      password,
      createdAt: now,
      updatedAt: now
    };
    data.users.push(newUser);
    writeData(data);
    return {
      ...newUser,
      _id: newUser.id,
      name: newUser.fullName,
      passwordHash: newUser.password
    };
  }
}

module.exports = User;
