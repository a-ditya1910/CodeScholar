import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { IoChatbubbleEllipsesOutline, IoClose, IoSend } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../../services/operations/chatAPI";

// Pull a courseId out of /courses/:id or /view-course/:id/...
function getCourseIdFromPath(pathname) {
  const m =
    pathname.match(/\/courses\/([^/]+)/) ||
    pathname.match(/\/view-course\/([^/]+)/);
  return m ? m[1] : null;
}

export default function ChatBot() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const courseId = getCourseIdFromPath(location.pathname);

  // Greeting depends on login state
  useEffect(() => {
    const greeting = user
      ? `Hi ${user.firstName}! 👋 I'm the CodeScholar assistant. Ask me about courses, your lessons, or studying.`
      : `Hi there! 👋 I'm the CodeScholar assistant. Ask me about our courses or studying. Log in to get help with your enrolled lessons.`;
    setMessages([{ role: "assistant", content: greeting }]);
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const reply = await sendChatMessage(payload, token, courseId);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err.message || "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-richblack-900 shadow-lg transition-transform hover:scale-105"
        aria-label="Open chat assistant"
      >
        {open ? (
          <IoClose size={26} />
        ) : (
          <IoChatbubbleEllipsesOutline size={26} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[1000] flex h-[70vh] max-h-[520px] w-[90vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-richblack-700 bg-richblack-800 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-richblack-700 bg-richblack-900 px-4 py-3">
            <IoChatbubbleEllipsesOutline className="text-yellow-50" size={22} />
            <div>
              <p className="text-sm font-semibold text-richblack-5">
                CodeScholar Assistant
              </p>
              <p className="text-xs text-richblack-300">
                Ask about courses & studying
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`prose-sm max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-yellow-50 text-richblack-900"
                      : "bg-richblack-700 text-richblack-5"
                  }`}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-richblack-700 px-3 py-2 text-sm text-richblack-300">
                  typing…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-richblack-700 bg-richblack-900 px-3 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
              className="flex-1 rounded-lg bg-richblack-700 px-3 py-2 text-sm text-richblack-5 placeholder:text-richblack-400 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50 text-richblack-900 disabled:opacity-50"
              aria-label="Send message"
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
