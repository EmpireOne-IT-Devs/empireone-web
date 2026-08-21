import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import allowances from "@/app/lib/allowance";
import { setAlert } from "@/app/redux/app-slice";
import { get_applicants_thunk, get_job_posting_by_id_thunk } from "@/app/redux/job-posting-thunk";
import { send_job_offer_service } from "@/app/services/job-posting-service";
import store from "@/app/store/store";
import { AwsResAwsDatasyncDiscovery } from "@thesvg/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
export default function SendJobOfferSection({ data }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const { job_postings, job_posting } = useSelector((store) => store.job_postings);
    console.log('job_postingjob_posting', job_posting)
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
            job_posting_id: data?.job_posting?.id, // Default to current title
            salary: "",
            role: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "allowances",
    });

    const watchedValues = watch();

    async function open_modal(params) {
        try {
            setLoading(true)
            await store.dispatch(get_job_posting_by_id_thunk(watchedValues.job_posting_id))
            setLoading(false)
            setOpen(true)
        } catch (error) {

        }
    }

    const onSubmit = async (formData) => {
        try {
            await send_job_offer_service({
                ...data,
                ...formData,
                start_date: moment(formData.start_date).format('LL'),
                job_application_id: data.id,
            });
            await store.dispatch(get_applicants_thunk());
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
        <>
            <Button
                loading={loading}
                className="h-full" onClick={() => open_modal(true)}>
                SEND&nbsp;JOB&nbsp;OFFER
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Send Job Offer"
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
                                        .department?.name
                                }
                            </p>
                            <p>
                                <strong>Account:</strong>{" "}
                                {
                                    data?.job_posting?.job_requisition
                                        .account?.name
                                }
                            </p>
                            <p>
                                <strong>Location:</strong>{" "}
                                {
                                    data?.job_posting?.job_requisition.location
                                        ?.name
                                }
                            </p>
                            <p>
                                <strong>Current Title:</strong>{" "}
                                {data?.job_posting?.job_requisition?.title}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-5 gap-5 mt-6">
                            <Input
                                label="Position"
                                type="text"
                                disabled
                                value={job_posting?.job_requisition?.title}
                            />
                            <Controller
                                name="role"
                                control={control}
                                rules={{
                                    required: "Role is required",
                                }}
                                value={watchedValues.role}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Role"
                                        options={[
                                            { value: "Agent", label: "Agent" },
                                            { value: "Support", label: "Support" },
                                            { value: "Manager", label: "Manager" },
                                        ]}
                                        error={errors.role}
                                    />
                                )}
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
                        loading={isSubmitting}
                    >
                       SEND JOB OFFER
                    </Button>
                </form>
            </Modal>
        </>
    );
}
