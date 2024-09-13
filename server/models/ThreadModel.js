import sequelize from "../config/sequelizeConfig.js";
import { DataTypes } from "sequelize";

const ThreadModel = sequelize.define('Thread', {
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
            key: 'id'         
        }
    },
    head: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "messages",  
            key: 'id'            
        },
        onDelete: 'CASCADE'
    },
}, {
    timestamps: true
});

export default ThreadModel;
