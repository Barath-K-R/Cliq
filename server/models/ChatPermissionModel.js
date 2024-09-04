import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const ChatPermissionModel = sequelize.define(
  "ChatPermission",
  {
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "chats",
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
        model: "permissions", 
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
