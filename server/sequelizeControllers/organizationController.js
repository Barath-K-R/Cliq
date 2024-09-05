import OrganizationModel from '../models/OrganizationModel.js'
import UserModel from '../models/UserModel.js'
export const createOrganizationSequelize = async (req, res) => {
    const { name, userId } = req.body;
  
    if (!name || !userId) {
      return res.status(400).json({ error: "Invalid input" });
    }
  
    try {
      const newOrganization = await OrganizationModel.create({
        name,
        admin: userId,
      });
  
      
      await UserModel.update(
        { organization_id: newOrganization.id }, 
        { where: { id: userId } } 
      );
  
      res.send({ message: "Organization created and user updated successfully" });
    } catch (err) {
      console.error("Error creating organization:", err);
      res.status(500).send({ error: "An error occurred while creating the organization." });
    }
  };

  export const joinOrganizationSequelize = async (req, res) => {
    const { name, userId } = req.body;
  
    if (!name || !userId) {
      return res.status(400).json({ error: "Invalid input" });
    }
  
    try {
      const organization = await OrganizationModel.findOne({ where: { name } });
  
      if (!organization) {
        return res.status(404).send({ error: "Organization not found" });
      }
  
      
      await UserModel.update(
        { organization_id: organization.id }, 
        { where: { id: userId } } 
      );
  
      res.send({ message: "User has joined the organization successfully" });
    } catch (err) {
      console.error("Error joining organization:", err);
      res.status(500).send({ error: "An error occurred while joining the organization." });
    }
  };