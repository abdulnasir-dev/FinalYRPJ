import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1/problems",
});



API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* ===================== PROBLEMS ===================== */

export const fetchAllProblems = (page = 1, limit = 10) =>
    API.get(`/?page=${page}&limit=${limit}`);

export const fetchProblemById = (problemId) =>
    API.get(`/${problemId}`);

export const createProblem = (formData) =>
    API.post("/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const editProblem = (problemId, formData) => API.patch(`/${problemId}/edit`, formData);