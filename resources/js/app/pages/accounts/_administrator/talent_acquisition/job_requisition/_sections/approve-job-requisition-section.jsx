import Button from "@/app/_components/button";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import { approve_job_requisition_service } from "@/app/services/job-requisition-service";
import store from "@/app/store/store";
import React, { useState } from "react";
import { TbCheck } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

export default function ApproveJobRequisitionSection({ data }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [recruiter, setRecruiter] = useState(null);
    const { users } = useSelector((state) => state.job_requisitions);

    async function approved_job_requisition() {
        // --- ADDED: Validation to ensure recruiter is selected if In Progress ---
        if (data.status === "In Progress" && !recruiter) {
            dispatch(
                setAlert({
                    type: "error",
                    title: "Recruiter selection is required!",
                }),
            );
            return;
        }

        try {
            setLoading(true);
            await approve_job_requisition_service({
                ...data,
                recruiter_id: recruiter,
                status: "Declined" == data.status ? "Pending" : data.status,
            });
            await store.dispatch(get_job_requisitions_thunk());
            dispatch(
                // Replaced `await dispatch` with `dispatch` as setAlert is synchronous
                setAlert({
                    type: "success",
                    title: "Job Requisition Approved Successfully!",
                }),
            );
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    const allOptions =
        users?.users?.map((res) => ({
            ...res,
            label: res.name,
            value: res.id,
        })) || [];

    return (
        <div className="flex gap-3 flex-col w-full">
            {data.status == "In Progress" && (
                <>
                    <Select
                        className="w-full"
                        label="Recruiter *" // Added visual indicator
                        name="recruiter_id"
                        value={recruiter}
                        options={allOptions}
                        onChange={(val) => setRecruiter(val)}
                        required // Added required prop just in case your Select handles it
                    />
                </>
            )}
            <Button
                variant="primary"
                loading={loading}
                disabled={data.status === "In Progress" && !recruiter} // --- ADDED: Disables button if missing ---
                onClick={() => approved_job_requisition()}
            >
                Approved
            </Button>
        </div>
    );
}
