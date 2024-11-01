import axios from "axios";
import store from "../store/store.js";
import useLogout from "../hooks/useLogout.js";
import { authApi } from "./authApi.js";

const chatApi = axios.create({ baseURL: "http://localhost:5000" });

const getTokens = () => store.getState().tokens;

chatApi.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();

    if (accessToken) {
      // Set the Authorization header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Handle errors before they reach the network
    return Promise.reject(error);
  }
);

chatApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("user routes error");

    const { refreshToken } = getTokens();

    const originalRequest = error.config;

    // Check if error status is 401 and if refresh token is available
    if (error.response && error.response.status === 403 && refreshToken) {
      try {
        // Request a new access token with the refresh token
        const response = await axios.post(
          "http://localhost:5000/auth/refresh",
          { refreshToken: refreshToken }
        );

        const newAccessToken = response.data.accessToken;

        store.dispatch({
          type: "SET_TOKENS",
          payload: { accessToken: newAccessToken, refreshToken: refreshToken },
        });

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return chatApi(originalRequest);
      } catch (err) {
        console.error("Failed to refresh access token:", err);
        try {
          await authApi.post("/auth/logout", null);
        } catch (logoutError) {
          console.error("Logout failed:", logoutError);
        }

        store.dispatch({ type: "CLEAR_TOKENS" });
        store.dispatch({ type: "REMOVE_USER" });
        store.dispatch({ type: "RESET" });
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const createChat = (chatData) => chatApi.post("/chat", chatData);
export const userChats = (id, chatType) =>
  chatApi.get(`/chat/${id}?type=${chatType}`);
export const retrieveMembers = (chatId) =>
  chatApi.get(`/chat/${chatId}/members`);
export const addMembersToChat = (chatId, userIds) =>
  chatApi.post(`/chat/${chatId}/members`, userIds);

export const removeMembersFromChat = (chatId, userIds) =>
  chatApi.delete(`/chat/${chatId}/members`, {
    data: { userIds },
  });

export const getRolePermissions = (chatId, roleId) =>
  chatApi.get(`/chat/${chatId}/permissions/${roleId}`);

export const addMessage = (message) => chatApi.post("/messages", message);
export const getMessages = (id) => chatApi.get(`/messages/chats/${id}`);
export const unseenMessageCount = (chatId, userId) =>
  chatApi.get(`/messages/chats/${chatId}/unseen?userId=${userId}`);
export const deleteMessages = (chatId) =>
  chatApi.delete(`/messages/chats/${chatId}`);

export const createThread = (message) => chatApi.post("/threads/", message);
export const addMessageToThread = (message) =>
  chatApi.post("threads/message", message);

export const addReadReciept = (reciept, messageId) =>
  chatApi.post(`/messages/read-reciepts/${messageId}`, reciept);
export const updateReadReciepts = (readReceipt) =>
  chatApi.put("/messages/read-reciepts", readReceipt);
