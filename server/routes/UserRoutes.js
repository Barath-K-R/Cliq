import express from "express";
import {
  addingUser,
  logingUser,
  gettingUser,
  getAllOrgusers,
} from "../mysqlControllers/userController.js";

import { addingUserSequelize,logingUserSequelize,gettingUserSequelize,getAllOrgUsersSequelize} from "../sequelizeControllers/userController.js";
const UserRouter = express.Router();

UserRouter.post("/", addingUserSequelize);
UserRouter.get("/:id", gettingUserSequelize);
UserRouter.post("/login", logingUserSequelize);
UserRouter.get("/org/:orgId", getAllOrgUsersSequelize);

export default UserRouter;
