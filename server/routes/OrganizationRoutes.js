import express from 'express';
import { createOrganization,joinOrganization } from '../mysqlControllers/organizationController.js';
const orgRouter=express.Router();

orgRouter.post('/',createOrganization);
orgRouter.post('/join',joinOrganization);

export default orgRouter