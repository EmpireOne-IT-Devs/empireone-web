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
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import Radio from "@/app/_components/radio";
import { peso_format } from "@/app/lib/peso-format";
import { BriefcaseIcon } from "lucide-react";
import store from "@/app/store/store";
import { router } from "@inertiajs/react";

export default function CreateJobRequisition({ autoOpen = false, hideButton = false }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (autoOpen) setOpen(true);
    }, [autoOpen]);
    const dispatch = useDispatch();
    const { data } = useSelector((store) => store.app);
    const { users } = useSelector((state) => state.job_requisitions);

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
            category: "",
            wave: "",
            location_id: "",
            site_id: "",
            type: "",
            existing_position_id: "",
            title: "",
            employment_type: "",
            number_of_positions: "",
            priority: "",
            salary_range_from: "",
            salary_range_to: "",
            target_start_date: "",
            erf_classification: "",
            target_audience: "",
            interviewer1: "",
            availability1: "",
            interview_time1: "",
            interviewer2: "",
            availability2: "",
            interview_time2: "",
            account_id: "",
            qualifications: "",
            responsibilities: "",
            approver1_id: "",
            position_level: 'Rank and File',
            approver2_id: "",
            approver3_id: "",
        },
    });

    console.log("approver2", watch("approver2_id"));

    const watchedValues = watch();
    const positionType = watch("type");
    const existingPositionId = watch("existing_position_id");

    const selectedPosition = data?.position?.find(
        (res) => String(res.id) == String(existingPositionId),
    );
    console.log('selectedPosition', selectedPosition)
    useEffect(() => {
        if (String(watchedValues.department_id) !== "4") {
            setValue("account_id", "");
        }
    }, [watchedValues.department_id, setValue]);

    useEffect(() => {
        if (positionType === "Existing Position") {
            const req = selectedPosition?.job_requisition;
            const salaryRange = req?.salary_range || "";
            const [salaryFrom = "", salaryTo = ""] = salaryRange.split("-");
            console.log("reqreq", req);

            setValue("title", req?.title || "");
            setValue("approver1_id", req?.approver1_id || "");
            setValue("approver2_id", req?.approver2_id || "");
            setValue("approver3_id", req?.approver3_id || "");

            setValue("department_id", req?.department_id || "");
            setValue("location_id", req?.location_id || "");
            setValue("site_id", req?.site_id || "");
            setValue("category", req?.category || "");
            setValue("wave", req?.wave || "");
            setValue("employment_type", req?.employment_type || "");
            setValue("erf_classification", req?.erf_classification || "");
            setValue("target_audience", req?.target_audience || "");

            setValue("interviewer1", req?.interviewer1 || "");
            setValue("availability1", req?.availability1 || "");
            setValue("interview_time1", req?.interview_time1 || "");
            setValue("interviewer2", req?.interviewer2 || "");
            setValue("availability2", req?.availability2 || "");
            setValue("interview_time2", req?.interview_time2 || "");

            setValue("priority", req?.priority || "");
            setValue("account_id", req?.account_id || "");
            setValue("number_of_positions", req?.number_of_positions || "");
            setValue("salary_range_from", salaryFrom.replace("₱", "").trim());
            setValue("salary_range_to", salaryTo.replace("₱", "").trim());
            setValue("existing_position_id", selectedPosition?.id || "");

            setValue("qualifications", req?.qualifications || "");
            setValue("responsibilities", req?.responsibilities || "");

            setValue("week_from1", req?.availability1.split("-")[0] || "");
            setValue("week_to1", req?.availability1.split("-")[1]) || "";
            setValue("week_from2", req?.availability2.split("-")[0] || "");
            setValue("week_to2", req?.availability2.split("-")[1]) || "";
        } else if (positionType === "New Position") {
            setValue("title", "");
            setValue("department_id", "");
            setValue("location_id", "");
            setValue("employment_type", "");
            setValue("priority", "");
            setValue("account_id", "");
            setValue("number_of_positions", "");
            setValue("salary_range_from", "");
            setValue("salary_range_to", "");
            setValue("existing_position_id", "");
            setValue("qualifications", "");
            setValue("responsibilities", "");
            setValue("approver2_id", 1342);
            setValue("approver3_id", 3);

            setValue("interviewer1", "");
            setValue("availability1", "");
            setValue("interview_time1", "");
            setValue("interviewer2", "");
            setValue("availability2", "");
            setValue("interview_time2", "");
            setValue("erf_classification", "");
            setValue("target_audience", "");
        }
    }, [positionType, selectedPosition, setValue]);

    async function onSubmit(form_data) {
        try {
            await create_job_requisition_service({
                ...form_data,
                availability1: `${form_data.week_from1}-${form_data.week_to1} `,
                availability2: `${form_data.week_from2}-${form_data.week_to2} `,
                salary_range: `₱${peso_format(form_data.salary_range_from)} ${form_data.salary_range_to
                    ? ` - ₱${peso_format(form_data.salary_range_to)}`
                    : ""
                    }`,
            });
            dispatch(
                setAlert({
                    type: "success",
                    title: "Job Requisition Created Successfully!",
                    message:
                        "The job requisition has been created and is ready for review.",
                    open: true,
                }),
            );
            router.visit(window.location.pathname)
            reset();
            setOpen(false);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to create job requisition",
                    message:
                        error?.response?.data?.message ||
                        error?.message ||
                        "Something went wrong",
                    open: true,
                }),
            );
        }
    }

    const sites = data?.locations?.find(
        (res) => res.id == watchedValues.location_id,
    )?.sites;

    const weeks = [
        {
            value: "Sunday",
            label: "Sunday",
        },
        {
            value: "Monday",
            label: "Monday",
        },
        {
            value: "Tuesday",
            label: "Tuesday",
        },
        {
            value: "Wednesday",
            label: "Wednesday",
        },
        {
            value: "Thursday",
            label: "Thursday",
        },
        {
            value: "Friday",
            label: "Friday",
        },
        {
            value: "Saturday",
            label: "Saturday",
        },
    ];
    return (
        <div>
            {!hideButton && <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    New Job Requisition
                </div>
            </Button>}

            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <BriefcaseIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Talent Acquisition
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Create Job Requisition
                            </h2>
                        </div>
                    </div>
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col max-h-[75vh]"
                >
                    <div className="flex-1 h-[400px] overflow-y-auto space-y-6 pr-2 mb-2">
                        <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-300">
                            <label className="text-sm font-medium text-gray-700">
                                <span className="text-black">
                                    Position Type *
                                </span>
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
                                                    "Please select an existing position",
                                            }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Select Existing Position"
                                                    options={
                                                        data?.position?.map(
                                                            (res) => ({
                                                                label: res.title,
                                                                value: res.id,
                                                            }),
                                                        ) || []
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

                        {
                            positionType && <>
                                <div className="px-1 sm:px-3">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                        Position Details
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1 w-full">
                                                <Input
                                                    {...register("title", {
                                                        required: "Title is required",
                                                    })}
                                                    error={errors.title?.message}
                                                    label="Position Title"
                                                    placeholder="e.g. Senior Software Engineer"
                                                />
                                            </div>


                                            <div className="flex-1 w-full">
                                                <Controller
                                                    name="category"
                                                    control={control}
                                                    rules={{
                                                        required:
                                                            "category is required",
                                                    }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="Select category"
                                                            options={['Agent','Support']?.map(
                                                                (res) => ({
                                                                    label: res,
                                                                    value: res,
                                                                }),
                                                            )}
                                                            error={
                                                                errors.category
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="flex-1 w-full">
                                                <Controller
                                                    name="department_id"
                                                    control={control}
                                                    rules={{
                                                        required:
                                                            "Department is required",
                                                    }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="Select Department"
                                                            options={data?.departments?.map(
                                                                (res) => ({
                                                                    ...res,
                                                                    label: res.name,
                                                                    value: res.id,
                                                                }),
                                                            )}
                                                            error={
                                                                errors.department_id
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {String(watchedValues.department_id) ===
                                                "4" && (
                                                    <>
                                                        <div className="flex-1 w-full">
                                                            <Controller
                                                                name="account_id"
                                                                control={control}
                                                                rules={{
                                                                    required:
                                                                        "Account is required",
                                                                }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        label="Select Account"
                                                                        options={data?.accounts?.map(
                                                                            (res) => ({
                                                                                ...res,
                                                                                label: res.name,
                                                                                value: res.id,
                                                                            }),
                                                                        )}
                                                                        error={
                                                                            errors.account_id
                                                                                ?.message
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="flex-1 w-full">
                                                            <Input
                                                                {...register("wave", {
                                                                    required: "Wave is required",
                                                                })}
                                                                min="0"
                                                                error={errors.wave?.message}
                                                                type="number"
                                                                label="Wave"
                                                                placeholder="Wave of account"
                                                            />
                                                        </div>
                                                    </>

                                                )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                placeholder="e.g. 2"
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
                                                        ]}
                                                        error={errors.priority?.message}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Controller
                                                name="erf_classification"
                                                control={control}
                                                rules={{
                                                    required:
                                                        "ERF Classification is required",
                                                }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="ERF Classification"
                                                        options={[
                                                            {
                                                                value: "New Role",
                                                                label: "New Role",
                                                            },
                                                            {
                                                                value: "Additional Manpower",
                                                                label: "Additional Manpower",
                                                            },
                                                            {
                                                                value: "Internal Job Posting",
                                                                label: "Internal Job Posting",
                                                            },
                                                            {
                                                                value: "Replacement (due to resignation/termination/personnel movement)",
                                                                label: "Replacement (due to resignation/termination/personnel movement)",
                                                            },
                                                        ]}
                                                        error={
                                                            errors.erf_classification
                                                                ?.message
                                                        }
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="target_audience"
                                                control={control}
                                                rules={{
                                                    required:
                                                        "Target Audience is required",
                                                }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="Target Audience"
                                                        options={[
                                                            {
                                                                value: "Both",
                                                                label: "Both",
                                                            },
                                                            {
                                                                value: "Internal",
                                                                label: "Internal",
                                                            },
                                                            {
                                                                value: "External",
                                                                label: "External",
                                                            },
                                                        ]}
                                                        error={
                                                            errors.target_audience
                                                                ?.message
                                                        }
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="position_level"
                                                control={control}
                                                rules={{
                                                    required:
                                                        "Position Level is required",
                                                }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="Position Level"
                                                        options={[
                                                            {
                                                                value: "Rank and File",
                                                                label: "Rank and File",
                                                            },
                                                            {
                                                                value: "Supervisor",
                                                                label: "Supervisor",
                                                            },
                                                            {
                                                                value: "Manager",
                                                                label: "Manager",
                                                            },
                                                            {
                                                                value: "Executive",
                                                                label: "Executive",
                                                            },
                                                        ]}
                                                        error={
                                                            errors.position_level
                                                                ?.message
                                                        }
                                                    />
                                                )}
                                            />
                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Controller
                                                name="location_id"
                                                control={control}
                                                rules={{
                                                    required: "Location is required",
                                                }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="Select Location"
                                                        options={data?.locations?.map(
                                                            (res) => ({
                                                                label: res.name,
                                                                value: res.id,
                                                            }),
                                                        )}
                                                        error={
                                                            errors.location_id?.message
                                                        }
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="site_id"
                                                control={control}
                                                rules={{ required: "Site is required" }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="Select Site"
                                                        options={sites?.map((res) => ({
                                                            label: `${res.name} (${res.address})`,
                                                            value: res.id,
                                                        }))}
                                                        error={errors.site_id?.message}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
                                                <div className="flex-1">
                                                    <Input
                                                        {...register(
                                                            "salary_range_from",
                                                            {
                                                                required:
                                                                    "Salary Range is required",
                                                            },
                                                        )}
                                                        error={
                                                            errors.salary_range_from
                                                                ?.message
                                                        }
                                                        iconLeft="₱"
                                                        label="Salary Range From"
                                                        placeholder="e.g. 50,000"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        {...register(
                                                            "salary_range_to",
                                                            {
                                                                required:
                                                                    "Salary Range is required",
                                                            },
                                                        )}
                                                        error={
                                                            errors.salary_range_to
                                                                ?.message
                                                        }
                                                        iconLeft="₱"
                                                        label="To"
                                                        placeholder="e.g. 70,000"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex mt-2">
                                                <Input
                                                    type="date"
                                                    {...register("target_start_date", {
                                                        required:
                                                            "Target Start Date is required",
                                                    })}
                                                    error={
                                                        errors.target_start_date
                                                            ?.message
                                                    }
                                                    label="Target Start Date"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-1 sm:px-3">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                        Interviewer Detail
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Input
                                                {...register("interviewer1", {
                                                    required: "Interviewer is required",
                                                })}
                                                error={errors.interviewer1?.message}
                                                label="Interviewer "
                                                placeholder="e.g. John Doe"
                                            />

                                            <div className="flex gap-2">
                                                <Controller
                                                    name="week_from1"
                                                    control={control}
                                                    rules={{
                                                        required: "From is required",
                                                    }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="From"
                                                            options={weeks}
                                                            error={
                                                                errors.week_from1
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                                <div className="text-center flex items-center justify-center">
                                                    -
                                                </div>
                                                <Controller
                                                    name="week_to1"
                                                    control={control}
                                                    rules={{
                                                        required: "To is required",
                                                    }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="To "
                                                            options={weeks}
                                                            error={
                                                                errors.week_to1?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <Input
                                                type="time"
                                                {...register("interview_time1", {
                                                    required:
                                                        "Interview time is required",
                                                })}
                                                error={errors.interview_time1?.message}
                                                label="Interview Time"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Input
                                                {...register("interviewer2")}
                                                error={errors.interviewer2?.message}
                                                label="Interviewer 2 (optional)"
                                                placeholder="e.g. John Doe"
                                            />

                                            <div className="flex gap-2">
                                                <Controller
                                                    name="week_from2"
                                                    control={control}
                                                    // rules={{
                                                    //     required:
                                                    //         "From 1 1 is required",
                                                    // }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="From"
                                                            options={weeks}
                                                            error={
                                                                errors.week_from2
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                                <div className="text-center flex items-center justify-center">
                                                    -
                                                </div>
                                                <Controller
                                                    name="week_to2"
                                                    control={control}
                                                    // rules={{
                                                    //     required: "To is required",
                                                    // }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="To"
                                                            options={weeks}
                                                            error={
                                                                errors.week_to2?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <Input
                                                type="time"
                                                {...register("interview_time2")}
                                                error={errors.interview_time2?.message}
                                                label="Interview Time 2 (optional)"
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

                                <div className="px-1 sm:px-3">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                        Approvers
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Select
                                                label="Approver 1 "
                                                required
                                                name="approver1_id"
                                                options={
                                                    users?.users?.map((res) => ({
                                                        ...res,
                                                        label: res.name,
                                                        value: res.id,
                                                    })) || []
                                                }
                                                value={watchedValues.approver1_id}
                                                onChange={(val) =>
                                                    setValue("approver1_id", val)
                                                }
                                                error={errors.approver1_id?.message}
                                            />
                                            <Select
                                                label="Approver 2 "
                                                required
                                                name="approver2_id"
                                                options={
                                                    users?.users?.map((res) => ({
                                                        ...res,
                                                        label: res.name,
                                                        value: res.id,
                                                    })) || []
                                                }
                                                value={watchedValues.approver2_id}
                                                error={errors.approver2_id?.message}
                                                onChange={(val) =>
                                                    setValue("approver2_id", val)
                                                }
                                            />
                                            <Select
                                                label="Approver 3 "
                                                required
                                                name="approver3_id"
                                                options={
                                                    users?.users?.map((res) => ({
                                                        ...res,
                                                        label: res.name,
                                                        value: res.id,
                                                    })) || []
                                                }
                                                value={watchedValues.approver3_id}
                                                onChange={(val) =>
                                                    setValue("approver3_id", val)
                                                }
                                                error={errors.approver3_id?.message}
                                            />
                                        </div>

                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Note:
                                                </span>{" "}
                                                The request is approved by the 1st
                                                approver, Director, and TA Manager, then
                                                assigned to a recruiter.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-1 sm:px-3 space-y-4">
                                    <Controller
                                        name="qualifications"
                                        control={control}
                                        rules={{
                                            required:
                                                "Position Requirements is required",
                                        }}
                                        render={({ field }) => (
                                            <Wysiwyg
                                                label="Job / Position Requirements"
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.qualifications?.message}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="responsibilities"
                                        control={control}
                                        rules={{
                                            required: "Responsibility is required",
                                        }}
                                        render={({ field }) => (
                                            <Wysiwyg
                                                label="Job Description / Responsibility"
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.responsibilities?.message}
                                            />
                                        )}
                                    />
                                </div>
                            </>
                        }


                    </div>

                    <div className="sticky bottom-0 bg-white border-t pt-4 mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 pb-2 px-1 sm:px-3">
                        <Button
                            variant="secondary"
                            type="button"
                            outlined
                            className="w-full sm:w-auto"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
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
