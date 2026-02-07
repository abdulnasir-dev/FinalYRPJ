import axios from "axios"

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1",
});

// https://impacthub-jqm3.onrender.com

API.interceptors.request.use((config) => {
    const token = getToken();
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

// api/notifications.js
export const getNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) => API.patch(`/notifications/${id}/read`);

export const profilePage = (userId) => API.get(`/users/profile/${userId}`)
export const getMyProfile = () => API.get(`/users/my-profile`)
