import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const PermissionModel = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permission_name: {
      type: DataTypes.STRING(70),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "permissions",
    timestamps: false, 
  }
);

export default PermissionModel;
