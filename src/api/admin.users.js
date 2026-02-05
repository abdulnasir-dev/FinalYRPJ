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

export const fetchAdminLogs = (page = 1, limit = 10) => API.get(`/logs?page=${page}&limit=${limit}`)

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

export const getAllProblems = () => API.get("/problems");

export const toggleProblemVisibility = (problemId) =>
    API.patch(`/toggle-problem/${problemId}`);

export const getAllSolutions = () => API.get(`/solutions`)

export const toggleSolutionVisibility = (solutionId) => API.patch(`/toggle-solution/${solutionId}`)

export const banningUsers = (userId, banTime) => API.patch(`/ban/${userId}`, { banTime })