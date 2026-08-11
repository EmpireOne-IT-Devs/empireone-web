import React, { useEffect, useState, useMemo } from "react";
import Card from "@/app/_components/card";
import { useDispatch, useSelector } from "react-redux";
import { TbMapPin, TbTag, TbUser, TbUsers } from "react-icons/tb";
import Badge from "@/app/_components/badge";
import ViewJobPostingDetailsSection from "./view-job-posting-section";
import ShareJobSection from "./share-job-section";
import { FiBriefcase } from "react-icons/fi";

export default function JobPostingCardSection() {
    const { job_postings, loading } = useSelector(
        (state) => state.job_postings,
    );
    const user_role = window.location.pathname.split("/")[2];
    console.log("job_postings", job_postings);

    // Get filter parameters from URL
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get("search") || "";
    const statusFilter = params.get("status") || "all";

    // Filter job postings based on search term and status
    const filteredJobPostings = useMemo(() => {
        if (!job_postings) return [];

        return job_postings.filter((job) => {
            // Filter by status
            const statusMatch =
                statusFilter === "all" ||
                job.status?.toLowerCase() === statusFilter.toLowerCase();

            // Filter by search term
            const searchLower = searchTerm.toLowerCase();
            const searchMatch =
                !searchTerm ||
                job?.job_requisition?.title?.toLowerCase().includes(searchLower) ||
                job?.job_requisition?.department?.name?.toLowerCase().includes(searchLower) ||
                job?.job_requisition?.location?.name?.toLowerCase().includes(searchLower) ||
                job?.job_requisition?.employment_type?.toLowerCase().includes(searchLower);

            return statusMatch && searchMatch;
        });
    }, [job_postings, searchTerm, statusFilter]);

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

    if (filteredJobPostings.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">
                    No job postings match your search criteria
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {filteredJobPostings.map((job) => (
                    <Card className="border rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">
                                    {job?.job_requisition?.title}
                                </h3>
                                <Badge
                                    showDot={false}
                                    className="rounded-md"
                                    variant="warning"
                                    label={job.status}
                                />

                                {/* {user_role !== "applicant" && user_role !== "employee" && (
                                    <Badge
                                        showDot={false}
                                        variant="purple"
                                        label={`Recruiter: ${job?.job_requisition?.recruiter?.name}`}
                                    />
                                )} */}
                                {user_role !== "applicant" && user_role !== "employee" && (
                                    <Badge
                                        showDot={false}
                                        variant="primary"
                                        label={`Target: ${job?.job_requisition?.target_audience?.toLowerCase() === 'both'
                                            ? 'Internal and External'
                                            : job?.job_requisition?.target_audience
                                            }`}
                                    />
                                )}

                            </div>
                            <div>
                                <ShareJobSection data={job} />
                            </div>
                        </div>
                        <ViewJobPostingDetailsSection data={job} key={job.id}>
                            <div className="flex flex-col gap-3">
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
                                    {/* <div>
                                        {job?.job_requisition?.salary_range
                                            ? `${job?.job_requisition?.salary_range}`
                                            : "Salary not specified"}
                                    </div> */}
                                    {user_role !== "applicant" && user_role !== "employee" && (
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <TbUsers />
                                            {job?.applications?.length ?? 0}{" "}
                                            applicants
                                        </div>
                                    )}


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
                        </ViewJobPostingDetailsSection>
                    </Card>
                ))}
            </div>
        </>
    );
}
