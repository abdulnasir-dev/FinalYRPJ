import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1/admin",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const getAllUsers = () => API.get("/user")

export const fetchAdminLogs = () => API.get("/logs")

export const getAdminUsersList = (page = 1, limit = 10) => {
    return API.get(`/user?page=${page}&limit=${limit}`);
};

export const getExpertApplicationRequests = () =>
    API.get("/expert-applications");

export const approveExpertApplication = (applicationId) =>
    API.patch(`/expert-application/${applicationId}/approve`);

export const rejectExpertApplication = (applicationId) =>
    API.patch(`/expert-application/${applicationId}/reject`);

// -------- REDEMPTION REQUESTS --------

export const getRedemptionRequests = () =>
    API.get("/redemption-requests");

export const approveRedemptionRequest = (redemptionId) =>
    API.patch(`/redemption/${redemptionId}/approve`);

export const rejectRedemptionRequest = (redemptionId) =>
    API.patch(`/redemption/${redemptionId}/reject`);