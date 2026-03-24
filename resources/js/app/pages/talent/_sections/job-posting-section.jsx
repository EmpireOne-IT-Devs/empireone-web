import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setJobPostingId } from "@/app/redux/app-slice";
import Button from "@/app/_components/button";
import { ArrowDown, DollarSign, MapPin } from "lucide-react";

export default function JobPostingSection({ onApply, setStep }) {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const dispatch = useDispatch();
    const { job_postings } = useSelector((store) => store.job_postings);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    return (
        <div className="min-h-[80vh] bg-gray-50 p-6 flex justify-center items-start">
            <div className="max-w-4xl w-full space-y-2">
                {job_postings?.map((res, i) => {
                    const isExpanded = expandedIndex === i;

                    return (
                        <div key={i}>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                                            #{res.id}{" "}
                                            {
                                                res.job_requisition
                                                    .employment_type
                                            }
                                        </span>
                                        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                            {res.job_requisition.title}
                                        </h1>
                                        <div className=" flex flex-wrap  text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {
                                                    res.job_requisition.location
                                                        .name
                                                }{" "}
                                                &nbsp;
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-3.5 h-3.5" />
                                                {
                                                    res.job_requisition
                                                        .salary_range
                                                }{" "}
                                                &nbsp;
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 mt-4">
                                        <Button
                                            className="h-9"
                                            outlined
                                            onClick={async () => {
                                                dispatch(
                                                    setJobPostingId(res.id),
                                                );
                                                setStep(1);
                                            }}
                                            type="button"
                                        >
                                            Apply now
                                        </Button>
                                        <Button
                                        
                                            variant="secondary"
                                            onClick={() => toggleExpand(i)}
                                            type="button"
                                            className="h-9 "
                                        >
                                            <span className="flex items-center">
                                                {isExpanded
                                                    ? "Show Less"
                                                    : "Show More"}
                                                <ArrowDown
                                                    className={`ml-2 h-3.5 w-3.5 transition-transform duration-300 ${
                                                        isExpanded
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    className={`grid mt-6 grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[2000px]" : "max-h-[0px]"}`}
                                >
                                    {/* Main Details */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div className={`relative }`}>
                                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                                    Job Qualifications
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {
                                                        res.job_requisition
                                                            .qualifications
                                                    }
                                                </p>
                                            </section>

                                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                                    Justification for Position
                                                </h3>
                                                <ul className="space-y-3">
                                                    {
                                                        res.job_requisition
                                                            .justification_for_position
                                                    }
                                                </ul>
                                            </section>

                                            {/* Gradient overlay when collapsed */}
                                            {!isExpanded && (
                                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                                            )}
                                        </div>

                                        {/* Toggle Button */}
                                    </div>

                                    {/* Sidebar Details */}
                                    <div className="space-y-6">
                                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                                Job Responsibility
                                            </h3>
                                            <ul className="space-y-3">
                                                {
                                                    res.job_requisition
                                                        .responsibilities
                                                }
                                            </ul>
                                        </section>

                                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
                                            <h3 className="font-bold text-lg mb-2">
                                                Ready to apply?
                                            </h3>
                                            <p className="text-blue-100 text-sm mb-4">
                                                Complete our interactive form to
                                                send your application directly
                                                to the HR team.
                                            </p>
                                            <p className="text-xs text-blue-200 italic">
                                                {moment(
                                                    res.job_requisition
                                                        .created_at,
                                                )
                                                    .startOf("day")
                                                    .fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
