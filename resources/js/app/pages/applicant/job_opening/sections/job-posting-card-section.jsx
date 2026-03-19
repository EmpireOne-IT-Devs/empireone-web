import React from "react";
import Card from "@/app/_components/card";
import {
    TbBriefcase,
    TbMapPin,
    TbClock,
    TbCurrencyDollar,
    TbUsers,
} from "react-icons/tb";
import ViewJobPostingDetailsSection from "./view-job-posting-section";
import Badge from "@/app/_components/badge";

const STATIC_JOB_POSTINGS = [
    {
        id: 1,
        status: "Active",
        posting_type: "Both",
        posted: "12/1/2024",
        application_deadline: "12/31/2024",
        experience_required: "At least 2 years of relevant experience",
        education_required: "Bachelor's Degree in Information Technology",
        applications: [{}, {}],
        job_requisition: {
            title: "Senior Software Engineer",
            employment_type: "Full-time",
            salary_range: "₱80,000 - ₱120,000",
            department: { name: "IT" },
            location: { name: "Manila" },
            justification_for_position:
                "<p>We need a Senior Software Engineer to lead development efforts.</p>",
            qualifications:
                "<ul><li>5+ years experience</li><li>Proficient in React and Node.js</li></ul>",
        },
    },
    {
        id: 2,
        status: "Draft",
        posting_type: "Internal",
        posted: "12/5/2024",
        application_deadline: "1/15/2025",
        experience_required: "At least 3 years in product design",
        education_required: "Bachelor's Degree in Design or related field",
        applications: [{}],
        job_requisition: {
            title: "Product Designer",
            employment_type: "Full-time",
            salary_range: "₱60,000 - ₱90,000",
            department: { name: "Design" },
            location: { name: "Cebu" },
            justification_for_position:
                "<p>Looking for a creative Product Designer to shape our user experience.</p>",
            qualifications:
                "<ul><li>Figma proficiency</li><li>Strong portfolio required</li></ul>",
        },
    },
    {
        id: 3,
        status: "Closed",
        posting_type: "External",
        posted: "11/1/2024",
        application_deadline: "11/30/2024",
        experience_required: "1-2 years in HR",
        education_required: "Bachelor's Degree in Human Resources",
        applications: [],
        job_requisition: {
            title: "HR Specialist",
            employment_type: "Part-time",
            salary_range: "₱30,000 - ₱45,000",
            department: { name: "Human Resources" },
            location: { name: "Remote" },
            justification_for_position:
                "<p>We are hiring an HR Specialist to support our growing team.</p>",
            qualifications:
                "<ul><li>Knowledge of labor laws</li><li>Strong communication skills</li></ul>",
        },
    },
];

export default function JobPostingCardSection() {
    const job_postings = STATIC_JOB_POSTINGS;

    return (
        <div className="flex flex-col gap-3">
            {job_postings.map((job) => (
                <ViewJobPostingDetailsSection key={job.id} data={job}>
                    <Card>
                        <div className="flex flex-col gap-3">
                            {/* Top row: title + badges */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {job?.job_requisition?.title}
                                    </h3>

                                    <Badge
                                        showDot={false}
                                        className="rounded-full px-3 py-0.5 text-xs"
                                        variant={
                                            job.status === "Active"
                                                ? "success"
                                                : job.status === "Draft"
                                                  ? "warning"
                                                  : job.status === "Closed"
                                                    ? "primary"
                                                    : "default"
                                        }
                                        label={job.status}
                                    />

                                    {job.posting_type && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700">
                                            <TbUsers className="w-3.5 h-3.5" />
                                            {job.posting_type}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <TbBriefcase className="w-4 h-4" />
                                    {job?.job_requisition?.department?.name}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <TbMapPin className="w-4 h-4" />
                                    {job?.job_requisition?.location?.name}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <TbClock className="w-4 h-4" />
                                    {job?.job_requisition?.employment_type}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <TbCurrencyDollar className="w-4 h-4" />
                                    {job?.job_requisition?.salary_range
                                        ? job.job_requisition.salary_range
                                        : "Salary not specified"}
                                </div>
                            </div>

                            <hr className="border-gray-200 dark:border-white/10" />

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <div>Posted: {job.posted}</div>
                                <div>Deadline: {job.application_deadline}</div>
                            </div>
                        </div>
                    </Card>
                </ViewJobPostingDetailsSection>
            ))}
        </div>
    );
}
