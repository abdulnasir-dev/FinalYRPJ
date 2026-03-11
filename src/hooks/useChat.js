import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchMessages } from "@/api/conversation.api";

/**
 * useChat — orchestrates the chat conversation.
 *
 * 1. Emits `start-conversation` with { problemId, solutionId }.
 * 2. Listens for `conversation-started` to grab the conversationId.
 * 3. Fetches historical messages + conversation participants via REST.
 * 4. Listens for `new-message` to append incoming messages.
 * 5. Exposes `sendMessage(content)` with optimistic UI update.
 * 6. Returns `otherUser` (name + avatar of the other participant).
 * 7. Handles errors and timeouts so the UI never hangs forever.
 */
export default function useChat({ socket, problemId, solutionId, isConnected }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  // Decode current user id from JWT
  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id || decoded.userId || null;
    } catch {
      return null;
    }
  })();

  // --- start conversation & listen for events ---
  useEffect(() => {
    if (!socket || !isConnected) return;

    let timeoutId = null;

    const onConversationStarted = async (conversation) => {
      // Clear timeout since we got a response
      if (timeoutId) clearTimeout(timeoutId);

      setConversationId(conversation._id);

      // Load historical messages + participant info via REST
      try {
        const res = await fetchMessages(conversation._id);
        const history = res.data.messages || [];
        setMessages(Array.isArray(history) ? history : []);

        // Determine the other user from populated conversation data
        const convo = res.data.conversation;
        if (convo) {
          const isUser = convo.userId?._id === currentUserId;
          setOtherUser(isUser ? convo.expertId : convo.userId);
        }
      } catch (err) {
        console.error("Failed to load message history", err);
        setError("Failed to load messages. Please try again.");
      }

      setLoading(false);
    };

    const onConversationError = ({ message }) => {
      if (timeoutId) clearTimeout(timeoutId);
      console.error("conversation-error:", message);
      setError(message || "Could not start conversation.");
      setLoading(false);
    };

    const onNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        const withoutOptimistic = prev.filter(
          (m) => !(m._optimistic && m.content === message.content && m.senderId === message.senderId)
        );
        return [...withoutOptimistic, message];
      });
    };

    socket.on("conversation-started", onConversationStarted);
    socket.on("conversation-error", onConversationError);
    socket.on("new-message", onNewMessage);
    socket.emit("start-conversation", { problemId, solutionId });

    // Timeout: if no response within 15s, stop loading and show an error.
    // This handles Render cold-starts or silent backend failures.
    timeoutId = setTimeout(() => {
      if (loading) {
        setError("Connection timed out. The server may be waking up — please try again in a moment.");
        setLoading(false);
      }
    }, 15000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      socket.off("conversation-started", onConversationStarted);
      socket.off("conversation-error", onConversationError);
      socket.off("new-message", onNewMessage);
    };
  }, [socket, isConnected, problemId, solutionId]);

  const sendMessage = useCallback(
    (content) => {
      if (!conversationId || !content.trim()) return;

      const optimistic = {
        _id: `temp-${Date.now()}`,
        conversationId,
        senderId: currentUserId,
        senderRole: "user",
        content: content.trim(),
        createdAt: new Date().toISOString(),
        _optimistic: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      socket.emit("send-message", { conversationId, content: content.trim() });
    },
    [socket, conversationId, currentUserId]
  );

  return { conversationId, messages, loading, error, sendMessage, currentUserId, otherUser };
}

