// models/RefreshTokenModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import UserModel from "./UserModel.js"; 

const RefreshTokenModel = sequelize.define("RefreshToken", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "refresh_tokens",
    timestamps: false, 
});

// Define associations
RefreshTokenModel.belongsTo(UserModel, { foreignKey: "user_id" });

export default RefreshTokenModel;
