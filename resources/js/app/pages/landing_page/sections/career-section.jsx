import React, { useState } from "react";
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight } from "lucide-react";

const jobs = [
    {
        title: "Frontend Developer",
        location: "Remote",
        type: "Full-time",
        salary: "$1,500–$2,000/mo",
        description:
            "Build and maintain modern web interfaces using React and Tailwind CSS.",
        posted: "2 days ago",
    },
    {
        title: "Backend Developer",
        location: "Makati, PH",
        type: "Full-time",
        salary: "$1,800–$2,500/mo",
        description:
            "Develop robust APIs and backend services with Laravel and Node.js.",
        posted: "5 days ago",
    },
    {
        title: "UI/UX Designer",
        location: "Remote",
        type: "Contract",
        salary: "$1,000–$1,500/mo",
        description:
            "Design user-centric interfaces and experiences for web and mobile apps.",
        posted: "1 week ago",
    },
    {
        title: "IT Support Specialist",
        location: "Cebu, PH",
        type: "Full-time",
        salary: "$900–$1,200/mo",
        description:
            "Provide technical support and troubleshooting for internal teams.",
        posted: "3 days ago",
    },
];

const TYPE_STYLES = {
    "Full-time": "bg-green-100 text-green-800 border border-green-200",
    Contract: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    "Part-time": "bg-amber-100 text-amber-800 border border-amber-200",
};

const FILTERS = ["All roles", "Full-time", "Contract", "Remote"];

export default function CareerSection() {
    const [active, setActive] = useState("All roles");
    const [hovered, setHovered] = useState(null);

    const filtered = jobs.filter((j) => {
        if (active === "All roles") return true;
        if (active === "Remote") return j.location === "Remote";
        return j.type === active;
    });

    return (
        <section
            id="careers"
            className="relative min-h-screen overflow-hidden"
            style={{
                fontFamily:
                    "'Plus Jakarta Sans', 'Nunito', system-ui, sans-serif",
            }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("images/careers.png")` }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(234,88,12,0.35) 0%, rgba(251,146,60,0.25) 45%, rgba(0,0,0,0.4) 100%)",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 py-16 sm:py-20 lg:py-24">
                <div className="mb-12 text-center">
                    <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full mb-5"
                        style={{
                            background: "rgba(255,255,255,0.18)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.3)",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <Briefcase size={13} />
                        We&apos;re Hiring
                    </span>
                    <h2
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight"
                        style={{ textShadow: "0 2px 24px rgba(0,0,0,0.18)" }}
                    >
                        Join Our Growing Team
                    </h2>
                    <p className="text-white     text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Be part of something great at EmpireOne. We&apos;re
                        looking for passionate people to help shape the future.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActive(f)}
                            className="text-xs font-semibold px-5 py-2 rounded-full transition-all duration-200"
                            style={{
                                background:
                                    active === f
                                        ? "rgba(255,255,255,1)"
                                        : "rgba(255,255,255,0.15)",
                                color:
                                    active === f
                                        ? "#ea580c"
                                        : "rgba(255,255,255,0.9)",
                                border:
                                    active === f
                                        ? "1.5px solid rgba(255,255,255,0.9)"
                                        : "1.5px solid rgba(255,255,255,0.3)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <p className="text-white/60 text-sm py-16 text-center">
                        No openings match this filter right now.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filtered.map((job, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                className="group flex flex-col gap-4 rounded-2xl p-6 cursor-pointer transition-all duration-300"
                                style={{
                                    background:
                                        hovered === i
                                            ? "rgba(255,255,255,0.98)"
                                            : "rgba(255,255,255,0.90)",
                                    backdropFilter: "blur(16px)",
                                    border:
                                        hovered === i
                                            ? "1.5px solid rgba(234,88,12,0.4)"
                                            : "1.5px solid rgba(255,255,255,0.6)",
                                    boxShadow:
                                        hovered === i
                                            ? "0 20px 48px rgba(0,0,0,0.18)"
                                            : "0 4px 24px rgba(0,0,0,0.10)",
                                    transform:
                                        hovered === i
                                            ? "translateY(-3px)"
                                            : "translateY(0)",
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)",
                                        }}
                                    >
                                        <Briefcase
                                            size={18}
                                            className="text-white"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-sm font-bold text-gray-900">
                                                {job.title}
                                            </h3>
                                            <span
                                                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${TYPE_STYLES[job.type] ?? TYPE_STYLES["Full-time"]}`}
                                            >
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {job.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg font-medium">
                                        <MapPin
                                            size={11}
                                            className="text-orange-400"
                                        />{" "}
                                        {job.location}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg font-medium">
                                        <DollarSign
                                            size={11}
                                            className="text-orange-400"
                                        />{" "}
                                        {job.salary}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg font-medium">
                                        <Clock
                                            size={11}
                                            className="text-orange-400"
                                        />{" "}
                                        {job.posted}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <a
                                        href="/talent/application"
                                        className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 transition-all"
                                    >
                                        Apply Now
                                        <ArrowRight
                                            size={13}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-center text-white/60 text-xs mt-10">
                    Don&apos;t see a fit? Email us at{" "}
                    <a
                        href="mailto:career@empireonegroup.com"
                        className="text-white underline underline-offset-2"
                    >
                        career@empireonegroup.com
                    </a>
                </p>
            </div>
        </section>
    );
}
