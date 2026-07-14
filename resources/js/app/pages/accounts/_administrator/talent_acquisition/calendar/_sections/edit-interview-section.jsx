import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
// Adjust these imports based on your actual file structure
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import Input from "@/app/_components/input";
import Button from "@/app/_components/button";
import { create_job_interviewer_schedule_service } from "@/app/services/job-interviewer-schedule-service";
import store from "@/app/store/store";
import { get_job_interviewer_schedule_thunk } from "@/app/redux/app-thunk";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";

const formatSchedule = (props_data) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[props_data.day_of_week_from]} - ${days[props_data.day_of_week_to]} (${props_data.start_time.slice(0, 5)} - ${props_data.end_time.slice(0, 5)})`;
};

// Assuming you have these options available, or you might pass them as props
const weeks = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
];

export default function EditInterviewection({ props_data, interviewerOptions = [] }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    // Initialize react-hook-form and set default values to the existing data
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            interviewer_id: props_data?.interviewer_id || "",
            day_of_week_from: props_data?.day_of_week_from ?? "",
            day_of_week_to: props_data?.day_of_week_to ?? "",
            start_time: props_data?.start_time || "",
            end_time: props_data?.end_time || "",
            break_time_start: props_data?.break_time_start || "",
            break_time_end: props_data?.break_time_end || "",
        },
    });

    const onSubmit = async (data) => {
        try {
            // TODO: Dispatch your update action or API call here
            console.log("Submitting updated interviewer data:", data);
            await create_job_interviewer_schedule_service(data)
            await store.dispatch(get_job_interviewer_schedule_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Updated Successfully!",
                    message:
                        "The change Form has been created and is ready for review.",
                    open: true,
                }),
            );
            setOpen(false);
        } catch (error) {
            console.error("Failed to update interviewer", error);
        }
    };

    console.log('props_data', props_data)
    return (
        <div>
            {/* Added onClick to open the modal */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-4 text-left w-full hover:opacity-80 transition-opacity"
            >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                    {props_data.interviewer?.name?.charAt(0) || "U"}
                </div>
                <div>
                    <div className="font-semibold text-gray-800">
                        {props_data.interviewer?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500 items-start mt-0.5 flex flex-col gap-2">
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600">
                            SCHEDULE
                        </span>
                        {formatSchedule(props_data)}
                    </div>
                </div>
            </button>

            <Modal
                isOpen={open}
                onClose={() => !isSubmitting && setOpen(false)}
                width="max-w-xl"
                title={props_data.interviewer?.name}// Changed to Edit
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-3 flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-4 w-full">
                        {/* Interviewer Selection */}

                        <div className="flex gap-3 w-full">
                            <div className="flex-1">
                                <Controller
                                    name="day_of_week_from"
                                    control={control}
                                    rules={{ required: "From is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Day From"
                                            options={weeks}
                                            error={errors.day_of_week_from?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex-1">
                                <Controller
                                    name="day_of_week_to"
                                    control={control}
                                    rules={{ required: "To is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Day To"
                                            options={weeks}
                                            error={errors.day_of_week_to?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Shift Times */}
                        <div className="flex gap-3 w-full">
                            <Input
                                {...register("start_time", {
                                    required: "Required",
                                })}
                                error={errors.start_time?.message}
                                type="time"
                                label="Clock In"
                            />
                            <Input
                                {...register("end_time", {
                                    required: "Required",
                                })}
                                error={errors.end_time?.message}
                                type="time"
                                label="Clock Out"
                            />
                        </div>

                        {/* Break Times */}
                        <div className="flex gap-3 w-full">
                            <Input
                                {...register("break_time_start", {
                                    required: "Required",
                                })}
                                error={errors.break_time_start?.message}
                                type="time"
                                label="Break Start"
                            />
                            <Input
                                {...register("break_time_end", {
                                    required: "Required",
                                })}
                                error={errors.break_time_end?.message}
                                type="time"
                                label="Break End"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end w-full gap-2 mt-6">
                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => setOpen(false)}
                            outlined
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}