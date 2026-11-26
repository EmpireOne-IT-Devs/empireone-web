import React from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const { data } = useSelector((store) => store.app);

    const userRole = window.location.pathname.split("/")[2];

    // Profile completion
    const rawPercent = Number(data?.profile_percent);
    const percent = Number.isFinite(rawPercent)
        ? Math.min(100, Math.max(0, rawPercent))
        : 0;

    const isComplete = percent === 100;

    // Progress ring
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percent / 100);

    // Profile picture fallback
    const profileImage =
        data?.user?.profile_picture ||
        data?.user?.avatar ||
        "/images/E1Icon.png";

    // Dynamic greeting
    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
              ? "Good afternoon"
              : "Good evening";

    // Current date
    const today = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    return (
        <section className="relative isolate my-3 flex min-h-[150px] items-center justify-between gap-5 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-800 via-purple-700 to-indigo-600 px-5 py-6 shadow-md sm:px-7 lg:px-8">

            {/* Background Decorations */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <div className="absolute bottom-[-5rem] right-1/3 h-40 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
                <svg viewBox="0 0 1000 260" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-25">
                    <path d="M0 180C160 135 220 222 380 175S620 78 740 132s176 62 260 4v124H0Z" fill="white" />
                </svg>
                <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full border border-white/10" />
                <div className="absolute -bottom-36 -left-12 h-72 w-72 rounded-full border border-white/10" />
            </div>

            {/* Left Content — profile ring + text side by side */}
            <div className="relative z-10 flex min-w-0 items-center gap-5">

                {/* Profile Completion Ring (hidden on mobile) */}
                <div className="relative hidden h-28 w-28 shrink-0 sm:block">
                    <svg viewBox="0 0 112 112" className="-rotate-90" aria-hidden="true">
                        <circle
                            cx="56" cy="56" r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="56" cy="56" r={radius}
                            fill="none"
                            stroke={isComplete ? "#86efac" : "#facc15"}
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-in-out"
                        />
                    </svg>
                    <img
                        src={profileImage}
                        alt={`${data?.user?.name || "Your"} profile`}
                        className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 object-cover shadow-lg"
                    />
                    <span
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ${
                            isComplete
                                ? "bg-green-300 text-green-950"
                                : "bg-amber-300 text-amber-950"
                        }`}
                    >
                        {percent}% complete
                    </span>
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                        {greeting},{" "}
                        <span className="font-bold">{data?.user?.name || "there"}!</span>
                    </h1>
                    <p className="mt-1 text-sm text-violet-100">
                        Here's your workspace overview for {today}.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                            href={`/accounts/${userRole}/my_profile/personal`}
                            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-800 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-700"
                        >
                            View Profile
                        </Link>
                        <Link
                            href={`/accounts/${userRole}/job_openings`}
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Explore Job Openings
                            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
{/* 
            <p className="pointer-events-none absolute bottom-12 right-[320px] z-10 hidden max-w-40 text-left text-xs font-medium italic leading-relaxed text-violet-100 drop-shadow-md xl:block sm:text-sm">
                Dream. Apply. Grow.
                <br />
                Together at EmpireOne.
            </p> */}

            <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full items-end lg:flex">
                <img
                    src="/images/EmpireOne Futuristic Glass Office Tower.png"
                    alt="Side visual"
                    className="h-[900%] w-auto max-w-[500px] object-contain object-bottom drop-shadow-xl"
                />
            </div>

        </section>
    );
}