const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  // Default to localhost for local development when Docker is not used
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  // Default frontend dev server (Vite) origin
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  seedOnStart: process.env.SEED_ON_START === 'true'
};

module.exports = env;
