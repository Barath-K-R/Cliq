import UserModel from "./UserModel.js";
import ChatModel from "./ChatModel.js";
import ChatMembersModel from "./ChatMembersModel.js";
import MessageModel from "./MessageModel.js";
import TeamModel from "./TeamModel.js";
import TeamMembersModel from "./TeamMembersModel.js";
import PermissionModel from "./PermissionModel.js";
import ChatPermissionModel from "./ChatPermissionModel.js";
import RolesModel from "./RolesModel.js";
import OrganizationModel from "./OrganizationModel.js";
import ThreadModel from "./ThreadModel.js";
import ReadRecieptModel from "./ReadReceiptModel.js";
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

UserModel.hasMany(ReadRecieptModel, {
   foreignKey: "user_id"
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

ChatModel.hasMany(ChatMembersModel, {
  foreignKey: "chat_id",
});

ChatModel.hasMany(ThreadModel, {
  foreignKey: "chatId",
});

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

MessageModel.hasMany(ReadRecieptModel, {
  foreignKey: "message_id" 
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

//ThreadModel associations
ThreadModel.belongsTo(ChatModel, {
  foreignKey: "chatId",
});

//ReadReciept Model
ReadRecieptModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});

ReadRecieptModel.belongsTo(MessageModel, {
  foreignKey: "id",
});
