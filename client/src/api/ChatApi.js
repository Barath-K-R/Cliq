import axios from 'axios'

const chatApi=axios.create({baseURL:"http://localhost:5000"});

export const userChats=(id,selection)=>chatApi.get(`/chat/${id}?type=${selection}`);
export const retrieveMembers=(chatId)=>chatApi.get(`/chat/${chatId}/members`);
export const getMessages=(id)=>chatApi.get(`/message/${id}`);
export const addMessage=(message)=>chatApi.post('/message',message);