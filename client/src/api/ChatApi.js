import axios from 'axios'

const chatApi=axios.create({baseURL:"http://localhost:5000"});

export const createChat=(chatData)=>chatApi.post('/chat',chatData);
export const userChats=(id,chatType)=>chatApi.get(`/chat/${id}?type=${chatType}`);
export const retrieveMembers=(chatId)=>chatApi.get(`/chat/${chatId}/members`);

export const addMessage=(message)=>chatApi.post('/messages',message);
export const getMessages=(id)=>chatApi.get(`/messages/chats/${id}`);
export const unseenMessageCount=(chatId,userId)=>chatApi.get(`/messages/chats/${chatId}/unseen?userId=${userId}`)

export const addReadReciept=(reciept,messageId)=>chatApi.post(`/messages/read-reciepts/${messageId}`,reciept)
export const updateReadReciepts=(readReceipt)=>chatApi.put('/messages/read-reciepts',readReceipt)