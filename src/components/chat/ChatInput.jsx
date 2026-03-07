import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";

/**
 * ChatInput — message composer with a textarea & send button.
 *
 * Behaviour:
 *  - Enter  → send message
 *  - Shift+Enter → new line
 *  - Auto-resizes the textarea up to 5 lines
 *  - Send button disabled when socket is disconnected or input is empty
 *
 * @param {{ onSend: (content: string) => void, disabled: boolean }}
 */
export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize the textarea based on its scroll height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; // max ~5 lines
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    // Reset height after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <footer className="flex items-end gap-2 p-3 bg-gray-50 border-t border-gray-200">
      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={disabled}
          rows={1}
          className="
            w-full resize-none rounded-2xl bg-white border border-gray-200
            px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full
          transition-all duration-200 cursor-pointer
          ${
            canSend
              ? "bg-emerald-500 text-white shadow-md hover:bg-emerald-600 hover:shadow-lg active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
        aria-label="Send message"
      >
        <IoSend className="w-4.5 h-4.5 translate-x-[1px]" />
      </button>
    </footer>
  );
}
