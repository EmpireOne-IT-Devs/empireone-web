import React from "react";
import { useSelector } from "react-redux";
import { Link } from "@inertiajs/react";

export default function HeaderSection() {
    const { data } = useSelector((store) => store.app);

    return (
        <div className="relative flex items-center justify-between my-3 bg-blue-700 rounded-2xl px-8 py-6 overflow-hidden">
            {/* Left Content */}
            <div className="flex flex-col gap-2 z-10">
                <h1 className="text-2xl md:text-3xl font-black text-white">
                    Welcome Back! {data?.user?.name}!
                </h1>
                <p className="text-blue-200 text-sm">
                    Here's what's happening in your workspace today
                </p>
                <Link
                    href="/my_profile"
                    className="mt-2 inline-block w-fit border border-white text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-white hover:text-blue-700 transition"
                >
                    View Profile
                </Link>
            </div>

            <div className="hidden sm:flex items-center justify-center z-10">
                <div className="relative">
                    <svg width="90" height="90" viewBox="0 0 90 90" className="rotate-[-90deg]">
                        <circle cx="45" cy="45" r="40" fill="none" stroke="#1e3a8a" strokeWidth="4" />
                        <circle
                            cx="45"
                            cy="45"
                            r="40"
                            fill="none"
                            stroke="#facc15"
                            strokeWidth="4"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - 0.85)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <img
                        src={data?.user?.profile_picture || "/images/empireone.png"}
                        alt="Profile"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full object-cover border-2 border-blue-800"
                    />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-yellow-400 text-[11px] font-bold text-blue-900 px-2 py-0.5 rounded-full">
                        85%
                    </span>
                </div>
            </div>
        </div>
    );
}
