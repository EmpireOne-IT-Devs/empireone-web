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
import { router } from "@inertiajs/react";
import JobRequisitionBodySection from "./job-requisition-section";

export default function JobRequisitionCardSection() {
    const dispatch = useDispatch();
    const { job_requisitions, loading = false } = useSelector(
        (state) => state.job_requisitions,
    );
    console.log("job_requisitions", job_requisitions);
    const [open, setOpen] = useState(false);

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
                    <Card
                        // onClick={() =>
                        //     router.visit(
                        //         `/administrator/job_requisition/${job.id}`,
                        //     )
                        // }
                        key={job.id}
                        className="border rounded-xl p-6"
                    >
                        <JobRequisitionBodySection job_requisition={job} />
                      
                    </Card>
                ))}
            </div>

            <ViewJobRequisitionSection open={open} setOpen={setOpen} />
        </>
    );
}
