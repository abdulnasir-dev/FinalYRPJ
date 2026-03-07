import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
    baseURL: "https://impacthub-jqm3.onrender.com/api/v1/chat",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/**
 * Fetch all conversations for the logged-in user.
 * Returns: { conversations, count }
 */
export const fetchConversations = () => API.get("/");

/**
 * Fetch message history for a specific conversation.
 * Returns: { messages }
 */
export const fetchMessages = (conversationId) =>
    API.get(`/${conversationId}/messages`);
