import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";
import { useSelector } from "react-redux";
import {
    TbCalendarEvent,
    TbMapPin,
    TbTag,
    TbUser,
    TbEye,
    TbPencil,
    TbTrash,
} from "react-icons/tb";

export default function JobPostingCardSection() {
    const { job_postings, loading } = useSelector(
        (state) => state.job_postings,
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-gray-500">Loading job postings...</div>
            </div>
        );
    }

    if (!job_postings || job_postings.length === 0) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-gray-500">No job postings found.</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {job_postings.map((job, i) => (
                <Card key={job.id || i} className="border rounded-xl">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">
                                    {job.title}
                                </h3>
                                <Badge
                                    showDot={false}
                                    className="rounded-md"
                                    variant={
                                        job.status === "active"
                                            ? "success"
                                            : job.status === "draft"
                                              ? "warning"
                                              : job.status === "closed"
                                                ? "primary"
                                                : "default"
                                    }
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
                                <TbUser /> {job.employment_type || job.type}
                            </div>
                            <div>
                                {job.salary
                                    ? `₱${job.salary}`
                                    : "Salary not specified"}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 font-medium">
                                <TbCalendarEvent /> {job.applicants || 0}{" "}
                                applicants
                            </div>
                        </div>

                        <hr />
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div>
                                Posted:{" "}
                                {job.posted ||
                                    new Date(
                                        job.created_at,
                                    ).toLocaleDateString()}
                            </div>
                            <div>
                                Deadline:{" "}
                                {job.deadline || job.application_deadline}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
