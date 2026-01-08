import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import React from "react";
import { FaCalendar, FaVideo } from "react-icons/fa6";
import { FiMoreVertical } from "react-icons/fi";
import ViewDetailSection from "./view-details-section";
import MarkCompleteSection from "./mark-complete-section";

export default function ListApplicantSection() {
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
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {applicant.name}
                            </h3>
                            <Badge
                                label={applicant.status}
                                variant={
                                    STATUS_VARIANTS[applicant.status] ||
                                    "secondary"
                                }
                                outlined={false}
                                showDot={false}
                                className="rounded-full"
                            />
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <FiMoreVertical className="w-5 h-5" />
                        </button>
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
                            <p className="text-gray-700  mb-4">
                                {applicant.description}
                            </p>
                            <div className="p-2">
                                <span className="text-white bg-green-500 px-3 py-2 rounded-full font-bold">
                                    {applicant.recommendation}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 bg-gray-100 px-3 py-2 rounded-lg mb-6">
                            {applicant.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <ViewDetailSection />
                       <MarkCompleteSection/>
                    </div>
                </Card>
            ))}
        </div>
    );
}
