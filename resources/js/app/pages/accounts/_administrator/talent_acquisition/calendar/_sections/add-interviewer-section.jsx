import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import Input from "@/app/_components/input";
import store from "@/app/store/store";
import { create_job_interviewer_schedule_service } from "@/app/services/job-interviewer-schedule-service";
import { get_job_interviewer_schedule_thunk } from "@/app/redux/app-thunk";
import { setAlert } from "@/app/redux/app-slice";

export default function AddInterviewerSection({ autoOpen = false } = {}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (autoOpen) setOpen(true);
    }, [autoOpen]);

    const { interviewers, tas } = useSelector((store) => store.app);

    const dispatch = useDispatch()
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        register,
    } = useForm({
        defaultValues: {
            interviewer_id: "",
            day_of_week_from: "",
            day_of_week_to: "",
            start_time: "",
            end_time: "",
            break_time_start: "",
            break_time_end: "",
        },
    });
    const weeks = [
        { label: "Monday", value: "1" },
        { label: "Tuesday", value: "2" },
        { label: "Wednesday", value: "3" },
        { label: "Thursday", value: "4" },
        { label: "Friday", value: "5" },
        { label: "Saturday", value: "6" },
        { label: "Sunday", value: "7" },
    ];

    // Filter out users who are already interviewers
    const interviewerOptions =
        tas?.filter(
            (user) =>
                !interviewers?.some(
                    (interviewer) => interviewer.interviewer_id === user.user_id,
                ),
        )
            ?.map((res) => ({
                label: `${res.personal_information.first_name} ${res.personal_information.last_name}`,
                value: res.id,
            })) || [];

    console.log('tas', tas)
    const onSubmit = async (data) => {
        try {
            await create_job_interviewer_schedule_service({
                ...data,
                start_time: data.start_time + ":00",
                end_time: data.end_time + ":00",
                break_time_start: data.break_time_start + ":00",
                break_time_end: data.break_time_end + ":00",
            });
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
            reset();
        } catch (error) {
            console.error("Failed to save schedule:", error);
        } finally {
        }
    };

    return (
        <>
            <Button outlined onClick={() => setOpen(true)} className="text-xs">Add Interviewer</Button>

            <Modal
                isOpen={open}
                onClose={() => !isSubmitting && setOpen(false)}
                width="max-w-xl"
                title="Add Interviewer"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-3 flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-4 w-full">
                        {/* Interviewer Selection */}
                        <Controller
                            name="interviewer_id"
                            control={control}
                            rules={{ required: "Interviewer is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Interviewer"
                                    options={interviewerOptions}
                                    error={errors.interviewer_id?.message}
                                />
                            )}
                        />

                        {/* Days Selection */}
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
                                            error={
                                                errors.day_of_week_from?.message
                                            }
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
                                            error={
                                                errors.day_of_week_to?.message
                                            }
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
                            {isSubmitting ? "Saving..." : "Save Interviewer"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
