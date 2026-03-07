import { IoCheckmarkDone } from "react-icons/io5";

/**
 * ChatMessage — a single chat bubble, WhatsApp style.
 *
 * - Right-aligned green bubble for current user's messages
 * - Left-aligned white/gray bubble for the other party
 * - Shows formatted time and a subtle tail
 *
 * @param {{ message: object, isOwn: boolean }}
 */
export default function ChatMessage({ message, isOwn }) {
  const time = formatTime(message.createdAt);

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1 px-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`
          relative max-w-[75%] min-w-[120px] px-3 py-2 rounded-xl shadow-sm
          ${
            isOwn
              ? "bg-emerald-500 text-white rounded-br-sm"
              : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
          }
        `}
      >
        {/* Sender role badge (only for the other party) */}
        {!isOwn && (
          <span className="block text-[10px] font-semibold mb-0.5 text-emerald-600 uppercase tracking-wider">
            {message.senderRole}
          </span>
        )}

        {/* Message body */}
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>

        {/* Timestamp + read indicator */}
        <span
          className={`flex items-center gap-1 justify-end mt-1 text-[10px] select-none ${
            isOwn ? "text-white/70" : "text-gray-400"
          }`}
        >
          {time}
          {isOwn && (
            <IoCheckmarkDone
              className={`w-3.5 h-3.5 ${message._optimistic ? "text-white/40" : "text-sky-200"}`}
            />
          )}
        </span>

        {/* Bubble tail */}
        <div
          className={`absolute bottom-0 w-3 h-3 overflow-hidden ${
            isOwn ? "-right-1.5" : "-left-1.5"
          }`}
        >
          <div
            className={`w-3 h-3 transform rotate-45 ${
              isOwn ? "bg-emerald-500" : "bg-white border-l border-b border-gray-100"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Format an ISO date string to a "HH:MM AM/PM" string.
 */
function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
