import axios from "axios";
export const authApi = axios.create({ baseURL: "http://localhost:5000/auth" });

export const loginUser = (formdata) => authApi.post("/login", formdata);
