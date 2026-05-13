import Card from "@/app/_components/card";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { router } from "@inertiajs/react";
import store from "@/app/store/store";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import { setJobPostingId } from "@/app/redux/app-slice";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
/* =========================
   HELPERS
========================= */
function buildTags(posting) {
    const tags = [];
    const location = posting.job_requisition?.location?.name;
    const employment = posting.job_requisition?.employment_type;
    if (location) tags.push(location);
    if (employment) tags.push(employment);
    return tags;
}

/* Parse the upper bound of a salary_range string like "₱20,000 - ₱50,000" */
function parseSalaryUpperBound(salaryRange) {
    if (!salaryRange) return 0;
    const parts = salaryRange.split("-");
    const upper = parts[parts.length - 1].replace(/[^\d]/g, "");
    return parseInt(upper, 10) || 0;
}

/* One highest-salary job per department */
function topJobPerDepartment(postings) {
    const map = {};
    postings.forEach((posting) => {
        const dept = posting.job_requisition?.department?.name ?? "General";
        const salary = parseSalaryUpperBound(
            posting.job_requisition?.salary_range,
        );
        if (!map[dept] || salary > map[dept].salary) {
            map[dept] = { posting, salary };
        }
    });
    return Object.values(map).map((v) => v.posting);
}

function groupByDepartment(postings) {
    return postings.reduce((acc, posting) => {
        const dept = posting.job_requisition?.department?.name ?? "General";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(posting);
        return acc;
    }, {});
}

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
function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-purple-800/30 bg-[rgba(20,8,40,0.6)] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10">
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-purple-900/50 rounded w-3/4" />
                <div className="flex gap-2">
                    <div className="h-5 w-16 bg-blue-900/40 rounded-full" />
                    <div className="h-5 w-20 bg-blue-900/40 rounded-full" />
                </div>
            </div>
            <div className="h-8 w-24 bg-purple-900/40 rounded-xl self-start sm:self-auto" />
        </div>
    );
}

