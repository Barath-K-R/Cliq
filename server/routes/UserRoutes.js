import express from "express";
import {
  addingUser,
  logingUser,
  gettingUser,
  getAllOrgusers,
} from "../mysqlControllers/userController.js";
const UserRouter = express.Router();

UserRouter.post("/", addingUser);
UserRouter.get("/:id", gettingUser);
UserRouter.post("/login", logingUser);
UserRouter.get("/org/:orgId", getAllOrgusers);

export default UserRouter;
