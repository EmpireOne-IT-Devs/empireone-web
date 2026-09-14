import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ClipboardCheckIcon } from "lucide-react";
import { FaPencil } from "react-icons/fa6";

import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_leader_thunk } from "@/app/redux/employee-relation-thunk";
import { update_leaders_service } from "@/app/services/er-leaders-service";

export default function EditLeadSection({ props_data }) {
    const dispatch = useDispatch();
    const { leaders, users } = useSelector((state) => state.human_resources);
    const [open, setOpen] = useState(false);

    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            user_id: "",
            department_manager_id: "",
            e_r_leader_id: ""
        },
    });

    const watchedValues = watch();

    // Reset/populate form values whenever the modal opens or props_data changes
    useEffect(() => {
        if (open) {
            reset({
                user_id: props_data?.user?.id ?? "",
                department_manager_id: props_data?.employee?.department_manager_id ?? "",
                e_r_leader_id: props_data?.id
            });
        }
    }, [open, props_data, reset]);

    // useEffect(() => {
    //     if (open) {

    //         console.log('leadersleaders', props_data?.id)
    //     }
    // }, [open])

    // Memoize options to prevent recalculating on every render
    const leaderOptions = useMemo(() => {
        return (leaders || []).map((res) => ({
            ...res,
            label: `${res?.employee?.personal_information?.first_name ?? ""} ${res?.employee?.personal_information?.last_name ?? ""}`.trim(),
            value: res.id,
        }));
    }, [leaders]);

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            await update_leaders_service(data);
            await dispatch(get_leader_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Leader Updated Successfully!",
                })
            );
            handleClose();
        } catch (error) {
            console.error("Failed to assign leader:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Failed to update leader. Please try again.",
                })
            );
        }
    };

    // Helper to close modal and reset form
    const handleClose = () => {
        setOpen(false);
        reset();
    };

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                <FaPencil />
            </Button>

            <Modal
                isOpen={open}
                onClose={handleClose}
                width="max-w-xl h-96"
                title={
                    <div className="flex items-center gap-3 p-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <ClipboardCheckIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Employee Relations
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Edit Team Leader
                            </h2>
                        </div>
                    </div>
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-3 flex h-full flex-col items-start gap-3 justify-between w-full"
                >
                    <Select
                        label="Leader"
                        required
                        name="user_id"
                        options={users.map((res) => ({
                            ...res,
                            label: `${res?.personal_information?.first_name} ${res?.personal_information?.last_name}`,
                            value: res.id,
                        }))}
                        value={watchedValues.user_id}
                        onChange={(val) =>
                            setValue("user_id", val, { shouldValidate: true })
                        }
                        error={errors.user_id?.message}
                        className="w-full"
                    />

                    <Select
                        label="Department Manager"
                        required
                        name="department_manager_id"
                        options={leaderOptions}
                        value={watchedValues.department_manager_id}
                        onChange={(val) =>
                            setValue("department_manager_id", val, { shouldValidate: true })
                        }
                        error={errors.department_manager_id?.message}
                        className="w-full"
                    />

                    <div className="w-full mt-auto pt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            loading={isSubmitting}
                        >
                            UPDATE
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}