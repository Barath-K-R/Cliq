import axios from 'axios'

const userApi=axios.create({baseURL:"http://localhost:5000"});

export const loginUser=(formdata)=>userApi.post('/user/login',formdata);