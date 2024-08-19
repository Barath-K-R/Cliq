import axios from 'axios'

const userApi=axios.create({baseURL:"http://localhost:5000"});

export const getUser=(id)=>userApi.get(`/user/${id}`);
export const getAllOrgUser=(orgId)=>userApi.get(`/user`)