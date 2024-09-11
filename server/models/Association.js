import UserModel from "../models/UserModel.js";
import ChatModel from "../models/ChatModel.js";
import ChatMembersModel from "../models/ChatMembersModel.js";
import MessageModel from "../models/MessageModel.js";
import TeamModel from "../models/TeamModel.js";
import TeamMembersModel from "../models/TeamMembersModel.js";
import PermissionModel from "../models/PermissionModel.js";
import ChatPermissionModel from "../models/ChatPermissionModel.js";
import RolesModel from "../models/RolesModel.js";
import OrganizationModel from "../models/OrganizationModel.js";

//usermodel relatioships
UserModel.belongsTo(OrganizationModel, {
  foreignKey: "organization_id",
});

UserModel.belongsToMany(ChatModel, {
  through: ChatMembersModel,
  foreignKey: "user_id",
  otherKey: "chat_id",
});

UserModel.belongsToMany(TeamModel, {
  through: TeamMembersModel,
  foreignKey: "user_id",
  otherKey: "team_id",
});

UserModel.hasMany(MessageModel, {
  foreignKey: "sender_id",
});

//chatmodel relationships
ChatModel.belongsToMany(UserModel, {
  through: ChatMembersModel,
  foreignKey: "chat_id",
  otherKey: "user_id",
});

ChatModel.hasMany(MessageModel, {
  foreignKey: "chat_id",
});

ChatModel.hasMany(ChatPermissionModel, {
  foreignKey: "chat_id",
});

ChatModel.hasMany(ChatMembersModel,{
   foreignKey:"chat_id",
})

//chatmembersmodel associations
ChatMembersModel.belongsTo(RolesModel, {
  foreignKey: "role_id",
});

ChatMembersModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});

ChatMembersModel.belongsTo(ChatModel, {
  foreignKey: "chat_id",
});

//Teammodel relationships
TeamModel.belongsToMany(UserModel, {
  through: TeamMembersModel,
  foreignKey: "team_id",
  otherKey: "user_id",
});

//messagemodelrelationships
MessageModel.belongsTo(ChatModel, {
  foreignKey: "chat_id",
  onDelete: "CASCADE",
});

MessageModel.belongsTo(UserModel, {
  foreignKey: "sender_id",
});

//organizationmodel relatioships
OrganizationModel.hasMany(UserModel, {
  foreignKey: "organization_id",
});

//permissionmodel associations
PermissionModel.hasMany(ChatPermissionModel, {
  foreignKey: "permission_id",
});

ChatPermissionModel.belongsTo(PermissionModel, {
  foreignKey: "permission_id",
  onDelete: "CASCADE",
});

ChatPermissionModel.belongsTo(ChatModel, {
  foreignKey: "chat_id",
  onDelete: "CASCADE",
});

//rolemodel associations
RolesModel.hasMany(ChatMembersModel, {
  foreignKey: "role_id",
});
