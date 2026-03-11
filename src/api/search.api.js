import { API } from "./axiosInstance";

export const searchRequest = (data) => API.post("/search", data);
