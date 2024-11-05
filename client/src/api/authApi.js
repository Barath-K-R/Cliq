import axios from 'axios'

<<<<<<< Updated upstream
const userApi=axios.create({baseURL:"http://localhost:5000"});

export const loginUser=(formdata)=>userApi.post('/user/login',formdata);
=======
export const loginUser = (formdata) => authApi.post("/login", formdata);

>>>>>>> Stashed changes
