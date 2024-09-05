import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js'; 

const TeamModel = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(70),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'teams',
  timestamps: false, 
});

export default TeamModel;
