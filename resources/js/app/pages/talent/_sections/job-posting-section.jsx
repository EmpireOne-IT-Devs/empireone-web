import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setJobPostingId } from "@/app/redux/app-slice";
import {
    ArrowDown,
    Briefcase,
    Clock,
    DollarSign,
    MapPin,
    Send,
} from "lucide-react";
import { TbUsers } from "react-icons/tb";

const SectionCard = ({ label, icon, children }) => (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <span className="text-blue-500">{icon}</span>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                {label}
            </h3>
        </div>
        <div className="px-6 py-5 text-gray-600 text-sm leading-relaxed overflow-auto max-h-64">
            {children}
        </div>
    </div>
);

export default function JobPostingSection({ onApply, setStep }) {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const dispatch = useDispatch();
    const { job_postings } = useSelector((store) => store.job_postings);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col h-[80vh] px-2">
            {/* Sticky Header */}
            <div className="sticky top-0 z-1 pb-3 pt-1 border-b border-gray-100 mb-4">
                <h2 className="text-2xl font-extrabold text-gray-800">
                    Find Your Next Role
                </h2>
                {job_postings?.length > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                        {job_postings.length} position
                        {job_postings.length !== 1 ? "s" : ""} available
                    </p>
                )}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                {job_postings?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
                        <Briefcase className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="font-semibold text-gray-500">
                            No open positions right now
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Check back soon — we're always growing!
                        </p>
                    </div>
                )}

                {job_postings?.map((res, i) => {
                    const isExpanded = expandedIndex === i;
                    return (
                        <div
                            key={i}
                            className={`rounded-2xl border bg-white shadow-sm transition-all duration-200 overflow-hidden ${isExpanded
                                    ? "border-blue-300 shadow-blue-100/60 shadow-md"
                                    : "border-gray-200 hover:border-blue-200 hover:shadow-md"
                                }`}
                        >
                            {/* Card Top Bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-orange-500" />

                            <div className="p-5 sm:p-6">
                                {/* Header Row */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    {/* Left */}
                                    <div className="flex flex-col gap-2 min-w-0">
                                        <h1 className="text-xl font-bold text-gray-800  uppercase">
                                            {res.job_requisition.title}
                                        </h1>

                                        <div className="flex flex-wrap gap-3 text-md text-gray-500 mt-1">
                                            <span className="flex items-center gap-1.5">
                                                <Briefcase className="w-3 h-3" />
                                                {
                                                    res.job_requisition
                                                        .employment_type
                                                }
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {
                                                    res.job_requisition.location
                                                        .name
                                                }
                                            </span>


                                            {res.job_requisition.created_at && (
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    {moment(
                                                        res.job_requisition
                                                            .created_at,
                                                    ).fromNow()}
                                                </span>
                                            )}


                                            <div className="flex items-center gap-2 shrink-0">
                                                <TbUsers className="text-gray-600 w-4 h-4" />
                                                <span className="capitalize">
                                                    {res.job_requisition?.account?.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right — Buttons */}
                                    <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => {
                                                dispatch(
                                                    setJobPostingId(res.id),
                                                );
                                                setStep(1);
                                            }}
                                            type="button"
                                            className="inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm shadow-blue-200 whitespace-nowrap"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            Apply Now
                                        </button>
                                        <button
                                            onClick={() => toggleExpand(i)}
                                            type="button"
                                            className={`inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold border transition-all duration-150 whitespace-nowrap ${isExpanded
                                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                                }`}
                                        >
                                            {isExpanded
                                                ? "Show Less"
                                                : "Show More"}
                                            <ArrowDown
                                                className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                <div
                                    className="overflow-hidden transition-all duration-500 ease-in-out"
                                    style={{
                                        maxHeight: isExpanded
                                            ? "2000px"
                                            : "0px",
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-gray-100">
                                        {/* Main — 2 cols */}
                                        <div className="md:col-span-2 flex flex-col gap-5">
                                            {res.job_requisition
                                                .qualifications && (
                                                    <SectionCard label="Qualifications">
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: res
                                                                    .job_requisition
                                                                    .qualifications,
                                                            }}
                                                        />
                                                    </SectionCard>
                                                )}
                                            {res.job_requisition
                                                .responsibilities && (
                                                    <SectionCard label="Responsibilities">
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: res
                                                                    .job_requisition
                                                                    .responsibilities,
                                                            }}
                                                        />
                                                    </SectionCard>
                                                )}
                                        </div>

                                        {/* Sidebar — 1 col */}
                                        <div className="flex flex-col gap-5">
                                            {res.job_requisition
                                                .justification_for_position && (
                                                    <SectionCard label="Position Overview">
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: res
                                                                    .job_requisition
                                                                    .justification_for_position,
                                                            }}
                                                        />
                                                    </SectionCard>
                                                )}

                                            {/* What to expect card */}
                                            <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-lg shadow-blue-200/50">
                                                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center mb-3">
                                                    <Clock className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="font-bold text-base mb-3">
                                                    What to expect
                                                </h3>
                                                <ul className="flex flex-col gap-2.5">
                                                    {[
                                                        "Fill out the application form",
                                                        "HR reviews your submission",
                                                        "Schedule an interview",
                                                        "Receive an offer letter",
                                                    ].map((step, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2.5 text-xs text-blue-100"
                                                        >
                                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                                                                {idx + 1}
                                                            </span>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="text-blue-200 text-xs mt-4 italic">
                                                    Posted{" "}
                                                    {moment(
                                                        res.job_requisition
                                                            .created_at,
                                                    ).fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
