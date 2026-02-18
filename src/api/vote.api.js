import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1/votes",
});



API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const likeDislikeSolution = (solutionId) => API.patch(`/toggle/${solutionId}`)