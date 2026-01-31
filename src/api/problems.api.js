import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
    baseURL: "http://localhost:8080/api/v1/problems",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * @param {number} page
 * @param {number} limit
 */
export const fetchAllProblems = (page = 1, limit = 10) =>
    API.get(`/?page=${page}&limit=${limit}`);
