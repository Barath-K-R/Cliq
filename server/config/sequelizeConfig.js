import { Sequelize } from 'sequelize';

// Creating a new instance of Sequelize
const sequelize = new Sequelize('cliq2', 'root', '9659223637', {
  host: 'localhost', 
  dialect: 'mysql', 
  logging: false, 

 
  pool: {
    max: 5, 
    min: 0, 
    acquire: 30000, 
    idle: 10000, 
  },
});



export default sequelize;
