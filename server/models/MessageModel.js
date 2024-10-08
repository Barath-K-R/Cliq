import sequelize from "../config/sequelizeConfig.js";
import { DataTypes } from "sequelize";

const MessageModel = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "chats",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    thread_id:{
      type:DataTypes.INTEGER,
      allowNull:true,
      references:{
        model:"threads",
        key:"id"
      },
      onDelete:"SET NULL"
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_thread_head: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    indexes: [
      {
        fields: ["chat_id", "sender_id"],
      },
    ],
  }
);

export default MessageModel;