function JobCard({ id, title, tags, onApply, posting }) {
    const [expanded, setExpanded] = useState(false);
    const req = posting?.job_requisition;

    return (
        <Card
            outlined
            padding="p-5 sm:p-6"
            className="!flex-col !rounded-2xl !border-l-[3px] !border-l-orange-400 !border-purple-800/30 !bg-[rgba(20,8,40,0.6)] !text-white hover:!border-purple-500/50 transition-all duration-200"
        >
            {/* TOP ROW */}
            <div className="flex flex-row items-start justify-between gap-4">
                {/* LEFT CONTENT */}
                <div className="flex flex-col gap-3 min-w-0">
                    <p className="text-base font-bold text-purple-100 leading-snug uppercase tracking-wide">
                        {title}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs rounded-full px-3 py-1"
                                style={getTagStyle(tag)}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                    {/* APPLY BUTTON */}
                    <button
                        onClick={() => onApply(id)}
                        className="w-auto h-10 flex items-center justify-center text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 hover:scale-105"
                        style={{
                            color: "#c084fc",
                            background: "rgba(168,85,247,0.12)",
                            border: "1px solid rgba(168,85,247,0.3)",
                        }}
                    >
                        Apply Now
                    </button>

                    {/* VIEW BUTTON */}
                    <button
                        onClick={() => setExpanded((p) => !p)}
                        className="w-24 h-10 flex items-center justify-center  text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200"
                        style={{
                            color: expanded
                                ? "#fb923c"
                                : "rgba(200,180,255,0.6)",
                            background: expanded
                                ? "rgba(251,146,60,0.1)"
                                : "rgba(255,255,255,0.05)",
                            border: expanded
                                ? "1px solid rgba(251,146,60,0.3)"
                                : "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <span>
                            {expanded ? "Hide Details" : "View Details"}
                        </span>

                        {/* <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ml-1 ${
                                expanded ? "rotate-180" : "rotate-0"
                            }`}
                        /> */}
                    </button>
                </div>
            </div>

            {/* EXPANDABLE DETAILS */}
            <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight: expanded ? "1000px" : "0px" }}
            >
                <div
                    className="flex flex-col gap-4 mt-5 pt-5"
                    style={{
                        borderTop: "1px solid rgba(168,85,247,0.15)",
                        maxHeight: expanded ? "400px" : "0px",
                        overflowY: expanded ? "auto" : "hidden",
                    }}
                >
                    {req?.qualifications && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
                                Job Qualifications
                            </p>
                            <div
                                className="text-sm leading-relaxed prose-sm"
                                style={{ color: "rgba(200,180,255,0.7)" }}
                                dangerouslySetInnerHTML={{
                                    __html: req.qualifications,
                                }}
                            />
                        </div>
                    )}
                    {req?.responsibilities && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
                                Job Responsibilities
                            </p>
                            <div
                                className="text-sm leading-relaxed"
                                style={{ color: "rgba(200,180,255,0.7)" }}
                                dangerouslySetInnerHTML={{
                                    __html: req.responsibilities,
                                }}
                            />
                        </div>
                    )}
                    {req?.justification_for_position && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
                                Justification for Position
                            </p>
                            <div
                                className="text-sm leading-relaxed"
                                style={{ color: "rgba(200,180,255,0.7)" }}
                                dangerouslySetInnerHTML={{
                                    __html: req.justification_for_position,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

export default function CareerSection() {
    const { job_postings, loading } = useSelector(
        (state) => state.job_postings,
    );

    useEffect(() => {
        store.dispatch(get_job_posting_thunk());
    }, []);

    const handleApply = (id) => {
        store.dispatch(setJobPostingId(id));
        router.visit("/talent/application");
    };

    const grouped = groupByDepartment((job_postings ?? []).slice(0, 5));
    const featuredJobs = topJobPerDepartment(job_postings ?? []);

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

            <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 w-full flex flex-col gap-8 sm:gap-10">
                {/* HEADER */}
                <div className="flex flex-col gap-3">
                    <div
                        className="inline-flex items-center gap-2 self-start rounded-full px-3 sm:px-4 py-1.5"
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
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold"
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
                    className="flex flex-col lg:grid lg:gap-16 xl:gap-20"
                    style={{
                        gridTemplateColumns: "1fr 380px",
                        alignItems: "start",
                    }}
                >
                    {/* LEFT — job listings grouped by department */}
                    <div className="flex flex-col gap-8 sm:gap-6">
                        {loading ? (
                            <div className="flex flex-col gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : Object.keys(grouped).length === 0 ? (
                            <div
                                className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-purple-800/20"
                                style={{ background: "rgba(20,8,40,0.4)" }}
                            >
                                <p className="text-purple-300 font-semibold text-lg mb-1">
                                    No open positions right now
                                </p>
                                <p
                                    className="text-sm"
                                    style={{ color: "rgba(200,180,255,0.4)" }}
                                >
                                    Check back soon — we're always growing!
                                </p>
                            </div>
                        ) : (
                            <>
                                {Object.entries(grouped).map(
                                    ([department, postings]) => (
                                        <div
                                            key={department}
                                            className="flex flex-col gap-1"
                                        >
                                            <p className="text-xs font-bold tracking-widest uppercase mb-1 text-orange-400">
                                                {department}
                                            </p>
                                            <div className="flex flex-col gap-6">
                                                {postings.map((posting) => (
                                                    <JobCard
                                                        key={posting.id}
                                                        id={posting.id}
                                                        title={
                                                            posting
                                                                .job_requisition
                                                                ?.title
                                                        }
                                                        tags={buildTags(
                                                            posting,
                                                        )}
                                                        onApply={handleApply}
                                                        posting={posting}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                )}
                                {(job_postings ?? []).length > 5 && (
                                    <div className="flex justify-center mt-2">
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    "/talent/application",
                                                )
                                            }
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                                        >
                                            See More Openings
                                            <ChevronDown
                                                size={15}
                                                className="-rotate-90"
                                            />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* RIGHT — sticky sidebar */}
                    <div
                        className="hidden lg:flex lg:sticky lg:top-6 flex-col"
                        style={{ alignSelf: "start" }}
                    >
                        {/* Wrapper: image behind, card in front */}
                        <div className="relative">
                            {/* Image + orb — z-0, behind card */}
                            <div className="relative flex justify-center items-end h-[280px]">
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full z-0"
                                    style={{
                                        width: 180,
                                        height: 180,
                                        background:
                                            "linear-gradient(135deg,#7c3aed,#a855f7)",
                                        boxShadow:
                                            "0 0 50px rgba(168,85,247,0.5)",
                                    }}
                                />
                                <img
                                    src="/images/mm.png"
                                    alt="Career"
                                    className="relative z-[1] drop-shadow-2xl"
                                    draggable="false"
                                    onDragStart={(e) => e.preventDefault()}
                                    style={{
                                        height: 260,
                                        objectFit: "cover",
                                        objectPosition: "top",
                                        userSelect: "none",
                                        WebkitUserDrag: "none",
                                    }}
                                />
                            </div>

                            {/* Card — z-10, pulled up over image with negative margin */}
                            <Card
                                outlined
                                padding="p-5"
                                className="relative z-10 -mt-16 !rounded-2xl !border-purple-700/30 !bg-[rgba(20,8,40,0.90)] !text-white backdrop-blur-md flex flex-col gap-0"
                            >
                                <h3 className="text-sm font-bold text-purple-300 mb-3">
                                    Featured Opportunities
                                </h3>

                                {featuredJobs.length === 0 ? (
                                    <p
                                        className="text-xs"
                                        style={{
                                            color: "rgba(200,180,255,0.4)",
                                        }}
                                    >
                                        New openings coming soon — stay tuned!
                                    </p>
                                ) : (
                                    featuredJobs.map((job, i) => (
                                        <div
                                            key={job.id}
                                            className="flex items-start gap-3 py-3"
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
                                                    {job.job_requisition?.title}
                                                </p>
                                                {job.job_requisition
                                                    ?.salary_range && (
                                                    <p className="text-xs font-bold text-orange-400 mb-1">
                                                        {
                                                            job.job_requisition
                                                                .salary_range
                                                        }
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-1">
                                                    {buildTags(job).map(
                                                        (tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-xs rounded-full px-2 py-0.5 text-purple-300 bg-purple-500/10 border border-purple-500/20"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
