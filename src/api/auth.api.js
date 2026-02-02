import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1/auth",
});




API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})



export const LoginUser = (data) => API.post("/login", data)

export const registerUser = (data) => {
    return API.post("/register", data);
};