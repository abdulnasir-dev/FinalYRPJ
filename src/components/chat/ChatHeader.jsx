import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoEllipsisVertical } from "react-icons/io5";

/**
 * ChatHeader — top bar of the chat screen.
 *
 * Shows the other user's name and avatar, connection status, and a back button.
 *
 * @param {{ isConnected: boolean, otherUser: { fullName: string, coverImage: string } | null }}
 */
export default function ChatHeader({ isConnected, otherUser }) {
  const navigate = useNavigate();
  const name = otherUser?.fullName || "Chat";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-white/15 transition-colors duration-200 cursor-pointer"
        aria-label="Go back"
      >
        <IoArrowBack className="w-5 h-5" />
      </button>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white/20 flex items-center justify-center text-sm font-bold select-none">
        {otherUser?.coverImage ? (
          <img
            src={otherUser.coverImage}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          style={{ display: otherUser?.coverImage ? "none" : "flex" }}
          className="w-full h-full bg-white/20 items-center justify-center"
        >
          {initial}
        </div>
      </div>

      {/* Title & status */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold truncate leading-tight">
          {name}
        </h1>
        <span className="flex items-center gap-1.5 text-xs text-white/80">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isConnected
                ? "bg-green-300 shadow-[0_0_6px_rgba(134,239,172,0.8)]"
                : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]"
            }`}
          />
          {isConnected ? "Online" : "Connecting…"}
        </span>
      </div>

      {/* Options */}
      <button
        className="p-2 rounded-full hover:bg-white/15 transition-colors duration-200 cursor-pointer"
        aria-label="Options"
      >
        <IoEllipsisVertical className="w-5 h-5" />
      </button>
    </header>
  );
}
