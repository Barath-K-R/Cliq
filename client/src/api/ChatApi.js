import axios from 'axios'

const chatApi=axios.create({baseURL:"http://localhost:5000"});

export const createChat=(chatData)=>chatApi.post('/chat',chatData);
export const userChats=(id,chatType)=>chatApi.get(`/chat/${id}?type=${chatType}`);
export const retrieveMembers=(chatId)=>chatApi.get(`/chat/${chatId}/members`);
export const getMessages=(id)=>chatApi.get(`/message/${id}`);
export const addMessage=(message)=>chatApi.post('/message',message);
export const checkUserChat=({currentUserId,secondUserId})=>chatApi.post('/chat',{currentUserId,secondUserId});
export const addReadReciept=(reciept)=>chatApi.post('/message/readreciepts',reciept)