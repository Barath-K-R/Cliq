import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import PermissionModel from "../models/PermissionModel.js";
import ChatModel from "../models/ChatModel.js";
const ChatPermissionModel = sequelize.define(
  "ChatPermission",
  {
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PermissionModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "chat_permissions",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["chat_id", "permission_id"],
      },
    ],
  }
);

export default ChatPermissionModel;
