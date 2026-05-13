import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setJobPostingId } from "@/app/redux/app-slice";
import { ArrowDown, Briefcase, Clock, DollarSign, MapPin, Send } from "lucide-react";

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
        <div className="min-h-[80vh] flex justify-center items-start px-2">
            <div className="max-w-4xl w-full space-y-4">
                {/* Header */}
                <div className="mb-2">
                    {/* <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">
                        Open Positions
                    </p> */}
                    <h2 className="text-2xl font-extrabold text-gray-800">
                        Find Your Next Role
                    </h2>
                    {job_postings?.length > 0 && (
                        <p className="text-sm text-gray-400 mt-1">
                            {job_postings.length} position{job_postings.length !== 1 ? "s" : ""} available
                        </p>
                    )}
                </div>

                {job_postings?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
                        <Briefcase className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="font-semibold text-gray-500">No open positions right now</p>
                        <p className="text-sm text-gray-400 mt-1">Check back soon — we're always growing!</p>
                    </div>
                )}

                {job_postings?.map((res, i) => {
                    const isExpanded = expandedIndex === i;
                    return (
                        <div
                            key={i}
                            className={`rounded-2xl border bg-white shadow-sm transition-all duration-200 overflow-hidden ${
                                isExpanded
                                    ? "border-blue-300 shadow-blue-100/60 shadow-md"
                                    : "border-gray-200 hover:border-blue-200 hover:shadow-md"
                            }`}
                        >
                            {/* Card Top Bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

                            <div className="p-5 sm:p-6">
                                {/* Header Row */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    {/* Left */}
                                    <div className="flex flex-col gap-2 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                                <Briefcase className="w-3 h-3" />
                                                {res.job_requisition.employment_type}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">
                                                #{res.id}
                                            </span>
                                        </div>

                                        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 leading-tight">
                                            {res.job_requisition.title}
                                        </h1>

                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                {res.job_requisition.location.name}
                                            </span>
                                            {res.job_requisition.salary_range && (
                                                <span className="flex items-center gap-1.5">
                                                    <DollarSign className="w-3.5 h-3.5 text-green-400" />
                                                    <span className="font-semibold text-green-600">
                                                        {res.job_requisition.salary_range}
                                                    </span>
                                                </span>
                                            )}
                                            {res.job_requisition.created_at && (
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    {moment(res.job_requisition.created_at).fromNow()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right — Buttons */}
                                    <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => {
                                                dispatch(setJobPostingId(res.id));
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
                                            className={`inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold border transition-all duration-150 whitespace-nowrap ${
                                                isExpanded
                                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            {isExpanded ? "Show Less" : "Show More"}
                                            <ArrowDown
                                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                                    isExpanded ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                <div
                                    className="overflow-hidden transition-all duration-500 ease-in-out"
                                    style={{ maxHeight: isExpanded ? "2000px" : "0px" }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-gray-100">
                                        {/* Main — 2 cols */}
                                        <div className="md:col-span-2 flex flex-col gap-5">
                                            {res.job_requisition.qualifications && (
                                                <SectionCard
                                                    label="Qualifications"
                                                    icon={<Briefcase className="w-4 h-4" />}
                                                >
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: res.job_requisition.qualifications,
                                                        }}
                                                    />
                                                </SectionCard>
                                            )}
                                            {res.job_requisition.responsibilities && (
                                                <SectionCard
                                                    label="Responsibilities"
                                                    icon={<Briefcase className="w-4 h-4" />}
                                                >
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: res.job_requisition.responsibilities,
                                                        }}
                                                    />
                                                </SectionCard>
                                            )}
                                        </div>

                                        {/* Sidebar — 1 col */}
                                        <div className="flex flex-col gap-5">
                                            {res.job_requisition.justification_for_position && (
                                                <SectionCard
                                                    label="Position Overview"
                                                    icon={<Briefcase className="w-4 h-4" />}
                                                >
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: res.job_requisition.justification_for_position,
                                                        }}
                                                    />
                                                </SectionCard>
                                            )}

                                            {/* CTA Card */}
                                            <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-lg shadow-blue-200/50">
                                                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center mb-3">
                                                    <Send className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="font-bold text-base mb-1">
                                                    Ready to apply?
                                                </h3>
                                                <p className="text-blue-100 text-xs leading-relaxed mb-4">
                                                    Complete our interactive form to send your application directly to the HR team.
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        dispatch(setJobPostingId(res.id));
                                                        setStep(1);
                                                    }}
                                                    type="button"
                                                    className="w-full py-2 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 active:scale-95 transition-all duration-150"
                                                >
                                                    Apply Now
                                                </button>
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
