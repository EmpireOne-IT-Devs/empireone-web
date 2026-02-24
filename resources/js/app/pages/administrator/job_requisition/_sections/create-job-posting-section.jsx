import React, { useState } from "react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { setAlert } from "@/app/redux/app-slice";
import Select from "@/app/_components/select";
import { create_job_posting_service } from "@/app/services/job-posting-service";
import store from "@/app/store/store";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import Radio from "@/app/_components/radio";

export default function CreateJobPostingSection({ initial_data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { data } = useSelector((store) => store.app);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            target_audience: "Both",
            status: "Active",
            application_deadline: null,
            experience_required: null,
            education_required: null,
        },
    });
    console.log("initial_data", initial_data);
    async function onSubmit(data) {
        try {
            await create_job_posting_service({
                ...data,
                job_requisition_id: initial_data.id,
            });
            await store.dispatch(get_job_requisitions_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Job Posting Created Successfully!",
                    message:
                        "The job posting has been created and is ready for review.",
                    open: true,
                }),
            );
            reset();
            setOpen(false);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to create job posting",
                    message: error.message || "Something went wrong",
                    open: true,
                }),
            );
        }
    }

    return (
        <div>
            <Button type="button" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    Create Job Posting
                </div>
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Create New Job Posting"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col max-h-[80vh]"
                >
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 px-3">

                        <div className="border p-4 bg-green-50 rounded-md mt-6">
                            <div className=" mb-4 font-semibold text-gray-800">
                                Target Audience
                            </div>
                            <div className="flex flex-col gap-2">
                                {["Both", "Internal", "External"].map(
                                    (option) => (
                                        <Radio
                                            key={option}
                                            value={option}
                                            label={option}
                                            {...register("target_audience", {
                                                required: true,
                                            })}
                                        />
                                    ),
                                )}
                            </div>
                            {errors.target_audience && (
                                <p className="text-red-500">
                                    {errors.target_audience.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Basic Information
                            </h3>

                            <Input
                                value={initial_data.title}
                                label="Job Title"
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                value={initial_data.department_id}
                                label="Select Department"
                                options={data?.departments?.map((res) => ({
                                    ...res,
                                    label: res.name,
                                    value: res.id,
                                }))}
                                disabled
                            />
                            <Select
                                value={initial_data.location_id}
                                label="Select Location"
                                options={data?.locations.map((res) => ({
                                    label: res.name,
                                    value: res.id,
                                }))}
                                disabled
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                value={initial_data.employment_type}
                                label="Employment Type"
                                options={[
                                    {
                                        value: "Full-time",
                                        label: "Full-time",
                                    },
                                    {
                                        value: "Part-time",
                                        label: "Part-time",
                                    },
                                    {
                                        value: "Contract",
                                        label: "Contract",
                                    },
                                    {
                                        value: "Temporary",
                                        label: "Temporary",
                                    },
                                ]}
                                disabled
                            />
                            <Input
                                value={initial_data?.salary_range}
                                label="Salary Range"
                                placeholder="₱50,000 - ₱100,000"
                            />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-700">
                            Job Details
                        </h3>
                        {initial_data.qualifications && (
                            <div className="w-full border border-gray-300 p-2 rounded-md">
                                <h3 className="font-semibold text-lg mb-2">
                                    Qualifications
                                </h3>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: initial_data.qualifications,
                                    }}
                                />
                            </div>
                        )}

                        {initial_data.responsibilities && (
                            <div className="w-full border border-gray-300 p-2 rounded-md">
                                <h3 className="font-semibold text-lg mb-2">
                                    Responsibilities
                                </h3>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: initial_data.responsibilities,
                                    }}
                                />
                            </div>
                        )}

                        {errors.requirements && (
                            <p className="text-red-500 text-sm">
                                {errors.requirements.message}
                            </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: true }}
                                value="Active"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Status"
                                        options={[
                                            {
                                                value: "Active",
                                                label: "Active",
                                            },
                                            {
                                                value: "Closed",
                                                label: "Closed",
                                            },
                                            { value: "Draft", label: "Draft" },
                                        ]}
                                        error={errors.status?.message}
                                    />
                                )}
                            />
                            <Input
                                name="application_deadline"
                                label="Application Deadline"
                                type="date"
                                {...register("application_deadline", {
                                    required: true,
                                })}
                                error={errors.application_deadline}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  pb-20">
                            <Input
                                name="experience_required"
                                label="Years of Experience"
                                type="text"
                                {...register("experience_required", {
                                    required: true,
                                })}
                                error={errors.experience_required}
                            />

                            <Input
                                name="education_required"
                                label="Bachelor's Degree"
                                type="text"
                                {...register("education_required", {
                                    required: true,
                                })}
                                error={errors.education_required}
                            />
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-white border-t pt-4 px-2 flex justify-end m-3 gap-2 my-3 ">
                        <Button
                            variant="secondary"
                            type="button"
                            outlined
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Job Post"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
