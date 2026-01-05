import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";
import {
    TbCalendarEvent,
    TbMapPin,
    TbTag,
    TbUser,
    TbEye,
    TbPencil,
    TbTrash,
} from "react-icons/tb";

const jobPostings = [
    {
        title: "Senior Software Engineer",
        department: "IT",
        location: "Manila",
        type: "Full-time",
        salary: "₱80,000 - ₱120,000",
        applicants: 45,
        status: "Active",
        posted: "12/1/2024",
        deadline: "12/31/2024",
    },
    {
        title: "HR Manager",
        department: "Human Resources",
        location: "Manila",
        type: "Full-time",
        salary: "₱60,000 - ₱90,000",
        applicants: 18,
        status: "Active",
        posted: "12/5/2024",
        deadline: "12/28/2024",
    },
    {
        title: "Marketing Specialist",
        department: "Marketing",
        location: "Manila",
        type: "Full-time",
        salary: "₱45,000 - ₱70,000",
        applicants: 27,
        status: "Active",
        posted: "12/7/2024",
        deadline: "12/30/2024",
    },
    {
        title: "Accountant",
        department: "Loan",
        location: "BGC",
        type: "Full-time",
        salary: "₱45,000 - ₱70,000",
        applicants: 27,
        status: "Closed",
        posted: "12/7/2024",
        deadline: "12/30/2024",
    },
];

export default function JobPostingCardSection() {
    return (
        <div className="flex flex-col gap-3">
            {jobPostings.map((job, i) => (
                <Card key={i} className="border rounded-xl">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">
                                    {job.title}
                                </h3>
                                <Badge
                                    showDot={false}
                                    className="rounded-md"
                                    variant="success"
                                    label={job.status}
                                />
                            </div>

                            <div className="flex items-center gap-3 text-gray-500">
                                <TbEye className="cursor-pointer text-blue-500 hover:text-blue-600" />
                                <TbPencil className="cursor-pointer text-green-500 hover:text-green-600" />
                                <TbTrash className="cursor-pointer text-red-500 hover:text-red-600" />
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <TbTag /> {job.department}
                            </div>
                            <div className="flex items-center gap-2">
                                <TbMapPin /> {job.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <TbUser /> {job.type}
                            </div>
                            <div>{job.salary}</div>
                            <div className="flex items-center gap-2 text-gray-600 font-medium">
                                <TbCalendarEvent /> {job.applicants} applicants
                            </div>
                        </div>

                        <hr />
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div>Posted: {job.posted}</div>
                            <div>Deadline: {job.deadline}</div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
