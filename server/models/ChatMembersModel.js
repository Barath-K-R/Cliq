// models/ChatMember.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import UserModel from "../models/UserModel.js";
import ChatModel from "../models/ChatModel.js";
import RoleModel from "./RolesModel.js";
const ChatMembersModel = sequelize.define(
  "ChatMember",
  {
    chat_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "chats",
        key:"id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6,
      references: {
        model: "roles",
        key: "id",
      },
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "chat_members",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["chat_id", "user_id"],
      },
    ],
  }
);

export default ChatMembersModel;
