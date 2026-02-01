import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
  baseURL: "https://impacthub-jqm3.onrender.com/api/v1/solutions",
});



API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const fetchSolutionsForProblem = (problemId) => API.get(`${problemId}`)

export const createSolution = (problemId, answer) =>
    API.post(`/create/${problemId}`, { answer });

export const acceptSolution = (solutionId) =>
    API.patch(`/accept/${solutionId}`);
