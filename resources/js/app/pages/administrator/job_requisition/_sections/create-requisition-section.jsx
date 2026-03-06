import React, { useEffect, useState } from "react";
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
import { peso_format } from "@/app/lib/peso-format";

export default function CreateJobRequisition() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(0);
    const dispatch = useDispatch();
    const { data } = useSelector((store) => store.app);
    const { search_job_requisition } = useSelector(
        (state) => state.job_requisitions,
    );

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
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            department_id: "",
            location_id: "",
            type: "",
            existing_position_id: "",
            title: "",
            employment_type: "",
            number_of_positions: "",
            priority: "",
            salary_range: "",
            target_start_date: "",
            interviewer: "",
            sub_interviewer: "",
            interview_date: "",
            interview_time: "",
        },
    });

    const positionType = watch("type");
    const selectedPosition = search_job_requisition?.find(
        (res) => res.id === search,
    );
    console.log("selectedPosition", selectedPosition);

    useEffect(() => {
        if (positionType === "Existing Position") {
            setValue("title", selectedPosition?.title || "");
            setValue("department_id", selectedPosition?.department_id || "");
            setValue("location_id", selectedPosition?.location_id || "");
            setValue(
                "employment_type",
                selectedPosition?.employment_type || "",
            );
            setValue("priority", selectedPosition?.priority || "");
            setValue(
                "number_of_positions",
                selectedPosition?.number_of_positions || "",
            );
            setValue(
                "salary_range_from",
                selectedPosition?.salary_range.split("- ")[0],
            );
            setValue(
                "salary_range_to",
                selectedPosition?.salary_range.split("- ")[1],
            );

            setValue("existing_position_id", selectedPosition?.id);

            setForm({
                justification_for_position:
                    selectedPosition?.justification_for_position || "",
                qualifications: selectedPosition?.qualifications || "",
                responsibilities: selectedPosition?.responsibilities || "",
            });
        } else if (positionType === "New Position") {
            setValue("title", "");
            setValue("department_id", "");
            setValue("location_id", "");
            setValue("employment_type", "");
            setValue("priority", "");
            setValue("number_of_positions", "");
            setValue("salary_range_from", "");
            setValue("salary_range_to", "");
            setValue("existing_position_id", "");
            setForm({
                justification_for_position: "",
                qualifications: "",
                responsibilities: "",
            });
            setSearch({});
        }
    }, [positionType, selectedPosition]);

    async function onSubmit(form_data) {
        try {
            await create_job_requisition_service({
                ...form,
                ...form_data,
                salary_range: `₱${peso_format(form_data.salary_range_from)} ${form_data.salary_range_to ? ` - ₱${peso_format(form_data.salary_range_to)}` : ""}`,
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
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="New Job Requisition"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col max-h-[80vh]"
                >
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        Position Type
                        <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-300">
                            <label className="text-sm font-medium text-gray-700">
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
                                        <div className="space-y-4">
                                            <div>
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
                                                <p className="ml-6 text-sm text-gray-500">
                                                    Create a requsition for a
                                                    brand new position
                                                </p>
                                            </div>

                                            <div>
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
                                                <p className="ml-6 text-sm text-gray-500">
                                                    Request additional headcount
                                                    for an existing position
                                                </p>
                                            </div>

                                            {errors.type && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.type.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                {positionType === "Existing Position" && (
                                    <div className="mt-4">
                                        <Controller
                                            name="existing_position_id"
                                            control={control}
                                            rules={{
                                                required:
                                                    positionType ===
                                                    "Existing Position"
                                                        ? "Please select an existing position"
                                                        : false,
                                            }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Select Existing Position"
                                                    options={
                                                        search_job_requisition?.map(
                                                            (res) => ({
                                                                label: res.title,
                                                                value: res.id,
                                                            }),
                                                        ) || []
                                                    }
                                                    onChange={(e) =>
                                                        setSearch(e)
                                                    }
                                                    error={
                                                        errors
                                                            .existing_position_id
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                )}
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
                                                        value: "Low",
                                                        label: "Low",
                                                    },
                                                    {
                                                        value: "Medium",
                                                        label: "Medium",
                                                    },
                                                    {
                                                        value: "High",
                                                        label: "High",
                                                    },
                                                    {
                                                        value: "Urgent",
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
                                    <div className="flex gap-3">
                                        <Input
                                            {...register("salary_range_from", {
                                                required:
                                                    "Salary Range is required",
                                            })}
                                            error={
                                                errors.salary_range_from
                                                    ?.message
                                            }
                                            iconLeft="₱"
                                            label="Salary Range From"
                                            placeholder="e.g. 50,000"
                                        />
                                        <Input
                                            {...register("salary_range_to")}
                                            error={
                                                errors.salary_range_to?.message
                                            }
                                            iconLeft="₱"
                                            label="Salary Range To"
                                            placeholder="e.g. 70,000"
                                        />
                                    </div>
                                    <Input
                                        type="date"
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
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Interview Schedule
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        {...register("interviewer", {
                                            required:
                                                "Interview date is required",
                                        })}
                                        error={errors.interviewer?.message}
                                        label="Interview"
                                        placeholder="e.g. John Doe"
                                    />

                                    <Input
                                        {...register("sub_interviewer", {
                                            required:
                                                "Interview time is required",
                                        })}
                                        error={errors.sub_interviewer?.message}
                                        label="Sub Interviewer"
                                        placeholder="e.g. Jane Smith"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        {...register("interview_date", {
                                            required:
                                                "Interview date is required",
                                        })}
                                        error={errors.interview_date?.message}
                                        label="Interview Date"
                                    />

                                    <Input
                                        type="time"
                                        {...register("interview_time", {
                                            required:
                                                "Interview time is required",
                                        })}
                                        error={errors.interview_time?.message}
                                        label="Interview Time"
                                    />
                                </div>

                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Note:
                                        </span>{" "}
                                        The final interviewer will conduct the
                                        last round of interviews, while the
                                        sub-interviewer will assist in the
                                        initial screening process.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-3">
                            <Wysiwyg
                                label="Justification For Position"
                                value={form.justification_for_position}
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
                                value={form.qualifications}
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
                                value={form.responsibilities}
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
