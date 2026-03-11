import { API } from "./axiosInstance";

/**
 * Fetch all conversations for the logged-in user.
 * Returns: { conversations, count }
 */
export const fetchConversations = () => API.get("/chat");

/**
 * Fetch message history for a specific conversation.
 * Returns: { messages }
 */
export const fetchMessages = (conversationId) =>
  API.get(`/chat/${conversationId}/messages`);
