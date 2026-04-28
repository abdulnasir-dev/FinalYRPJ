import { API } from "./axiosInstance";

// ADDED /auth back to these specific calls
export const LoginUser = (data) => API.post("/auth/login", data);

export const registerUser = (data) => {
    return API.post("/auth/register", data);
};

export const getLeaderboard = (range = "all") =>
  API.get("/reputations/leaderboards", { params: { range } });

export const verifyOTP = (data) => API.post("/auth/verify-otp", data);

// Password reset
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const verifyResetOTP = (data) => API.post("/auth/verify-reset-otp", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);
