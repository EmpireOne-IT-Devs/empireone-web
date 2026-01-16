import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import Button from "@/app/_components/button";
import React, { useEffect, useState } from "react";
import { FaCalendar, FaVideo } from "react-icons/fa6";
import { FiMoreVertical, FiEye, FiClock, FiXCircle } from "react-icons/fi";

import ViewDetailSection from "./view-details-section";
import MarkCompleteSection from "./mark-complete-section";
import CancelInterviewSection from "./cancel-interview-section";

export default function ListApplicantSection() {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [openMarkComplete, setOpenMarkComplete] = useState(false);
    const [openCancelInterview, setOpenCancelInterview] = useState(false);

    const [openViewDetail, setOpenViewDetail] = useState(false);

    useEffect(() => {
        function handleClickOutside() {
            setOpenMenuIndex(null);
        }

        if (openMenuIndex !== null) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openMenuIndex]);

    const applicants = [
        {
            name: "John Smith",
            status: "Scheduled",
            role: "Senior Software Engineer",
            type: "Online",
            date: "12/20/2024",
            time: "10:00",
            description: "Technical interview - Focus on React and Node.js",
            recommendation: "",
        },
        {
            name: "Mike Chen",
            status: "Scheduled",
            role: "Marketing Specialist",
            type: "In-Person",
            date: "12/22/2024",
            time: "14:00",
            description: "HR and culture fit interview",
            recommendation: "",
        },
        {
            name: "Sarah Johnson",
            status: "Completed",
            role: "HR Manager",
            type: "Online",
            date: "12/15/2024",
            time: "11:00",
            description:
                "Interview Feedback: Outstanding candidate. Highly recommend moving forward with an offer.",
            recommendation: "Strongly Recommend",
        },
    ];

    const STATUS_VARIANTS = {
        Scheduled: "primary",
        Completed: "success",
        Cancelled: "danger",
        Rescheduled: "warning",
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {applicants.map((applicant, index) => (
                <Card key={index} className="rounded-xl border p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {applicant.name}
                            </h3>
                            <Badge
                                label={applicant.status}
                                variant={
                                    STATUS_VARIANTS[applicant.status] ??
                                    "secondary"
                                }
                                className="rounded-full"
                            />
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuIndex(
                                        openMenuIndex === index ? null : index
                                    );
                                }}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
                            >
                                <FiMoreVertical className="w-5 h-5" />
                            </button>

                            {openMenuIndex === index && (
                                <div
                                    className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => {
                                            setOpenMenuIndex(null);
                                            setOpenViewDetail(true);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        <FiEye className="mr-2" />
                                        View Details
                                    </button>

                                    <button
                                        onClick={() => {
                                            setOpenMenuIndex(null);
                                            setOpenMarkComplete(true);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        <FiClock className="mr-2" />
                                        Mark Complete
                                    </button>

                                    <button
                                        onClick={() => {
                                            setOpenMenuIndex(null);
                                            setOpenCancelInterview(true);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                    >
                                        <FiXCircle className="mr-2" />
                                        Cancel Interview
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 mb-3">{applicant.role}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1.5">
                            <FaVideo className="w-4 h-4" />
                            {applicant.type}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FaCalendar className="w-4 h-4" />
                            {applicant.date} at {applicant.time}
                        </span>
                    </div>

                    {applicant.recommendation ? (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                            <p className="text-gray-700 mb-4">
                                {applicant.description}
                            </p>
                            <span className="text-white bg-green-500 px-3 py-2 rounded-full font-bold">
                                {applicant.recommendation}
                            </span>
                        </div>
                    ) : (
                        <p className="text-gray-700 bg-gray-100 px-3 py-2 rounded-lg mb-6">
                            {applicant.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <ViewDetailSection />
                        </div>
                        <Button
                            type="button"
                            onClick={() => setOpenMarkComplete(true)}
                            variant="primary"
                            className="px-7 py-2.5 text-sm rounded-lg whitespace-nowrap"
                        >
                            Mark as Completed
                        </Button>
                    </div>
                </Card>
            ))}

            <MarkCompleteSection
                isOpen={openMarkComplete}
                onClose={() => setOpenMarkComplete(false)}
            />
            <CancelInterviewSection
                isOpen={openCancelInterview}
                onClose={() => setOpenCancelInterview(false)}
            />
            <ViewDetailSection
                isOpen={openViewDetail}
                onClose={() => setOpenViewDetail(false)}
            />
        </div>
    );
}
