import React, { useState } from "react";
import { Image, Video, BarChart3, User, Send } from "lucide-react";

export default function CreatePostCardSection() {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        
        // Handle your post submission logic here
        console.log("Submitting post:", text);
        setText(""); // Clear input after submission
    };

    return (
        <div className="w-full font-sans flex flex-col gap-3">
                <form onSubmit={handleSubmit}>
                    {/* Top Row: Avatar and Input */}
                    <div className="flex items-center gap-3">
                        {/* Profile Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>

                        {/* Text Field Input */}
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Share an update with the floor..."
                            className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm text-slate-800 placeholder-slate-500 outline-none border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-violet-100 transition-all"
                        />
                    </div>

                    {/* Bottom Row: Actions & Conditional Post Button */}
                    <div className="flex justify-between items-center mt-3 pl-[52px]">
                        {/* Attachment Actions */}
                        <div className="flex items-center gap-5">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors group"
                            >
                                <Image className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                                <span>Photo</span>
                            </button>

                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors group"
                            >
                                <Video className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                                <span>Video</span>
                            </button>

                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors group"
                            >
                                <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                                <span>Poll</span>
                            </button>
                        </div>

                        {/* Conditional Submit Button */}
                        {text.trim() && (
                            <button
                                type="submit"
                                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs py-1.5 px-3.5 rounded-full shadow-sm transition-all animate-in fade-in zoom-in-95 duration-150"
                            >
                                <span>Post</span>
                                <Send className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </form>
        </div>
    );
}