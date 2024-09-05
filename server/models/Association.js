import UserModel from "../models/UserModel.js";
import ChatMembersModel from "../models/ChatMembersModel.js";
import ChatModel from "../models/ChatModel.js";
import OrganizationModel from "../models/OrganizationModel.js";

UserModel.hasMany(ChatMembersModel, { foreignKey: "user_id" });
UserModel.hasMany(ChatModel, { foreignKey: "user_id" });
ChatModel.hasMany(ChatMembersModel, { foreignKey: "chat_id" });
ChatMembersModel.belongsTo(ChatModel, { foreignKey: "chat_id" });
ChatMembersModel.belongsTo(UserModel, { foreignKey: "user_id" });

OrganizationModel.hasMany(ChatModel, { foreignKey: "organization_id" });
ChatModel.belongsTo(OrganizationModel, { foreignKey: "organization_id" });
ChatModel.belongsTo(UserModel, { foreignKey: "organization_id" });

export { UserModel, ChatModel, ChatMembersModel, OrganizationModel };
