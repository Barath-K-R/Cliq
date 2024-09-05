import express from "express";
import {
  createOrganization,
  joinOrganization,
} from "../mysqlControllers/organizationController.js";
import {
  createOrganizationSequelize,
  joinOrganizationSequelize,
} from "../sequelizeControllers/organizationController.js";
const orgRouter = express.Router();

orgRouter.post("/", createOrganizationSequelize);
orgRouter.post("/join", joinOrganizationSequelize);

export default orgRouter;
