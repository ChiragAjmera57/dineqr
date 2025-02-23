const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
  {
    host: config.host, 
    port: config.port, 
    dialect: 'postgres',       
    logging: false,            
    pool: {                    
      max: 10,                 
      min: 0,                  
      acquire: 30000,          
      idle: 10000,             
    },
  }
);

module.exports = sequelize;