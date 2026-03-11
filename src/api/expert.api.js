import { API } from "./axiosInstance";

export const submitExpertApplication = (data) =>
  API.post("/applications/apply", data);


export const getMyExpertApplication = () =>
  API.get("/applications/my-application");

export const reviewExpertApplication = (applicationId, action) =>
  API.patch(`/applications/${applicationId}/review`, { action });

export const fetchAllExpertApplications = () =>
  API.get("/applications");