import React from "react";
import { useSelector } from "react-redux";
import { Link } from "@inertiajs/react";

export default function HeaderSection() {
    const { data } = useSelector((store) => store.app);
    const user_role = window.location.pathname.split("/")[2];
    const percent = data?.profile_percent ? Number(data.profile_percent) : 0;

    const isComplete = percent === 100;

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percent / 100);

    return (
        <div className="relative isolate flex items-center justify-between my-3 bg-gradient-to-r from-purple-700 to-purple-800 rounded-2xl px-8 py-6 overflow-hidden">
            {/* Left Content */}
            <div className="flex flex-col gap-2 z-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
                    Welcome Back,
                    <span className="font-bold "> {data?.user?.name}!</span>
                </h1>
                <p className="text-blue-200 text-sm">
                    Here's what's happening in your workspace today
                </p>
                <Link
                    href={`/accounts/${user_role}/my_profile/personal`}
                    className="mt-2 inline-block w-fit border border-white text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-white hover:text-blue-700 transition"
                >
                    View Profile
                </Link>
            </div>

            {/* Right Content - Profile Ring */}
            <div className="hidden sm:flex items-center justify-center z-10">
                <div className="relative">
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        className="rotate-[-90deg]"
                    >
                        {/* Background Circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke="#1e3a8a"
                            strokeWidth="4"
                        />
                        {/* Dynamic Progress Circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={isComplete ? "#22c55e" : "#facc15"}
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    <img
                        src={data?.user?.avatar || "/images/E1Icon.png"}
                        alt="Profile"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92px] h-[92px] rounded-full object-cover border-2 border-blue-800"
                    />

                    <span
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors duration-500
                        ${isComplete ? "bg-green-500 text-white" : "bg-yellow-400 text-blue-900"}`}
                    >
                        {percent}%
                    </span>
                </div>
            </div>
        </div>
    );
}
