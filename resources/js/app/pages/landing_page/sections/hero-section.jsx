import Button from "@/app/_components/button";
import { Android, Apple, Windows } from "@thesvg/react";
import React, { useEffect, useRef, useState } from "react";

const jobCards = [
    {
        role: "UI/UX Designer",
        company: "TechCorp",
        pay: "₱45,000/mo",
        type: "Remote",
        color: "#7c3aed",
    },
    {
        role: "Customer Support",
        company: "HelperHub",
        pay: "₱12,000/mo",
        type: "Full-time",
        color: "#0ea5e9",
    },
    {
        role: "Data Analyst",
        company: "InsightCo",
        pay: "₱38,000/mo",
        type: "Contract",
        color: "#10b981",
    },
    {
        role: "Sales Rep",
        company: "GrowthLabs",
        pay: "₱30,000/mo",
        type: "Remote",
        color: "#f97316",
    },
    {
        role: "Virtual Assistant",
        company: "AssistPro",
        pay: "₱25,000/mo",
        type: "Part-time",
        color: "#ec4899",
    },
    {
        role: "TA Staff",
        company: "MediaX",
        pay: "₱28,000/mo",
        type: "Freelance",
        color: "#f59e0b",
    },
    {
        role: "Account Manager",
        company: "SalesForce",
        pay: "₱42,000/mo",
        type: "Remote",
        color: "#6366f1",
    },
    {
        role: "IT Support",
        company: "TechSolve",
        pay: "₱35,000/mo",
        type: "Full-time",
        color: "#14b8a6",
    },
];
export default function HeroSection() {
    const [activeJobs, setActiveJobs] = useState(12483);

    useEffect(() => {
        const t = setInterval(() => {
            setActiveJobs((p) => p + Math.floor(Math.random() * 3));
        }, 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <section
            className="relative sm:min-h-screen w-full overflow-hidden bg-[#0a0a14] text-white flex flex-col"
            id="home"
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .ticker-left { animation: scrollLeft 35s linear infinite; }
        .ticker-right { animation: scrollRight 28s linear infinite; }

        .ticker-left:hover,
        .ticker-right:hover { animation-play-state: paused; }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .float { animation: float 4s ease-in-out infinite; }
      `}</style>

            {/* ---------------- BACKGROUND ---------------- */}
            <div className="absolute inset-0 bg-[#0a0a14]" />
            <div className="absolute w-[700px] h-[700px] bg-purple-600/30 blur-3xl rounded-full -top-40 -left-32" />
            <div className="absolute w-[600px] h-[600px] bg-orange-500/20 blur-3xl rounded-full top-20 -right-24" />
            <div className="absolute w-[400px] h-[400px] bg-sky-500/20 blur-3xl rounded-full bottom-10 left-1/3" />

            {/* ---------------- HERO ---------------- */}
            <div className="relative z-10 sm:flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 pt-20 sm:pt-24 lg:pt-10 pb-8 sm:pb-0">
                {/* LEFT */}
                <div className="w-full lg:w-[55%] font-dm space-y-4 sm:space-y-5 lg:space-y-6 mt-0 sm:mt-4 lg:mt-14 text-center lg:text-left">
                    {/* BADGES */}
                    <div className="flex gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start">
                        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[10px] sm:text-xs font-semibold">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                            {activeJobs.toLocaleString()} Employees
                        </div>

                        <div className="px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-400 text-[10px] sm:text-xs font-semibold">
                            🔥 500+ new this week
                        </div>
                    </div>

                    {/* TITLE */}
                    <h1 className="font-syne text-[clamp(32px,8vw,88px)] sm:text-[clamp(40px,7vw,88px)] lg:text-[clamp(48px,6vw,88px)] leading-[1.1] sm:leading-[1.05] lg:leading-[1.02]">
                        Your Next <br />
                        <span className="bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
                            Dream Career
                        </span>
                        <br /> Starts Here.
                    </h1>

                    <p className="text-white/60 max-w-md mx-auto lg:mx-0 text-base sm:text-lg px-4 sm:px-0">
                        Join the leading BPO platform of independent
                        professionals. Get hired faster, work smarter, earn
                        more.
                    </p>

                    {/* SEARCH */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/10 border border-white/10 rounded-xl p-3 sm:px-4 sm:py-3 max-w-md mx-auto lg:mx-0 gap-3 sm:gap-0">
                        <input
                            placeholder='Try "Virtual Assistant"...'
                            className="bg-transparent outline-none flex-1 text-sm text-white/80 placeholder:text-white/30 min-w-0"
                        />
                        <Button className="sm:ml-3 px-4 py-2 sm:py-1.5 rounded-md bg-gradient-to-r from-purple-500 to-orange-500 text-sm font-semibold hover:from-purple-400 hover:to-orange-400 whitespace-nowrap">
                            Search
                        </Button>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap gap-2 px-4 sm:px-0 max-w-md mx-auto lg:mx-0">
                        <Button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/20 text-xs font-medium whitespace-nowrap">
                            Mobile App <Android className="w-3.5 h-3.5" />
                        </Button>
                        <Button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/20 text-xs font-medium whitespace-nowrap">
                            Windows <Windows className="w-3.5 h-3.5" />
                        </Button>
                        <Button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/20 text-xs font-medium whitespace-nowrap">
                            Mac <Apple className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                {/* RIGHT */}
                {/* RIGHT SIDE */}
                <div className="hidden sm:flex w-full lg:w-[45%] relative items-end justify-center z-10 lg:self-end">
                    {/* IMAGE */}
                    <img
                        src="/images/mmm.png"
                        className="max-w-[480px] sm:max-w-[700px] md:max-w-[960px] lg:max-w-none lg:w-[130%] object-contain w-full"
                        alt=""
                    />

                    {/* ===================== FLOATING CARD 1 ===================== */}
                    <div className="hidden sm:block absolute top-[8%] right-[-2%] lg:right-[-2%] md:right-[2%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 shadow-xl float max-w-[180px] sm:max-w-none">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                <svg
                                    width="16"
                                    height="16"
                                    className="sm:w-5 sm:h-5"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-white/40">
                                    New Offer!
                                </p>
                                <p className="font-bold text-xs sm:text-sm truncate">
                                    🎉 Congratulations!
                                </p>
                                <p className="text-xs sm:text-sm text-purple-400 truncate">
                                    You've been hired
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===================== FLOATING CARD 2 ===================== */}
                    <div className="hidden md:block absolute top-[2%] left-[-2%] lg:left-[-8%] md:left-[-4%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 shadow-xl float max-w-[180px] sm:max-w-none">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                                <svg
                                    width="14"
                                    height="14"
                                    className="sm:w-[18px] sm:h-[18px]"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2L2 12h7v8l10-10h-7z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-white/40">
                                    Quick Apply
                                </p>
                                <p className="font-bold text-xs sm:text-sm truncate">
                                    Apply Now!
                                </p>
                                <p className="text-[10px] sm:text-xs text-green-400 truncate">
                                    Fast hiring process
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===================== FLOATING CARD 3 ===================== */}
                    <div className="hidden sm:block absolute bottom-[2%] right-[-22%] lg:right-[-22%] md:right-[-10%] sm:right-[-15%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 shadow-xl float max-w-[160px] sm:max-w-none">
                        <p className="text-[10px] sm:text-xs text-white/40 mb-2">
                            Recent applicants
                        </p>

                        <div className="flex -space-x-2 mb-2">
                            {["JL", "SK", "MR", "AK"].map((a) => (
                                <div
                                    key={a}
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[8px] sm:text-[10px] font-bold border-2 border-[#0a0a14]"
                                >
                                    {a}
                                </div>
                            ))}
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-[8px] sm:text-[10px] text-white/60 border-2 border-[#0a0a14]">
                                +48
                            </div>
                        </div>

                        <p className="text-[10px] sm:text-xs text-white/60">
                            Applied in the last hour
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------------- CAROUSEL ---------------- */}
            <div className="relative z-20 py-3 sm:py-4 border-y border-white/10">
                {/* ROW 1 */}
                <div className="overflow-hidden mb-1.5 sm:mb-2">
                    <div className="flex w-max ticker-left gap-2 sm:gap-3 lg:gap-4">
                        {[...jobCards, ...jobCards].map((job, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 whitespace-nowrap"
                            >
                                <div
                                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded flex-shrink-0"
                                    style={{ background: job.color }}
                                />
                                <span className="text-xs sm:text-sm font-semibold text-white/85">
                                    {job.role}
                                </span>
                                <span className="text-[10px] sm:text-xs text-white/40 hidden sm:inline">
                                    {job.company}
                                </span>
                                <span
                                    className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded"
                                    style={{
                                        color: job.color,
                                        background: `${job.color}22`,
                                    }}
                                >
                                    {job.pay}
                                </span>
                                <span className="text-[10px] sm:text-[11px] text-white/40 bg-white/5 px-1.5 sm:px-2 py-0.5 rounded hidden md:inline">
                                    {job.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="overflow-hidden">
                    <div className="flex w-max ticker-right gap-2 sm:gap-3 lg:gap-4">
                        {[
                            ...jobCards.slice(4),
                            ...jobCards,
                            ...jobCards.slice(0, 4),
                        ].map((job, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 whitespace-nowrap"
                            >
                                <div
                                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded flex-shrink-0"
                                    style={{ background: job.color }}
                                />
                                <span className="text-xs sm:text-sm font-semibold text-white/85">
                                    {job.role}
                                </span>
                                <span className="text-[10px] sm:text-xs text-white/40 hidden sm:inline">
                                    {job.company}
                                </span>
                                <span
                                    className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded"
                                    style={{
                                        color: job.color,
                                        background: `${job.color}22`,
                                    }}
                                >
                                    {job.pay}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
