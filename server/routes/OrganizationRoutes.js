import express from "express";
import {
  createOrganizationSequelize,
  joinOrganizationSequelize,
} from "../sequelizeControllers/organizationController.js";
const orgRouter = express.Router();

orgRouter.post("/", createOrganizationSequelize);
orgRouter.post("/join", joinOrganizationSequelize);

export default orgRouter;
