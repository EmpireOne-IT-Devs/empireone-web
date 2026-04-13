import React, { useState } from "react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { setAlert } from "@/app/redux/app-slice";
import Radio from "@/app/_components/radio";
import { create_job_posting_service } from "@/app/services/job-posting-service";

export default function CreateJobSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            department: "",
            location: "",
            employment_type: "",
            salary: "",
            status: "",
            application_deadline: "",
            description: "",
            requirements: "",
            experience_required: "",
            education_required: "",
        },
    });

    async function onSubmit(data) {
        try {
            await create_job_posting_service(data);

            dispatch(
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
                    Create Job Post
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
                    className="flex flex-col max-h-[75vh]"
                >
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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

                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: "Job title is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Job Title"
                                        placeholder="e.g. Senior Software Engineer"
                                        error={errors.title?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="department"
                                control={control}
                                rules={{ required: "Department is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Department"
                                        placeholder="e.g. IT"
                                        error={errors.department?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="location"
                                control={control}
                                rules={{ required: "Location is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Location"
                                        placeholder="e.g. Manila"
                                        error={errors.location?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Controller
                                name="employment_type"
                                control={control}
                                rules={{
                                    required: "Employment type is required",
                                }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Employment Type"
                                        options={[
                                            {
                                                value: "full-time",
                                                label: "Full Time",
                                            },
                                            {
                                                value: "part-time",
                                                label: "Part Time",
                                            },
                                            {
                                                value: "contract",
                                                label: "Contract",
                                            },
                                            {
                                                value: "temporary",
                                                label: "Temporary",
                                            },
                                            {
                                                value: "internship",
                                                label: "Internship",
                                            },
                                        ]}
                                        error={errors.employment_type?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="salary"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Salary Range"
                                        placeholder="₱50,000 - ₱100,000"
                                    />
                                )}
                            />

                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: "Status is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Status"
                                        options={[
                                            { value: "draft", label: "Draft" },
                                            {
                                                value: "active",
                                                label: "Active",
                                            },
                                            {
                                                value: "closed",
                                                label: "Closed",
                                            },
                                        ]}
                                        error={errors.status?.message}
                                    />
                                )}
                            />
                        </div>

                        <Controller
                            name="application_deadline"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Application Deadline"
                                    type="date"
                                />
                            )}
                        />

                        <h3 className="text-sm font-semibold text-gray-700">
                            Job Details
                        </h3>

                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: "Job description is required",
                            }}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="Describe the role and responsibilities..."
                                    className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description.message}
                            </p>
                        )}

                        <Controller
                            name="requirements"
                            control={control}
                            rules={{
                                required: "Requirements are required",
                            }}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="List requirements (one per line)"
                                    className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        />
                        {errors.requirements && (
                            <p className="text-red-500 text-sm">
                                {errors.requirements.message}
                            </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                            <Controller
                                name="experience_required"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Experience Required"
                                        placeholder="e.g. 3+ years"
                                    />
                                )}
                            />

                            <Controller
                                name="education_required"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Education Required"
                                        placeholder="e.g. Bachelor's Degree"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-white border-t pt-4 px-2 flex justify-end gap-2">
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
