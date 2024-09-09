import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Organizations", // Reference by model name
        key: "id",
      },
      onDelete: "SET NULL",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
  }
);

export default UserModel;
