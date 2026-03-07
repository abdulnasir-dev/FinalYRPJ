import { useNavigate } from "react-router-dom";

/**
 * ConversationItem — a single row in the chat sidebar.
 *
 * Shows the other participant's avatar, name, problem title,
 * last message preview, and relative timestamp.
 */
export default function ConversationItem({ conversation, isActive }) {
  const navigate = useNavigate();
  const { otherParticipant, problem, lastMessage, lastMessageTime, problemId, solutionId } = conversation;

  const handleClick = () => {
    navigate(`/chat/${problemId}/${solutionId}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150
        hover:bg-emerald-50 cursor-pointer
        ${isActive ? "bg-emerald-50 border-r-2 border-emerald-500" : ""}
      `}
    >
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
        {otherParticipant?.coverImage ? (
          <img
            src={otherParticipant.coverImage}
            alt={otherParticipant.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          style={{ display: otherParticipant?.coverImage ? "none" : "flex" }}
          className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white items-center justify-center font-bold text-sm"
        >
          {otherParticipant?.fullName?.charAt(0) || "U"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm text-gray-900 truncate">
            {otherParticipant?.fullName || "Unknown User"}
          </span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">
            {formatRelativeTime(lastMessageTime)}
          </span>
        </div>

        {/* Problem title */}
        <p className="text-[11px] text-emerald-600 font-medium truncate mt-0.5">
          {problem?.title || "Conversation"}
        </p>

        {/* Last message preview */}
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {lastMessage?.content || "No messages yet"}
        </p>
      </div>
    </button>
  );
}

/**
 * Format an ISO date string to a relative time string.
 */
function formatRelativeTime(isoString) {
  if (!isoString) return "";
  try {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return new Date(isoString).toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}
