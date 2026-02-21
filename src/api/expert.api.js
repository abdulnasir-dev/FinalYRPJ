import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1/applications",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const submitExpertApplication = (data) =>
    API.post("/apply", data);


export const getMyExpertApplication = () =>
    API.get("/my-application");

export const reviewExpertApplication = (applicationId, action) =>
    API.patch(`/${applicationId}/review`, { action });

export const fetchAllExpertApplications = () =>
    API.get("/");