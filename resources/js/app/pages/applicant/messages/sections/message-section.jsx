import { useState, useRef, useEffect } from "react";
import {
    TbBriefcase,
    TbSearch,
    TbSend,
    TbPaperclip,
    TbDotsVertical,
    TbPhone,
    TbVideo,
    TbChevronLeft,
    TbCheck,
    TbChecks,
} from "react-icons/tb";

const CONVERSATIONS = [
    {
        id: 1,
        title: "Software Developer",
        tag: "Job",
        avatar: null,
        color: "bg-emerald-500",
        initials: "SD",
        lastMessage:
            "Thank you for applying! We have reviewed your application...",
        time: "2 days ago",
        unread: 2,
        online: true,
        messages: [
            {
                id: 1,
                from: "them",
                text: "Hello! Thank you for applying to the Software Developer position at our company.",
                time: "10:00 AM",
                read: true,
            },
            {
                id: 2,
                from: "them",
                text: "We have reviewed your application and we're impressed with your background.",
                time: "10:01 AM",
                read: true,
            },
            {
                id: 3,
                from: "me",
                text: "Thank you so much! I'm really excited about this opportunity.",
                time: "10:15 AM",
                read: true,
            },
            {
                id: 4,
                from: "me",
                text: "I've been following your company for a while and I believe my skills in React and Node.js would be a great fit.",
                time: "10:16 AM",
                read: true,
            },
            {
                id: 5,
                from: "them",
                text: "Great! We'd love to schedule an initial interview. Are you available this week?",
                time: "10:30 AM",
                read: true,
            },
            {
                id: 6,
                from: "me",
                text: "Absolutely! I'm available Thursday or Friday afternoon.",
                time: "10:45 AM",
                read: true,
            },
            {
                id: 7,
                from: "them",
                text: "Perfect. Let's set it for Friday at 2 PM. We'll send a calendar invite shortly.",
                time: "11:00 AM",
                read: true,
            },
            {
                id: 8,
                from: "them",
                text: "Thank you for applying! We have reviewed your application and would like to move forward.",
                time: "2 days ago",
                read: false,
            },
        ],
    },
    {
        id: 2,
        title: "Product Designer",
        tag: "Job",
        avatar: null,
        color: "bg-violet-500",
        initials: "PD",
        lastMessage: "Could you share your portfolio link?",
        time: "3 days ago",
        unread: 0,
        online: false,
        messages: [
            {
                id: 1,
                from: "them",
                text: "Hi! We received your application for the Product Designer role.",
                time: "9:00 AM",
                read: true,
            },
            {
                id: 2,
                from: "them",
                text: "Could you share your portfolio link?",
                time: "9:05 AM",
                read: true,
            },
            {
                id: 3,
                from: "me",
                text: "Of course! Here's my portfolio: https://myportfolio.design",
                time: "9:30 AM",
                read: true,
            },
        ],
    },
    {
        id: 3,
        title: "HR Specialist",
        tag: "Job",
        avatar: null,
        color: "bg-sky-500",
        initials: "HR",
        lastMessage: "Your application is under review.",
        time: "1 week ago",
        unread: 0,
        online: false,
        messages: [
            {
                id: 1,
                from: "them",
                text: "Thank you for applying to the HR Specialist position.",
                time: "Mon",
                read: true,
            },
            {
                id: 2,
                from: "them",
                text: "Your application is currently under review. We'll get back to you soon.",
                time: "Mon",
                read: true,
            },
        ],
    },
];

function Avatar({ color, initials, online, size = "md" }) {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
    };
    return (
        <div className="relative flex-shrink-0">
            <div
                className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-semibold text-white`}
            >
                {initials}
            </div>
            {online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
            )}
        </div>
    );
}

function ConversationItem({ convo, selected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${selected ? "bg-emerald-50 border-r-2 border-emerald-500" : ""}`}
        >
            <Avatar
                color={convo.color}
                initials={convo.initials}
                online={convo.online}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                            {convo.title}
                        </span>
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                            {convo.tag}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {convo.time}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate pr-2">
                        {convo.lastMessage}
                    </p>
                    {convo.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-medium">
                            {convo.unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}

function Message({ msg }) {
    const isMe = msg.from === "me";
    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
            <div
                className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}
            >
                <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                            ? "bg-emerald-500 text-white rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                    }`}
                >
                    {msg.text}
                </div>
                <div
                    className={`flex items-center gap-1 text-xs text-gray-400 ${isMe ? "flex-row-reverse" : ""}`}
                >
                    <span>{msg.time}</span>
                    {isMe &&
                        (msg.read ? (
                            <TbChecks className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                            <TbCheck className="w-3.5 h-3.5" />
                        ))}
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <TbBriefcase className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm">Select a conversation to start messaging</p>
        </div>
    );
}

export default function ChatMessagesUI() {
    const [conversations, setConversations] = useState(CONVERSATIONS);
    const [selectedId, setSelectedId] = useState(null);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [mobileView, setMobileView] = useState("list"); // "list" | "chat"
    const bottomRef = useRef(null);

    const selected = conversations.find((c) => c.id === selectedId);

    const filtered = conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selected?.messages?.length]);

    function selectConvo(id) {
        setSelectedId(id);
        setMobileView("chat");
        // mark as read
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
        );
    }

    function sendMessage() {
        if (!input.trim() || !selectedId) return;
        const now = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        setConversations((prev) =>
            prev.map((c) =>
                c.id === selectedId
                    ? {
                          ...c,
                          lastMessage: input,
                          time: "Just now",
                          messages: [
                              ...c.messages,
                              {
                                  id: Date.now(),
                                  from: "me",
                                  text: input,
                                  time: now,
                                  read: false,
                              },
                          ],
                      }
                    : c,
            ),
        );
        setInput("");
    }

    return (
        <div className="flex h-[80vh] bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 font-sans">
            {/* ── Sidebar ── */}
            <div
                className={`w-80 flex-shrink-0 border-r border-gray-100 flex flex-col bg-gray-100 ${mobileView === "chat" ? "hidden sm:flex" : "flex"}`}
            >
                {/* Sidebar header */}
                <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900 mb-3">
                        Messages
                    </h2>
                    <div className="relative">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
                        />
                    </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center mt-8">
                            No conversations found
                        </p>
                    ) : (
                        filtered.map((convo) => (
                            <ConversationItem
                                key={convo.id}
                                convo={convo}
                                selected={convo.id === selectedId}
                                onClick={() => selectConvo(convo.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ── Chat area ── */}
            <div
                className={`bg-gray-200 flex-1 flex flex-col min-w-0 ${mobileView === "list" ? "hidden sm:flex" : "flex"}`}
            >
                {selected ? (
                    <>
                        {/* Chat header */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-3">
                                <button
                                    className="sm:hidden p-1 text-gray-500"
                                    onClick={() => setMobileView("list")}
                                >
                                    <TbChevronLeft className="w-5 h-5" />
                                </button>
                                <Avatar
                                    color={selected.color}
                                    initials={selected.initials}
                                    online={selected.online}
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {selected.title}
                                        </span>
                                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                            {selected.tag}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {selected.online ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                                    <TbPhone className="w-4.5 h-4.5" />
                                </button>
                                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                                    <TbVideo className="w-4.5 h-4.5" />
                                </button>
                                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                                    <TbDotsVertical className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
                            {selected.messages.map((msg) => (
                                <Message key={msg.id} msg={msg} />
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-200 focus-within:border-emerald-400 transition">
                                <button className="p-1 text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                                    <TbPaperclip className="w-4.5 h-4.5" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && sendMessage()
                                    }
                                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim()}
                                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    <TbSend className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}
