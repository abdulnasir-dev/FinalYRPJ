import { API } from "./axiosInstance";

export const userAvatar = () => API.get("/users/avatar");