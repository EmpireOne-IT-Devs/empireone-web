import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import allowances from "@/app/lib/allowance";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_applicants_thunk,
    get_job_application_by_id_thunk,
} from "@/app/redux/job-posting-thunk";
import { send_job_offer_service } from "@/app/services/job-posting-service";
import store from "@/app/store/store";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
export default function ResendJobOfferSection({ data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { job_postings } = useSelector((store) => store.job_postings);
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }, // Destructured isSubmitting
    } = useForm({
        defaultValues: {
            job_posting_id: "",
            salary: "",
            role: "",
            start_date: "",
            allowances: []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "allowances",
    });

    const watchedValues = watch();
    useEffect(() => {
        setValue("job_posting_id", data?.job_posting?.id);
        setValue("role", data?.job_offer?.role);
        setValue("salary", data?.job_offer?.salary);
        setValue("start_date", moment(data?.job_offer?.start_date).format('YYYY-MM-DD'));
        setValue("allowances", data?.job_offer?.allowances);
    }, []);
    
    const onSubmit = async (formData) => {
        try {
            await send_job_offer_service({
                ...data,
                ...formData,
                start_date: moment(formData.start_date).format('LL'),
                job_application_id: data.id,
                status: "Re-Offered",
            });
            await store.dispatch(get_job_application_by_id_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Send Job Offer Successfully!",
                    message: "Please review your email.",
                    open: true,
                }),
            );
            setOpen(false);
            reset();
        } catch (error) { }
    };

    return (
        <div>
            <Button className="h-full text-sm" onClick={() => setOpen(true)}>
                RESEND&nbsp;JOB&nbsp;OFFER
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Resend Job Offer"
            >
                {/* Wrap content in a form tag to utilize handleSubmit */}
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
                                {
                                    data?.applicant?.personal_information
                                        ?.first_name
                                }{" "}
                                {
                                    data?.applicant?.personal_information
                                        ?.last_name
                                }
                            </p>
                            <p>
                                <strong>Department:</strong>{" "}
                                {
                                    data?.job_posting?.job_requisition
                                        .department.name
                                }
                            </p>
                            <p>
                                <strong>Location:</strong>{" "}
                                {
                                    data?.job_posting?.job_requisition.location
                                        .name
                                }
                            </p>
                            <p>
                                <strong>Current Title:</strong>{" "}
                                {data?.job_posting?.job_requisition?.title}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-5 gap-5 mt-6">
                            <Select
                                label="Select Existing Position"
                                options={
                                    job_postings?.map((res) => ({
                                        label: res?.job_requisition?.title,
                                        value: res?.id,
                                    })) || []
                                }
                                value={watchedValues.job_posting_id}
                                error={errors.job_posting_id?.message}
                                onChange={(e) => setValue('job_posting_id', e)}
                            />
                            <Select
                                label="Role"
                                name="role"
                                {...register("role", {
                                    required: true,
                                })}
                                options={[
                                    { value: "Agent", label: "Agent" },
                                    { value: "Support", label: "Support" },
                                    { value: "Manager", label: "Manager" },
                                ]}
                                error={errors.role}
                                value={watchedValues.role}
                            />
                            <Input
                                label="Monthly Salary"
                                type="number"
                                {...register("salary", {
                                    required: true,
                                })}
                                error={errors.salary}
                                placeholder="e.g. 50000"
                            />
                            <Input
                                label="Start Date"
                                type="date"
                                {...register("start_date", {
                                    required: true,
                                })}
                                min={new Date().toISOString().split("T")[0]}
                                error={errors.start_date}
                                placeholder="e.g. March *"
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
                                    size="sm"
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
                                    className="flex gap-4 items-center justify-center "
                                >
                                    <div className="flex-1">
                                        <Select
                                            label="Allowance Type"
                                            {...register(
                                                `allowances.${index}.allowance_type`,
                                                {
                                                    required: true,
                                                },
                                            )}
                                            name={`allowances.${index}.allowance_type`}
                                            error={
                                                errors.allowances?.[index]
                                                    ?.allowance_type
                                            }
                                            value={
                                                watchedValues.allowances?.[
                                                    index
                                                ]?.allowance_type
                                            }
                                            options={allowances}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            label="Amount"
                                            type="number"
                                            {...register(
                                                `allowances.${index}.allowance`,
                                                {
                                                    required: true,
                                                },
                                            )}
                                            value={
                                                watchedValues.allowances?.[
                                                    index
                                                ]?.allowance
                                            }
                                            name={`allowances.${index}.allowance`}
                                            placeholder="0.00"
                                            error={
                                                errors.allowances?.[index]
                                                    ?.allowance
                                            }
                                        />
                                    </div>
                                    <div className="flex-none">
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => remove(index)}
                                        // disabled={fields.length === 1}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Loading Button */}
                    <Button
                        type="submit"
                        className="w-full flex justify-center items-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                PROCESSING...
                            </>
                        ) : (
                            "RESEND JOB OFFER"
                        )}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
