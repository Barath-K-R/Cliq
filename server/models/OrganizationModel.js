import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const OrganizationModel = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: "users",
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
    tableName: "organizations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default OrganizationModel;
