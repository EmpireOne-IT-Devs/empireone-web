import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock } from "lucide-react";
import Wysiwyg from "@/app/_components/wysiwyg";
import Button from "@/app/_components/button";
import { useForm } from "react-hook-form";
import { create_job_requisition_logs_service } from "@/app/services/job-requisition-logs";
import {
    get_job_requisitions_by_id_thunk,
    get_job_requisitions_thunk,
} from "@/app/redux/job-requisition-thunk";
import store from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import moment from "moment";
import { TbTimeline } from "react-icons/tb";

const stepsData = [
    {
        id: 1,
        title: "Order Placed",
        description: "Your order has been successfully placed.",
        timestamp: "Feb 12, 10:00 AM",
    },
    {
        id: 2,
        title: "Processing",
        description: "We are preparing your items.",
        timestamp: "Feb 12, 10:30 AM",
    },
    {
        id: 3,
        title: "Shipped",
        description: "Your order is on the way.",
        timestamp: "Pending",
    },
    {
        id: 4,
        title: "Delivered",
        description: "Package delivered to your address.",
        timestamp: "Pending",
    },
];

export default function JobRequisitionLogsSection({ job_requisition }) {
    const [activeStep, setActiveStep] = useState(2);
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            // department_id: "",
        },
    });
    const nextStep = () => {
        if (activeStep < stepsData.length) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const resetSteps = () => setActiveStep(1);

    async function onSubmit() {
        try {
            setLoading(true);
            await create_job_requisition_logs_service({
                id: job_requisition.id,
                notes: notes,
            });
            await store.dispatch(get_job_requisitions_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Success",
                    message: "Notes Submitted",
                    open: true,
                }),
            );
            setNotes(null);
            setLoading(false);
        } catch (error) {
            setAlert({
                type: "danger",
                title: "Failed to job requisition log",
                message:
                    error?.response.data.message ||
                    error ||
                    "Something went wrong",
                open: true,
            });
            setLoading(false);
        }
    }
    return (
        <div className="w-full mt-12">
            <h2 className="text-2xl font-semibold text-center mb-6">
              <TbTimeline className="inline-block text-green-700" /> Timeline
            </h2>

            <div className="relative">
                {/* vertical line */}
                <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200" />

                <div className="space-y-6">
                    {job_requisition?.logs?.map((res, index) => {
                        return (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 cursor-pointer"
                            >
                                <div className="relative z-10 bg-white">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-lg">
                                            Marlou Pepito
                                        </h3>
                                        <span className="text-sm text-gray-500 mx-3">
                                            {moment(res.created_at).format(
                                                "LLL",
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-1">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: res.notes,
                                            }}
                                        />
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="my-3">
                <Wysiwyg
                    label="Position Notes"
                    onChange={(e) => setNotes(e)}
                    value={notes}
                    error={
                        "form.qualifications"
                            ? ""
                            : " Position Requirements is Required"
                    }
                />
                <div className="flex gap-3 mt-8 justify-center">
                    <Button loading={loading} type="submit" className="w-full">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
