import { DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

const ReadRecieptModel = sequelize.define(
  "ReadReciepts",
  {
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "messages",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    seen_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
);

export default ReadRecieptModel;
