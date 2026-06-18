require('dotenv').config();
const { connectDB } = require('./config/database');
const app = require('./app');

// Initialize Database connection (will auto fallback to local JSON file if MongoDB is offline)
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
