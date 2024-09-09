import UserModel from "../models/UserModel.js";
import ChatModel from '../models/ChatModel.js';
import ChatMembersModel from "../models/ChatMembersModel.js";
import MessageModel from '../models/MessageModel.js';
import TeamModel from '../models/TeamModel.js'
import TeamMembersModel from '../models/TeamMembersModel.js';
import PermissionModel from '../models/PermissionModel.js';
import ChatPermissionModel from '../models/ChatPermissionModel.js';
import RolesModel from '../models/RolesModel.js';
import OrganizationModel from '../models/OrganizationModel.js'

UserModel.hasMany(ChatModel, { foreignKey: 'creator_id' }); 
ChatModel.belongsTo(UserModel, { foreignKey: 'creator_id' }); 


UserModel.hasMany(ChatMembersModel, { foreignKey: 'user_id' }); 
ChatMembersModel.belongsTo(UserModel, { foreignKey: 'user_id' }); 


ChatModel.hasMany(ChatMembersModel, { foreignKey: 'chat_id' }); 
ChatMembersModel.belongsTo(ChatModel, { foreignKey: 'chat_id' }); 


ChatModel.hasMany(MessageModel, { foreignKey: 'chat_id' }); 
MessageModel.belongsTo(ChatModel, { foreignKey: 'chat_id' }); 


UserModel.hasMany(MessageModel, { foreignKey: 'user_id' }); 
MessageModel.belongsTo(UserModel, { foreignKey: 'user_id' }); 


TeamModel.hasMany(TeamMembersModel, { foreignKey: 'team_id' }); 
TeamMembersModel.belongsTo(TeamModel, { foreignKey: 'team_id' }); 


UserModel.hasMany(TeamMembersModel, { foreignKey: 'user_id' }); 
TeamMembersModel.belongsTo(UserModel, { foreignKey: 'user_id' }); 


ChatMembersModel.hasMany(ChatPermissionModel, { foreignKey: 'chat_member_id' }); 
ChatPermissionModel.belongsTo(ChatMembersModel, { foreignKey: 'chat_member_id' }); 


PermissionModel.hasMany(ChatPermissionModel, { foreignKey: 'permission_id' }); 
ChatPermissionModel.belongsTo(PermissionModel, { foreignKey: 'permission_id' }); 


RolesModel.hasMany(ChatMembersModel, { foreignKey: 'role_id' }); 
ChatMembersModel.belongsTo(RolesModel, { foreignKey: 'role_id' }); 


TeamModel.hasMany(ChatModel, { foreignKey: 'team_id' }); 
ChatModel.belongsTo(TeamModel, { foreignKey: 'team_id' }); 


OrganizationModel.hasMany(UserModel, { foreignKey: 'organization_id' }); 
UserModel.belongsTo(OrganizationModel, { foreignKey: 'organization_id' }); 
