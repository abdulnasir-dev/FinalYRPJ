import axios from "axios"

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "http://localhost:8080/api/v1/users"
})

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const dashboardStats = () => API.get("/stats")