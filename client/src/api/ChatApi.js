import axios from 'axios'

const chatApi=axios.create({baseURL:"http://localhost:5000"});

export const userChats=(id)=>chatApi.get(`/chat/${id}`);
export const getMessages=(id)=>chatApi.get(`/message/${id}`);
export const addMessage=(message)=>chatApi.post('/message',message);