import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import { approve_job_requisition_service } from "@/app/services/job-requisition-service";
import store from "@/app/store/store";
import React, { useState } from "react";
import { TbTrash } from "react-icons/tb";
import { useDispatch } from "react-redux";

export default function DeclinedJobRequisitionSection({ data }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    async function declined_job_requisition(params) {
        try {
            setLoading(true);
            await approve_job_requisition_service({
                ...data,
                status: "Declined",
            });
            await store.dispatch(get_job_requisitions_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Job Requisition has been Declined!",
                }),
            );
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }
    return (
        <div>
            <Button
                variant="danger"
                loading={loading}
                className="w-full"
                onClick={() => declined_job_requisition()}
            >
                <TbTrash className="w-5 h-5 mr-2" /> Declined
            </Button>
        </div>
    );
}
