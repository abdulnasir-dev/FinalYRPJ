import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import useSocket from "@/hooks/useSocket";
import useChat from "@/hooks/useChat";

import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

/**
 * ChatPage — the main chat view.
 *
 * Reads `problemId` and `solutionId` from the URL, opens a socket
 * connection, starts (or resumes) the conversation, and renders
 * the full chat UI with the other user's name in the header.
 */
export default function ChatPage() {
  const { problemId, solutionId } = useParams();
  const { socket, isConnected } = useSocket();
  const { conversationId, messages, loading, sendMessage, currentUserId, otherUser } =
    useChat({ socket, problemId, solutionId, isConnected });

  // --- auto-scroll to bottom on new messages ---
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <ChatHeader isConnected={isConnected} otherUser={null} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 animate-pulse">
              Setting up conversation…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header — shows other user's name */}
      <ChatHeader isConnected={isConnected} otherUser={otherUser} />

      {/* Messages area */}
      <main
        className="flex-1 overflow-y-auto py-4 space-y-1 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Cpath%20d%3D%22M30%200L60%2030L30%2060L0%2030Z%22%20fill%3D%22none%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')] bg-repeat"
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 select-none">
            <div className="w-16 h-16 mb-3 rounded-full bg-emerald-50 flex items-center justify-center text-3xl">
              💬
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">Send the first message to get started!</p>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg._id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </main>

      {/* Input bar */}
      <ChatInput
        onSend={sendMessage}
        disabled={!isConnected || !conversationId}
      />
    </div>
  );
}
