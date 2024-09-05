// models/ChatMember.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import UserModel from '../models/UserModel.js';
import ChatModel from '../models/ChatModel.js'
const ChatMembersModel = sequelize.define('ChatMember', {
  chat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'chats', 
    },
    onDelete: 'CASCADE',
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id', 
    },
    onDelete: 'CASCADE',
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:1,
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chat_members',
  timestamps: false, 
  indexes: [
    {
      unique: true,
      fields: ['chat_id', 'user_id']
    }
  ]
});



export default ChatMembersModel;
