import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1", 
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ADDED /auth back to these specific calls
export const LoginUser = (data) => API.post("/auth/login", data)

export const registerUser = (data) => {
    return API.post("/auth/register", data);
};

export const getLeaderboard = (range = "all") => 
    API.get("/reputations/leaderboards", { params: { range } }); 

export const verifyOTP = (data) => API.post("/verify-otp", data)
