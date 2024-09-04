// models/TeamMember.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';

const TeamMemberModel = sequelize.define('TeamMember', {
  team_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'teams',
      key: 'id',     
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', 
      key: 'id',     
    },
    onDelete: 'SET NULL',
    allowNull: true, 
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'team_members',
  timestamps: false, 
  indexes: [
    {
      unique: true,
      fields: ['team_id', 'user_id'],
    },
  ],
});

export default TeamMemberModel;
