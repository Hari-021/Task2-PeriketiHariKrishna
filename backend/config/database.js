const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isFallback = false;
const fallbackFile = path.join(__dirname, '../data/db.json');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    // Use a short timeout so that if local Mongo is not running, we switch to fallback quickly
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/subscription-tracker', {
      serverSelectionTimeoutMS: 2500
    });
    isFallback = false;
    console.log('⚡ MongoDB connected successfully.');
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Switching to Local JSON Database Fallback.');
    isFallback = true;
    initializeFallback();
  }
};

function initializeFallback() {
  const dir = path.dirname(fallbackFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(fallbackFile)) {
    fs.writeFileSync(fallbackFile, JSON.stringify({ users: [], subscriptions: [] }, null, 2));
    console.log(`📂 Initialized local JSON database: ${fallbackFile}`);
  }
}

function readData() {
  initializeFallback();
  try {
    const content = fs.readFileSync(fallbackFile, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return { users: [], subscriptions: [] };
  }
}

function writeData(data) {
  initializeFallback();
  fs.writeFileSync(fallbackFile, JSON.stringify(data, null, 2));
}

module.exports = {
  connectDB,
  getIsFallback: () => isFallback,
  readData,
  writeData
};
