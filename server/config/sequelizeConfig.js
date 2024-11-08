import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Creating a new instance of Sequelize using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST, 
    dialect: process.env.DB_DIALECT, 
    logging: false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX, 10) || 5, // Ensure max is parsed as an integer
      min: parseInt(process.env.DB_POOL_MIN, 10) || 0, // Ensure min is parsed as an integer
      acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000, // Ensure acquire is parsed as an integer
      idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000, // Ensure idle is parsed as an integer
    },
  }
);

export default sequelize;
