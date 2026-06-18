import React from "react";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

const COLOR_PALETTE = [
    "bg-pink-500", "bg-blue-600", "bg-purple-600", "bg-orange-500",
    "bg-teal-600",  "bg-amber-500", "bg-indigo-600", "bg-red-500",
    "bg-sky-500",   "bg-green-500", "bg-stone-500",  "bg-slate-500",
    "bg-rose-500",  "bg-violet-500","bg-cyan-500",
];

export default function BirthdayPreviewTab({ headline, message }) {
    const { birthdays, birthdayMonth, birthdayCount } = useSelector(
        (state) => state.activities
    );

    return (
        <div className="w-full border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4">
            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 relative flex flex-col items-center justify-center text-white text-center min-h-[130px]">
                <span className="absolute top-4 left-4 text-lg opacity-80 select-none">🎈</span>
                <span className="absolute bottom-4 left-6 text-sm opacity-60 select-none">✨</span>
                <span className="absolute top-4 right-4 text-lg opacity-80 select-none">🎁</span>
                <span className="absolute bottom-4 right-6 text-base opacity-60 select-none">🎉</span>
                <div className="text-2xl mb-1">🎂</div>
                <h3 className="text-lg font-bold tracking-wide">{birthdayMonth} Birthday Celebrants</h3>
                <p className="text-xs font-mono tracking-widest text-white/80 mt-0.5">
                    {new Date().getFullYear()}
                </p>
            </div>

            {/* Body */}
            <div className="p-5 text-left flex flex-col gap-3.5 text-sm text-gray-600 leading-relaxed font-medium">
                <p className="text-gray-800 font-bold">{headline}</p>
                {message.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                ))}

                <div className="mt-2 border-t border-gray-100 pt-3.5">
                    <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                        <div className="flex items-center gap-1.5">
                            <span>👥</span> {birthdayMonth} Celebrants ({birthdayCount})
                        </div>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                    <div className="flex flex-wrap gap-2.5 max-h-[110px] overflow-y-auto pr-1">
                        {birthdays.map((b, idx) => (
                            <div
                                key={b.user_id}
                                title={b.name}
                                className={`w-8 h-8 rounded-full ${COLOR_PALETTE[idx % COLOR_PALETTE.length]} text-white flex items-center justify-center font-bold text-[11px] tracking-wide shadow-sm hover:scale-105 transition-transform duration-150 cursor-default`}
                            >
                                {b.initials}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <span>Preview reactions:</span>
                    <div className="flex items-center gap-1.5 text-sm bg-gray-50/50 px-2 py-0.5 rounded-full">
                        <span>👍</span><span>❤️</span><span>🎉</span><span>🎂</span><span>👏</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

