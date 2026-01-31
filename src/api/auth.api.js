import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth"
})

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

API.interceptors.response.use(
    res => res,
    err => err.response?.status === 401 && (localStorage.clear(), window.location.href = "/login")
);


export const LoginUser = (data) => API.post("/login", data)