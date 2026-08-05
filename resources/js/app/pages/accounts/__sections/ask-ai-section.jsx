import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
// import axios from 'axios'; // Make sure this is imported if using it in this file
import { ask_ai_service } from '@/app/services/ai-service';

export default function AskAiSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Manage chat history
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hi there! How can I help you today?' }
    ]);

    const inputRef = useRef(null);
    const chatEndRef = useRef(null); // Ref for auto-scrolling

    const toggleOpen = () => setIsOpen(!isOpen);

    // Auto-focus the input when the window opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Auto-scroll to bottom whenever messages or loading state change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userText = query.trim();
        if (!userText) return;

        // 1. Add user message to UI immediately & clear input
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setQuery('');
        setIsLoading(true); // Start loading animation

        try {
            // 2. Call API (passing as an object { query: userText } to match Laravel)
            const response = await ask_ai_service({ query: userText });

            // 3. Extract the reply from your Laravel API response
            const aiText = response.data.reply;

            // 4. Add AI response to UI
            setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 w-12 flex flex-col items-end">
            {/* Expanded AI Window */}
            <div
                className={`
                    mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden 
                    origin-bottom-right transition-all duration-300 ease-out flex flex-col
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto h-[450px]' : 'opacity-0 scale-90 translate-y-8 pointer-events-none h-0'}
                `}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-purple-200" />
                        <h3 className="font-semibold text-sm">Ask AI For Employee Information</h3>
                    </div>
                    <button
                        onClick={toggleOpen}
                        className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Chat Body Area */}
                <div className="p-4 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-3">

                    {/* Dynamic Message Rendering */}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg shadow-sm border max-w-[85%] ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white self-end rounded-tr-none border-purple-700'
                                    : 'bg-white text-slate-700 border-slate-100 self-start rounded-tl-none'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {msg.text}
                            </p>
                        </div>
                    ))}

                    {/* Typing / Loading Indicator */}
                    {isLoading && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 self-start rounded-tl-none flex gap-1.5 items-center">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                    )}

                    {/* Invisible div to scroll down to */}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask anything..."
                        disabled={isLoading}
                        className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-full px-4 py-2 text-sm outline-none transition-all placeholder:text-slate-400 text-slate-700 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="bg-purple-600 text-white p-2.5 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors shadow-sm"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={toggleOpen}
                className={`
                    flex items-center justify-center p-4 rounded-full shadow-lg hover:shadow-xl 
                    transition-all duration-300 transform hover:-translate-y-1 relative
                    ${isOpen ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}
                `}
            >
                <div className={`transition-all duration-300 absolute ${isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'}`}>
                    <X size={26} />
                </div>
                <div className={`transition-all duration-300 ${isOpen ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}>
                    <MessageCircle size={26} />
                </div>
            </button>
        </div>
    );
}