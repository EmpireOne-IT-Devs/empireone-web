import Card from "@/app/_components/card";
import React from "react";

/* =========================
   DATA
========================= */
const jobListings = {
    "Customer Experience & Operations": {
        subtitle:
            "Deliver exceptional support and streamline our global operations.",
        jobs: [
            {
                title: "Senior Customer Success Manager (Bilingual)",
                tags: ["Remote", "Full-time"],
            },
            {
                title: "Technical Support Specialist (L2)",
                tags: ["Remote", "Full-time", "24/7 Shift"],
            },
            { title: "Operations Team Lead", tags: ["Hybrid", "Full-time"] },
            { title: "QA Specialist Manager", tags: ["Remote", "Full-time"] },
            {
                title: "Product Support Specialist (L3)",
                tags: ["Remote", "Full-time", "24/7 Shift"],
            },
            { title: "Account Lead", tags: ["Hybrid", "Full-time"] },
        ],
    },
};

const featuredJobs = [
    { title: "Senior Customer Success Manager", tags: ["Remote", "Full-time"] },
    { title: "Senior UX Designer", tags: ["Hybrid - San Carlos", "Full-time"] },
    { title: "IT Staff (Tier 2)", tags: ["Full-time", "On-Site"] },
    { title: "Operations Team Lead", tags: ["Hybrid", "Full-time"] },
    { title: "QA Specialist Manager", tags: ["Full-time", "On-Site"] },
];

/* =========================
   ICON
========================= */
const briefcaseIcon = (
    <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-2h4v2h-4V4z" />
    </svg>
);

/* =========================
   TAG STYLE LOGIC
========================= */
const getTagStyle = (tag) =>
    tag === "24/7 Shift"
        ? {
              color: "rgba(251,146,60,0.9)",
              background: "rgba(251,146,60,0.1)",
              border: "1px solid rgba(251,146,60,0.3)",
          }
        : {
              color: "rgba(147,197,253,0.85)",
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.3)",
          };

/* =========================
   COMPONENTS
========================= */
function JobCard({ title, tags }) {
    return (
        <Card
            outlined
            padding="p-6"
            className="!flex-row items-center justify-between gap-10 !rounded-2xl !border-l-[3px] !border-l-orange-400 !border-purple-800/30 !bg-[rgba(20,8,40,0.6)] !text-white hover:!bg-purple-900/20 hover:!border-purple-500/50 transition-all duration-200"
        >
            {/* LEFT CONTENT */}
            <div className="flex flex-col gap-3">
                <p className="text-base font-semibold text-purple-100 leading-snug">
                    {title}
                </p>

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs rounded-full px-3 py-1"
                            style={
                                tag === "24/7 Shift"
                                    ? {
                                          color: "rgba(251,146,60,0.9)",
                                          background: "rgba(251,146,60,0.1)",
                                          border: "1px solid rgba(251,146,60,0.3)",
                                      }
                                    : {
                                          color: "rgba(147,197,253,0.85)",
                                          background: "rgba(59,130,246,0.1)",
                                          border: "1px solid rgba(59,130,246,0.3)",
                                      }
                            }
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* RIGHT BUTTON */}
            <button
                className="flex-shrink-0 text-sm font-bold rounded-xl px-4 py-2 whitespace-nowrap hover:scale-105 transition-transform"
                style={{
                    color: "#c084fc",
                    background: "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.3)",
                }}
            >
                Apply Now →
            </button>
        </Card>
    );
}

