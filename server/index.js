import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/sequelizeConfig.js";


// Import your models
import UserModel from "./models/UserModel.js";
import ChatModel from './models/ChatModel.js';
import ChatMembersModel from "./models/ChatMembersModel.js";
import MessageModel from "./models/MessageModel.js";
import TeamModel from "./models/TeamModel.js";
import TeamMemberModel from "./models/TeamMembersModel.js";
import PermissionModel from "./models/PermissionModel.js";
import RoleModel from "./models/RolesModel.js";
import ChatPermissionModel from "./models/ChatPermissionModel.js";
import OrganizationModel from "./models/OrganizationModel.js";

import './models/Association.js';


import chatRouter from "./routes/ChatRoute.js";
import UserRouter from "./routes/UserRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";
import orgRouter from "./routes/OrganizationRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

(async () => {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync models
    await sequelize.sync({ alter: true }); 
    console.log("All models were synchronized successfully.");

    // Start the server
    app.listen(5000, () => {
      console.log("Server running successfully on port 5000");
    });
  } catch (error) {
    console.error("Unable to connect to the database or sync models:", error);
    process.exit(1);
  }
})();

// Define routes
app.use("/chat", chatRouter);
app.use("/messages", messageRouter);
app.use("/user", UserRouter);
app.use("/org", orgRouter);
