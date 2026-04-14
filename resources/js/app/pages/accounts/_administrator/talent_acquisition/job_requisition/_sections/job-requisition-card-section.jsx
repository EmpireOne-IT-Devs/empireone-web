import React, { useState } from "react";
import Card from "@/app/_components/card";
import { useSelector } from "react-redux";
import ViewJobRequisitionSection from "./view-job-requisition-section";
import JobRequisitionBodySection from "./job-requisition-section";

export default function JobRequisitionCardSection() {
    const { job_requisitions, loading = false } = useSelector(
        (state) => state.job_requisitions,
    );

    const [open, setOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500 animate-pulse">
                    Loading job requisitions...
                </div>
            </div>
        );
    }

    if (!job_requisitions || job_requisitions.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500 bg-gray-50 px-6 py-4 rounded-lg">
                    No job requisitions found.
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                {job_requisitions.map((job) => (
                    <Card
                        key={job.id}
                        className="border shadow-sm rounded-xl p-4 sm:p-6 bg-white transition-shadow hover:shadow-md"
                    >
                        <JobRequisitionBodySection job_requisition={job} />
                    </Card>
                ))}
            </div>

            {/* If using a selectedJob state, pass it to the modal here */}
            {/* <ViewJobRequisitionSection open={open} setOpen={setOpen} /> */}
        </>
    );
}
