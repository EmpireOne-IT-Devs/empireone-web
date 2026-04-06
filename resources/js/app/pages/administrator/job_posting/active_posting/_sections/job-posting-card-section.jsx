import React, { useEffect, useState } from "react";
import Card from "@/app/_components/card";
import { useDispatch, useSelector } from "react-redux";
import {
    TbMapPin,
    TbTag,
    TbUser,
    TbUsers,
} from "react-icons/tb";
import Badge from "@/app/_components/badge";
import ViewJobPostingDetailsSection from "./view-job-posting-details-section";

export default function JobPostingCardSection() {

    const { job_postings, loading } = useSelector(
        (state) => state.job_postings,
    );
    console.log("job_postings", job_postings);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Loading job requisitions...</div>
            </div>
        );
    }

    if (!job_postings || job_postings.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">No job requisitions found</div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {job_postings.map((job) => (
                    <ViewJobPostingDetailsSection data={job} key={job.id}>
                        <Card className="border rounded-xl p-6">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold">
                                            {job?.job_requisition?.title}
                                        </h3>
                                        <Badge
                                            showDot={false}
                                            className="rounded-md"
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
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <TbTag />{" "}
                                        {job?.job_requisition?.department?.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TbMapPin />{" "}
                                        {job?.job_requisition?.location?.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TbUser />{" "}
                                        {job?.job_requisition?.employment_type}
                                    </div>
                                    <div>
                                        {job?.job_requisition?.salary_range
                                            ? `${job?.job_requisition?.salary_range}`
                                            : "Salary not specified"}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <TbUsers />
                                        {job?.applications?.length ?? 0}{" "}
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
                                        Deadline: {job.application_deadline}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </ViewJobPostingDetailsSection>
                ))}
            </div>
        </>
    );
}
