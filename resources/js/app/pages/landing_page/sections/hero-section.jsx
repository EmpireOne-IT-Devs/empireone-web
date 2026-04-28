import Button from "@/app/_components/button";
import React, { useEffect, useRef, useState } from "react";

/* ---------------- DATA ---------------- */
const jobCards = [
    {
        role: "UI/UX Designer",
        company: "TechCorp",
        pay: "$45/hr",
        type: "Remote",
        color: "#7c3aed",
    },
    {
        role: "Customer Support",
        company: "HelperHub",
        pay: "$22/hr",
        type: "Full-time",
        color: "#0ea5e9",
    },
    {
        role: "Data Analyst",
        company: "InsightCo",
        pay: "$38/hr",
        type: "Contract",
        color: "#10b981",
    },
    {
        role: "Sales Rep",
        company: "GrowthLabs",
        pay: "$30/hr",
        type: "Remote",
        color: "#f97316",
    },
    {
        role: "Virtual Assistant",
        company: "AssistPro",
        pay: "$25/hr",
        type: "Part-time",
        color: "#ec4899",
    },
    {
        role: "Content Writer",
        company: "MediaX",
        pay: "$28/hr",
        type: "Freelance",
        color: "#f59e0b",
    },
    {
        role: "Account Manager",
        company: "SalesForce",
        pay: "$42/hr",
        type: "Remote",
        color: "#6366f1",
    },
    {
        role: "IT Support",
        company: "TechSolve",
        pay: "$35/hr",
        type: "Full-time",
        color: "#14b8a6",
    },
];

/* ---------------- MAIN ---------------- */
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
            className="relative min-h-screen w-full overflow-hidden bg-[#0a0a14] text-white"
            id="home"
        >
            {/* ---------------- STYLES ---------------- */}
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
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-10 pt-10">
                {/* LEFT */}
                <div className="lg:w-[55%] font-dm space-y-6 mt-14">
                    {/* BADGES */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-semibold">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                            {activeJobs.toLocaleString()} Employees
                        </div>

                        <div className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-400 text-xs font-semibold">
                            🔥 500+ new this week
                        </div>
                    </div>

                    {/* TITLE */}
                    <h1 className="font-syne text-[clamp(48px,6vw,88px)] leading-[1.02]">
                        Your Next <br />
                        <span className="bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
                            Dream Career
                        </span>
                        <br /> Starts Here.
                    </h1>

                    <p className="text-white/60 max-w-md text-lg">
                        Join the leading BPO platform of independent
                        professionals. Get hired faster, work smarter, earn
                        more.
                    </p>

                    {/* SEARCH */}
                    <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-4 py-3 max-w-md">
                        <input
                            placeholder='Try "Virtual Assistant"...'
                            className="bg-transparent outline-none flex-1 text-sm text-white/80 placeholder:text-white/30"
                        />
                        <Button className="ml-3 px-4 py-1.5 rounded-md bg-gradient-to-r from-purple-500 to-orange-500 text-sm font-semibold hover:from-purple-400 hover:to-orange-400">
                            Search
                        </Button>
                    </div>

                    {/* TAGS */}
                    <div className="flex gap-2 flex-wrap">
                        {["Remote", "Full-time", "Tech"].map((t) => (
                            <span
                                key={t}
                                className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/60"
                            >
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="flex gap-4">
                        <Button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                            Browse Jobs
                        </Button>
                        <Button className="px-6 py-3 rounded-xl bg-white/5 border border-white/20">
                            Watch Demo
                        </Button>
                    </div>
                </div>

                {/* RIGHT */}
                {/* RIGHT SIDE */}
                <div className="lg:w-[45%] relative flex items-end justify-center z-10">
                    {/* IMAGE (BEHIND LAYER) */}
                    <div className="relative z-10 flex items-end justify-center translate-y-24">
                        <img
                            src="/images/mmm.png"
                            className="max-w-[820px] object-contain z-10"
                            alt=""
                        />
                    </div>

                    {/* ===================== FLOATING CARD 1 ===================== */}
                    <div className="absolute top-[8%] right-[-2%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-xl float">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <svg
                                    width="20"
                                    height="20"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-white/40">
                                    New Offer!
                                </p>
                                <p className="font-bold">🎉 Congratulations!</p>
                                <p className="text-sm text-purple-400">
                                    You've been hired
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===================== FLOATING CARD 2 ===================== */}
                    <div className="absolute top-[20%] left-[-8%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-xl float">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <svg
                                    width="18"
                                    height="18"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2L2 12h7v8l10-10h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-white/40">
                                    Quick Apply
                                </p>
                                <p className="font-bold">Apply Now!</p>
                                <p className="text-xs text-green-400">
                                    Fast hiring process
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===================== FLOATING CARD 3 ===================== */}
                    <div className="absolute bottom-[2%] right-[-22%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-xl float">
                        <p className="text-xs text-white/40 mb-2">
                            Recent applicants
                        </p>

                        <div className="flex -space-x-2 mb-2">
                            {["JL", "SK", "MR", "AK"].map((a) => (
                                <div
                                    key={a}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold border-2 border-[#0a0a14]"
                                >
                                    {a}
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/60 border-2 border-[#0a0a14]">
                                +48
                            </div>
                        </div>

                        <p className="text-xs text-white/60">
                            Applied in the last hour
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------------- CAROUSEL ---------------- */}
            <div className="relative z-10 mt-10 py-4 border-y border-white/10">
                {/* ROW 1 */}
                <div className="overflow-hidden mb-2">
                    <div className="flex w-max ticker-left gap-4">
                        {[...jobCards, ...jobCards].map((job, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 whitespace-nowrap"
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded"
                                    style={{ background: job.color }}
                                />
                                <span className="text-sm font-semibold text-white/85">
                                    {job.role}
                                </span>
                                <span className="text-xs text-white/40">
                                    {job.company}
                                </span>
                                <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded"
                                    style={{
                                        color: job.color,
                                        background: `${job.color}22`,
                                    }}
                                >
                                    {job.pay}
                                </span>
                                <span className="text-[11px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                                    {job.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="overflow-hidden">
                    <div className="flex w-max ticker-right gap-4">
                        {[
                            ...jobCards.slice(4),
                            ...jobCards,
                            ...jobCards.slice(0, 4),
                        ].map((job, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 whitespace-nowrap"
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded"
                                    style={{ background: job.color }}
                                />
                                <span className="text-sm font-semibold text-white/85">
                                    {job.role}
                                </span>
                                <span className="text-xs text-white/40">
                                    {job.company}
                                </span>
                                <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded"
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