export default function CareerSection() {
    return (
        <section
            id="careers"
            className="relative w-full"
            style={{
                background:
                    "linear-gradient(135deg,#0d0520 0%,#130830 50%,#0a0f1f 100%)",
            }}
        >
            {/* Ambient background */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse 60% 40% at 10% 80%, rgba(168,85,247,0.13) 0%, transparent 70%),
                        radial-gradient(ellipse 40% 50% at 90% 20%, rgba(59,130,246,0.1) 0%, transparent 70%),
                        radial-gradient(ellipse 30% 35% at 60% 90%, rgba(251,146,60,0.09) 0%, transparent 70%)
                    `,
                }}
            />

            <div className="relative z-10 max-w-[1300px] mx-auto px-6 py-16 lg:py-24 w-full flex flex-col gap-10">
                {/* HEADER */}
                <div className="flex flex-col gap-3">
                    <div
                        className="inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5"
                        style={{
                            background: "rgba(168,85,247,0.12)",
                            border: "1px solid rgba(168,85,247,0.3)",
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{
                                background: "#a855f7",
                                boxShadow: "0 0 8px #a855f7",
                            }}
                        />
                        <span className="text-xs font-bold tracking-widest uppercase text-purple-300">
                            We're Hiring
                        </span>
                    </div>

                    <h2
                        className="text-4xl sm:text-5xl font-extrabold"
                        style={{
                            background:
                                "linear-gradient(90deg,#c084fc 0%,#93c5fd 55%,#fb923c 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Build Your Career With Us
                    </h2>

                    <p
                        className="text-sm"
                        style={{ color: "rgba(200,180,255,0.5)" }}
                    >
                        Join a world-class team delivering exceptional outcomes
                        across the globe.
                    </p>
                </div>

                {/* GRID */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: "1fr 400px",
                        gap: 80,
                        alignItems: "start",
                    }}
                >
                    {/* LEFT */}
                    <div className="flex flex-col gap-10">
                        {Object.entries(jobListings).map(
                            ([category, { subtitle, jobs }]) => (
                                <div
                                    key={category}
                                    className="flex flex-col gap-1"
                                >
                                    <p className="text-xs font-bold tracking-widest uppercase mb-1 text-orange-400">
                                        {category}
                                    </p>

                                    <div
                                        className="inline-flex self-start rounded-full px-4 py-1 mb-4 text-xs text-purple-300"
                                        style={{
                                            background: "rgba(168,85,247,0.1)",
                                            border: "1px solid rgba(168,85,247,0.25)",
                                        }}
                                    >
                                        {subtitle}
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        {jobs.map((job) => (
                                            <JobCard key={job.title} {...job} />
                                        ))}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    {/* RIGHT */}
                    <div
                        className="sticky top-6 flex flex-col"
                        style={{ alignSelf: "start" }}
                    >
                        <div className="relative flex justify-center items-end h-[260px] mb-[-16px]">
                            <div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                                style={{
                                    width: 190,
                                    height: 190,
                                    background:
                                        "linear-gradient(135deg,#7c3aed,#a855f7)",
                                    boxShadow: "0 0 40px rgba(168,85,247,0.4)",
                                }}
                            />

                            <img
                                src="/images/mm.png"
                                alt="Career"
                                className="relative z-20"
                                style={{
                                    height: 255,
                                    objectFit: "cover",
                                    objectPosition: "top",
                                }}
                            />
                        </div>

                        {/* FEATURED */}
                        <Card
                            outlined
                            padding="p-5"
                            className="!rounded-2xl !border-purple-700/30 !bg-[rgba(20,8,40,0.75)] !text-white gap-6 backdrop-blur-md"
                        >
                            <h3 className="text-sm font-bold text-purple-300 mb-2">
                                Featured Opportunities
                            </h3>

                            {featuredJobs.map((job, i) => (
                                <div
                                    key={job.title}
                                    className="flex items-start gap-3 pb-3"
                                    style={{
                                        borderBottom:
                                            i < featuredJobs.length - 1
                                                ? "1px solid rgba(168,85,247,0.12)"
                                                : "none",
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600">
                                        {briefcaseIcon}
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-purple-100 mb-1">
                                            {job.title}
                                        </p>

                                        <div className="flex flex-wrap gap-1">
                                            {job.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs rounded-full px-2 py-0.5 text-purple-300 bg-purple-500/10 border border-purple-500/20"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
