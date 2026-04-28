import { API } from "./axiosInstance";

export const getAllUsers = () => API.get("/admin/user");

export const fetchAdminLogs = (page = 1, limit = 10) =>
  API.get(`/admin/logs?page=${page}&limit=${limit}`);

export const getAdminUsersList = (page = 1, limit = 10) => {
  return API.get(`/admin/user?page=${page}&limit=${limit}`);
};

export const getExpertApplicationRequests = () =>
  API.get("/admin/expert-applications");

export const approveExpertApplication = (applicationId) =>
  API.patch(`/admin/expert-application/${applicationId}/approve`);

export const rejectExpertApplication = (applicationId) =>
  API.patch(`/admin/expert-application/${applicationId}/reject`);

// -------- REDEMPTION REQUESTS --------

export const getRedemptionRequests = () =>
  API.get("/admin/redemption-requests");

export const approveRedemptionRequest = (redemptionId) =>
  API.patch(`/admin/redemption/${redemptionId}/approve`);

export const rejectRedemptionRequest = (redemptionId) =>
  API.patch(`/admin/redemption/${redemptionId}/reject`);

export const getAllProblems = () => API.get("/admin/problems");

export const toggleProblemVisibility = (problemId) =>
  API.patch(`/admin/toggle-problem/${problemId}`);

export const getAllSolutions = () => API.get(`/admin/solutions`);

export const toggleSolutionVisibility = (solutionId) =>
  API.patch(`/admin/toggle-solution/${solutionId}`);

export const banningUsers = (userId, banTime, reason) =>
  API.patch(`/admin/ban/${userId}`, { banTime, reason });

export const getAnalyticsData = () => API.get("/admin/analytics");