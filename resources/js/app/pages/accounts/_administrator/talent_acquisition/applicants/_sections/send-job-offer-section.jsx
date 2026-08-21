import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
// Removed Select import
import allowances from "@/app/lib/allowance";
import { setAlert } from "@/app/redux/app-slice";
import { get_applicants_thunk, get_job_posting_by_id_thunk } from "@/app/redux/job-posting-thunk";
import { send_job_offer_service } from "@/app/services/job-posting-service";

export default function SendJobOfferSection({ data }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { job_posting } = useSelector((store) => store.job_postings);
    const applicantInfo = data?.applicant?.personal_information;
    const reqInfo = data?.job_posting?.job_requisition;

    const {
        register,
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            job_posting_id: data?.job_posting?.id,
            salary: "",
            role: "",
            allowances: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "allowances",
    });

    async function handleOpenModal() {
        try {
            setLoading(true);
            const jobId = getValues("job_posting_id") || data?.job_posting?.id;
            await dispatch(get_job_posting_by_id_thunk(jobId));
            setOpen(true);
        } catch (error) {
            console.error("Failed to fetch job posting details:", error);
            dispatch(setAlert({
                type: "error",
                title: "Error",
                message: "Could not load job posting details.",
                open: true,
            }));
        } finally {
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = async (formData) => {
        try {
            await send_job_offer_service({
                ...data,
                ...formData,
                start_date: moment(formData.start_date).format('LL'),
                job_application_id: data.id,
            });

            await dispatch(get_applicants_thunk());

            dispatch(
                setAlert({
                    type: "success",
                    title: "Job Offer Sent Successfully!",
                    message: "Please review your email.",
                    open: true,
                })
            );
            handleCloseModal();
        } catch (error) {
            console.error("Submission error:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Submission Failed",
                    message: "An error occurred while sending the job offer.",
                    open: true,
                })
            );
        }
    };

    return (
        <>
            <Button
                loading={loading}
                className="h-full"
                onClick={handleOpenModal}
            >
                SEND&nbsp;JOB&nbsp;OFFER
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={handleCloseModal}
                title="Send Job Offer"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-gray-50 p-6 rounded-xl space-y-6 text-sm text-gray-700 border border-gray-100"
                >
                    <div>
                        <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                            Position Details
                        </p>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p>
                                <strong>Full Name:</strong>{" "}
                                {applicantInfo?.first_name} {applicantInfo?.last_name}
                            </p>
                            <p>
                                <strong>Department:</strong> {reqInfo?.department?.name}
                            </p>
                            <p>
                                <strong>Account:</strong> {reqInfo?.account?.name}
                            </p>
                            <p>
                                <strong>Location:</strong> {reqInfo?.location?.name}
                            </p>
                            <p>
                                <strong>Current Title:</strong> {reqInfo?.title}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-5 gap-5 mt-6">
                            <Input
                                label="Position"
                                type="text"
                                disabled
                                value={job_posting?.job_requisition?.title || ""}
                            />

                            {/* Native Select for Role */}
                            <div className="flex flex-col space-y-1">
                                <select
                                    {...register("role", { required: "Role is required" })}
                                    className={`w-full border rounded-lg p-2.5 text-sm bg-white focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.role ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select a role</option>
                                    <option value="Agent">Agent</option>
                                    <option value="Support">Support</option>
                                    <option value="Manager">Manager</option>
                                </select>
                                {errors.role && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors.role.message}
                                    </span>
                                )}
                            </div>

                            <Input
                                label="Monthly Salary"
                                type="number"
                                placeholder="e.g. 50000"
                                {...register("salary", { required: "Salary is required" })}
                                error={errors.salary}
                            />
                            <Input
                                label="Start Date"
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                {...register("start_date", { required: "Start date is required" })}
                                error={errors.start_date}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full">
                        <div className="space-y-4 w-full">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-blue-600 text-xs uppercase">
                                    Allowances
                                </p>
                                <Button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            allowance_type: "Monthly",
                                            allowance: "",
                                        })
                                    }
                                >
                                    + ADD ALLOWANCE
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex gap-4 items-start justify-center"
                                >
                                    {/* Native Select for Allowance Type */}
                                    <div className="flex-1 flex flex-col space-y-1">
                                        <select
                                            {...register(`allowances.${index}.allowance_type`, {
                                                required: "Type required",
                                            })}
                                            className={`w-full border rounded-lg p-2.5 text-sm bg-white focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.allowances?.[index]?.allowance_type ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select type</option>
                                            {allowances.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.allowances?.[index]?.allowance_type && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.allowances[index].allowance_type.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <Input
                                            label="Amount"
                                            type="number"
                                            placeholder="0.00"
                                            {...register(`allowances.${index}.allowance`, {
                                                required: "Amount required",
                                            })}
                                            error={errors.allowances?.[index]?.allowance}
                                        />
                                    </div>
                                    <div className="flex-none pt-6">
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => remove(index)}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full flex justify-center items-center"
                        loading={isSubmitting}
                    >
                        SEND JOB OFFER
                    </Button>
                </form>
            </Modal>
        </>
    );
}