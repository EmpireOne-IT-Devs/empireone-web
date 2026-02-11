import React, { useEffect, useState } from "react";
import {
    TbCalendarEvent,
    TbMapPin,
    TbEye,
    TbCalendar,
    TbUsers,
    TbBuilding,
    TbCurrencyDollar,
} from "react-icons/tb";
import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import Button from "@/app/_components/button";
import { useDispatch, useSelector } from "react-redux";
import { setJobRequisitions } from "@/app/redux/job-requisition-slice";
import ViewJobRequisitionSection from "./view-job-requisition-section";
import { LuUser } from "react-icons/lu";
import moment from "moment";

export default function JobRequisitionCardSection() {
    const dispatch = useDispatch();
    const { job_requisitions, loading = false } = useSelector(
        (state) => state.job_requisitions,
    );
    console.log("job_requisitions", job_requisitions);
    const [open, setOpen] = useState(false);

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "warning";
            case "approved":
                return "success";
            case "rejected":
                return "destructive";
            case "draft":
                return "default";
            default:
                return "default";
        }
    };

    const getPriorityVariant = (priority) => {
        switch (priority?.toLowerCase()) {
            case "urgent":
            case "high":
                return "destructive";
            case "medium":
                return "primary";
            case "low":
                return "default";
            default:
                return "default";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleViewRequisition = (job) => {
        dispatch(setJobRequisitions(job));
        setOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Loading job requisitions...</div>
            </div>
        );
    }

    if (!job_requisitions || job_requisitions.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">No job requisitions found</div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {job_requisitions.map((job) => (
                    <Card key={job.id} className="border rounded-xl p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {job.title}
                                        </h3>

                                        <div className="flex items-center gap-2">
                                            <Badge
                                                showDot={false}
                                                className="rounded-md px-3 py-1 text-xs font-medium"
                                                variant={getStatusVariant(
                                                    job.status || "pending",
                                                )}
                                                label={job.status || "Pending"}
                                            />

                                            <Badge
                                                showDot={false}
                                                className="rounded-md px-3 py-1 text-xs font-medium"
                                                variant={getPriorityVariant(
                                                    job.priority,
                                                )}
                                                label={job.priority}
                                            />

                                            {job.type === "New Position" && (
                                                <Badge
                                                    outlined
                                                    showDot={false}
                                                    className="rounded-md px-3 py-1 text-xs font-medium"
                                                    variant="primary"
                                                    label="✨ New"
                                                />
                                            )}

                                            {job.type ===
                                                "Existing Position" && (
                                                <Badge
                                                    outlined
                                                    showDot={false}
                                                    className="rounded-md px-3 py-1 text-xs font-medium"
                                                    variant="purple"
                                                    label="📋 Existing"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500 font-medium">
                                        JRID:{" "}
                                        {moment(job.created_at).format(
                                            "mdyhis",
                                        )}
                                        {job.id}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            handleViewRequisition(job)
                                        }
                                    >
                                        <TbEye className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-black">
                                <div className="flex items-center gap-2">
                                    <TbBuilding className="text-gray-600" />
                                    <span>{job?.department?.name}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <TbMapPin className="text-gray-600" />
                                    <span className="capitalize">
                                        {job?.location?.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <TbUsers className="text-gray-600" />
                                    <span>
                                        {job.number_of_positions} position
                                        {job.number_of_positions > 1
                                            ? "s"
                                            : ""}{" "}
                                        needed
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mr-20">
                                    <TbCurrencyDollar className="text-gray-600" />
                                    <span>{job.salary_range}</span>
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <div className="flex flex-col gap-3">
                                <div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: job.justification_for_position,
                                        }}
                                    />
                                </div>
                                <div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: job.qualifications,
                                        }}
                                    />
                                </div>
                                <div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: job.responsibilities,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <LuUser />
                                        <span>Don Wakin</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <TbCalendar />
                                        <span className="capitalize">
                                            {formatDate(job.created_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm ml-auto">
                                        <TbCalendarEvent className="text-gray-600" />
                                        <span className="font-medium text-gray-600">
                                            1 event
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <ViewJobRequisitionSection open={open} setOpen={setOpen} />
        </>
    );
}
