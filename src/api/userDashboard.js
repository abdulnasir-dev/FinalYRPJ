import axios from "axios"

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "http://localhost:8080/api/v1/"
})

API.interceptors.request.use((config) => {
    const token = getToken();
    console.log("TOKEN SENT =>", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const dashboardStats = () => API.get("/users/stats")

export const myProblems = () => API.get("/problems/my")

export const FetchMySolutions = () => API.get("/solutions/my")

export const myPoints = () => API.get("/reputations/my")

export const fetchMyRedemptions = () => API.get("/redemptions/my")

export const requestRedemption = (data) => API.post("/redemptions/request", data);