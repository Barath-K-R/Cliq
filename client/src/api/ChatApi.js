import axios from "axios";

const chatApi = axios.create({ baseURL: "http://localhost:5000" });

export const createChat = (chatData) => chatApi.post("/chat", chatData);
export const userChats = (id, chatType) =>
  chatApi.get(`/chat/${id}?type=${chatType}`);
export const retrieveMembers = (chatId) =>
  chatApi.get(`/chat/${chatId}/members`);
export const addMembersToChat=(chatId,userIds)=>chatApi.post(`/chat/${chatId}/members`,userIds)
export const getRolePermissions=(chatId,roleId)=>chatApi.get(`/chat/${chatId}/permissions/${roleId}`);

export const addMessage = (message) => chatApi.post("/messages", message);
export const getMessages = (id) => chatApi.get(`/messages/chats/${id}`);
export const unseenMessageCount = (chatId, userId) =>
  chatApi.get(`/messages/chats/${chatId}/unseen?userId=${userId}`);

export const createThread = (message) => chatApi.post("/threads/", message);
export const addMessageToThread = (message) =>
  chatApi.post("threads/message", message);

export const addReadReciept = (reciept, messageId) =>
  chatApi.post(`/messages/read-reciepts/${messageId}`, reciept);
export const updateReadReciepts = (readReceipt) =>
  chatApi.put("/messages/read-reciepts", readReceipt);
