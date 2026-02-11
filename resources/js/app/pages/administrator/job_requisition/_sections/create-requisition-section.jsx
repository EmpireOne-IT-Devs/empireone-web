import React, { useState } from "react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { setAlert } from "@/app/redux/app-slice";
import { create_job_requisition_service } from "@/app/services/job-requisition-service";
import Wysiwyg from "@/app/_components/wysiwyg";
import store from "@/app/store/store";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import Radio from "@/app/_components/radio";

export default function CreateJobRequisition() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { data } = useSelector((store) => store.app);
    const [form, setForm] = useState({
        justification_for_position: "",
        qualifications: "",
        responsibilities: "",
    });
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            department_id: "",
            location_id: "",
            type: "",
            title: "",
            employment_type: "",
            number_of_positions: "",
            priority: "",
            salary_range: "",
            target_start_date: "",
        },
    });

    async function onSubmit(form_data) {
        try {
            await create_job_requisition_service({
                ...form,
                ...form_data,
            });
            await store.dispatch(get_job_requisitions_thunk());
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
                    message:
                        error?.response.data.message ||
                        error ||
                        "Something went wrong",
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
                        <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-300">
                            <label className="text-sm font-medium text-gray-700">
                                Position Type{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{
                                        required: "Position type is required",
                                    }}
                                    render={({ field }) => (
                                        <div className="space-y-3">
                                            <Radio
                                                label="New Position"
                                                value="New Position"
                                                checked={
                                                    field.value ===
                                                    "New Position"
                                                }
                                                onChange={() =>
                                                    field.onChange(
                                                        "New Position",
                                                    )
                                                }
                                            />
                                            <Radio
                                                label="Existing Position"
                                                value="Existing Position"
                                                checked={
                                                    field.value ===
                                                    "Existing Position"
                                                }
                                                onChange={() =>
                                                    field.onChange(
                                                        "Existing Position",
                                                    )
                                                }
                                            />
                                            {errors.type && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.type.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="px-3">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Position Details
                            </h3>

                            <div className="space-y-4">
                                <Input
                                    rules={{
                                        required: "Position title is required",
                                    }}
                                    {...register("title", {
                                        required: "Title is required",
                                    })}
                                    error={errors.title?.message}
                                    label="Position Title"
                                    placeholder="e.g. Senior Software Engineer"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="department_id"
                                        control={control}
                                        rules={{
                                            required: "Department is required",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                label="Select Department"
                                                options={data?.departments?.map(
                                                    (res) => ({
                                                        ...res,
                                                        label: res.name,
                                                        value: res.id,
                                                    }),
                                                )}
                                                // onSelect={(e) =>
                                                //     setCategories(e)
                                                // }
                                                error={errors.department_id}
                                                {...field} // passes value & onChange
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="location_id"
                                        control={control}
                                        rules={{
                                            required: "Location is required",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                label="Select Location"
                                                options={data?.locations.map(
                                                    (res) => ({
                                                        label: res.name,
                                                        value: res.id,
                                                    }),
                                                )}
                                                error={errors.location_id}
                                                {...field} // passes value & onChange
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
                                                error={
                                                    errors.employment_type
                                                        ?.message
                                                }
                                                required
                                            />
                                        )}
                                    />

                                    <Input
                                        {...register("number_of_positions", {
                                            required:
                                                "Number of Positions is required",
                                        })}
                                        error={
                                            errors.number_of_positions?.message
                                        }
                                        type="number"
                                        label="Number of Positions"
                                        placeholder="Number of Positions"
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
                                    <Input
                                        {...register("salary_range", {
                                            required:
                                                "Salary Range is required",
                                        })}
                                        error={errors.salary_range?.message}
                                        label="Salary Range"
                                        placeholder="e.g. ₱50,000 - ₱70,000"
                                    />
                                    <Input
                                        {...register("target_start_date", {
                                            required:
                                                "Target Start Date is required",
                                        })}
                                        error={
                                            errors.target_start_date?.message
                                        }
                                        label="Target Start Date"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-3">
                            <Wysiwyg
                                label="Justification For Position"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        justification_for_position: e,
                                    })
                                }
                                error={
                                    form.justification_for_position
                                        ? ""
                                        : "Justification For Postion is Required"
                                }
                            />
                            <Wysiwyg
                                label="Position Requirements"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        qualifications: e,
                                    })
                                }
                                error={
                                    form.qualifications
                                        ? ""
                                        : " Position Requirements is Required"
                                }
                            />
                            <Wysiwyg
                                label="Responsibility"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        responsibilities: e,
                                    })
                                }
                                error={
                                    form.responsibilities
                                        ? ""
                                        : " Responsibility is Required"
                                }
                            />
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
