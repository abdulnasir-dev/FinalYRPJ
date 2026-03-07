import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchConversations } from "@/api/conversation.api";
import ConversationItem from "./ConversationItem";
import { IoSearchOutline, IoChatbubblesOutline } from "react-icons/io5";

/**
 * ChatSidebar — inbox-style list of all conversations.
 *
 * Fetches conversations from GET /api/v1/chat and renders
 * each as a ConversationItem. Clicking opens the chat view.
 */
export default function ChatSidebar() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchConversations();
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter by other participant name or problem title
  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.otherParticipant?.fullName?.toLowerCase().includes(q) ||
      c.problem?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <IoChatbubblesOutline className="w-5 h-5 text-emerald-500" />
          Messages
        </h2>

        {/* Search */}
        <div className="relative mt-3">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading conversations…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6 text-center">
            <IoChatbubblesOutline className="w-12 h-12 mb-3 text-gray-200" />
            <p className="text-sm font-medium">
              {search ? "No matching conversations" : "No conversations yet"}
            </p>
            <p className="text-xs mt-1">
              {search
                ? "Try a different search term"
                : "Accept a solution to start chatting!"}
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isActive={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
