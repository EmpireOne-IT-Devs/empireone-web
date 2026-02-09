import React, { useState } from "react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { create_job_requisition_thunk } from "@/app/redux/job-requisition-thunk";
import { setAlert } from "@/app/redux/app-slice";

export default function NewJobRequisition() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            position_type: "new",
            position_title: "",
            department: "",
            location: "",
            employment_type: "",
            number_of_positions: "1",
            priority: "",
            salary_range: "",
            target_start_date: "",
            justification_for_position: "",
            required_qualifications: "",
            key_responsibilities: "",
        },
    });

    async function onSubmit(data) {
        try {
            await dispatch(create_job_requisition_thunk(data)).unwrap();

            dispatch(
                setAlert({
                    type: "success",
                    title: "Job Requisition Created Successfully!",
                    message:
                        "The job requisition has been created and is ready for review.",
                    open: true,
                }),
            );

            reset();
            setOpen(false);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to create job requisition",
                    message: error?.message || error || "Something went wrong",
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
                    New Job Requisition
                </div>
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="New Job Requisition"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col max-h-[80vh]"
                >
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        <div className="bg-blue-100 rounded-lg p-4 space-y-3 border border-blue-300">
                            <label className="text-sm font-medium text-gray-700">
                                Position Type{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <Controller
                                name="position_type"
                                control={control}
                                rules={{
                                    required: "Position type is required",
                                }}
                                render={({ field }) => (
                                    <div className="space-y-3">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="new"
                                                checked={field.value === "new"}
                                                className="mt-1"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    New Position
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Create a requisition for a
                                                    brand new position
                                                </div>
                                            </div>
                                        </label>

                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="existing"
                                                checked={
                                                    field.value === "existing"
                                                }
                                                className="mt-1"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    Existing Position
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Request additional headcount
                                                    for an existing role
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Position Details
                            </h3>

                            <div className="space-y-4">
                                <Controller
                                    name="position_title"
                                    control={control}
                                    rules={{
                                        required: "Position title is required",
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Position Title"
                                            placeholder="e.g. Senior Software Engineer"
                                            error={
                                                errors.position_title?.message
                                            }
                                        />
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="department"
                                        control={control}
                                        rules={{
                                            required: "Department is required",
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Department"
                                                placeholder="e.g. Human Resources"
                                                error={
                                                    errors.department?.message
                                                }
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="location"
                                        control={control}
                                        rules={{
                                            required: "Location is required",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Location"
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "Select Location",
                                                    },
                                                    {
                                                        value: "manila",
                                                        label: "Manila",
                                                    },
                                                    {
                                                        value: "cebu",
                                                        label: "Cebu",
                                                    },
                                                    {
                                                        value: "davao",
                                                        label: "Davao",
                                                    },
                                                    {
                                                        value: "remote",
                                                        label: "Remote",
                                                    },
                                                ]}
                                                error={errors.location?.message}
                                                required
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <Controller
                                        name="employment_type"
                                        control={control}
                                        rules={{
                                            required:
                                                "Employment type is required",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Employment Type"
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "Select Employment Type",
                                                    },
                                                    {
                                                        value: "full-time",
                                                        label: "Full-time",
                                                    },
                                                    {
                                                        value: "part-time",
                                                        label: "Part-time",
                                                    },
                                                    {
                                                        value: "contract",
                                                        label: "Contract",
                                                    },
                                                    {
                                                        value: "temporary",
                                                        label: "Temporary",
                                                    },
                                                ]}
                                                error={
                                                    errors.employment_type
                                                        ?.message
                                                }
                                                required
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="number_of_positions"
                                        control={control}
                                        rules={{
                                            required:
                                                "Number of positions is required",
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Number of Positions"
                                                type="number"
                                                placeholder="1"
                                                min={1}
                                                error={
                                                    errors.number_of_positions
                                                        ?.message
                                                }
                                                required
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="priority"
                                        control={control}
                                        rules={{
                                            required: "Priority is required",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Priority"
                                                options={[
                                                    {
                                                        value: "low",
                                                        label: "Low",
                                                    },
                                                    {
                                                        value: "medium",
                                                        label: "Medium",
                                                    },
                                                    {
                                                        value: "high",
                                                        label: "High",
                                                    },
                                                    {
                                                        value: "urgent",
                                                        label: "Urgent",
                                                    },
                                                ]}
                                                error={errors.priority?.message}
                                                required
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="salary_range"
                                        control={control}
                                        rules={{
                                            required:
                                                "Salary Range is required",
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Salary Range"
                                                placeholder="e.g. ₱50,000 - ₱70,000"
                                                error={
                                                    errors.salary_range?.message
                                                }
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="target_start_date"
                                        control={control}
                                        rules={{
                                            required:
                                                "Target Start Date is required",
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Target Start Date"
                                                type="date"
                                                error={
                                                    errors.target_start_date
                                                        ?.message
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Business Justification
                            </h3>

                            <Controller
                                name="justification_for_position"
                                control={control}
                                rules={{
                                    required: "Justification is required",
                                }}
                                render={({ field }) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Justification for Position{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            {...field}
                                            placeholder="Explain why this position is needed..."
                                            className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.justification_for_position && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    errors
                                                        .justification_for_position
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Position Requirements
                            </h3>

                            <div className="space-y-4">
                                <Controller
                                    name="required_qualifications"
                                    control={control}
                                    rules={{
                                        required:
                                            "Required qualifications are required",
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Required Qualifications{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                {...field}
                                                placeholder="List required education, experience, skills, certifications..."
                                                className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.required_qualifications && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {
                                                        errors
                                                            .required_qualifications
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="key_responsibilities"
                                    control={control}
                                    rules={{
                                        required:
                                            "Key responsibilities are required",
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Key Responsibilities{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                {...field}
                                                placeholder="Describe main duties and responsibilities..."
                                                className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.key_responsibilities && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {
                                                        errors
                                                            .key_responsibilities
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-white border-t pt-4 mt-6 flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            outlined
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Requisition"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
