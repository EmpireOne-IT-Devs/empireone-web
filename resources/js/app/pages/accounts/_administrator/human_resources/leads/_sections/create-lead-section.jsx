import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_leader_thunk } from "@/app/redux/employee-relation-thunk";
import { add_leader_service } from "@/app/services/er-leaders-service";
import store from "@/app/store/store";
import { ClipboardCheckIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

export default function CreateLeadSection() {
    const dispatch = useDispatch();
    const { leaders,users } = useSelector((store) => store.human_resources);
console.log('users',users)
    const [open, setOpen] = useState(false);

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
            user_id: "",
        },
    });

    const watchedValues = watch();

    useEffect(() => {
        register("user_id", { required: "Please select a leader" });
    }, [register]);

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            await add_leader_service(data);
            await store.dispatch(get_leader_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Leader Added Successfully!",
                }),
            );
            setOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to assign leader:", error);
        }
    };

    // Helper to close modal and clear form errors
    const handleClose = () => {
        setOpen(false);
        reset();
    };

    // --- FILTERING LOGIC ---
    // Extract an array of IDs for users who are already leaders
    // (Checks both user_id and id to ensure it catches the correct property from your API)
    const existingLeaderIds =
        leaders?.data?.map((leader) => leader.user_id || leader.id) || [];

    // Filter out users whose ID already exists in the existingLeaderIds array
    const availableUsers =
        users?.filter((user) => !existingLeaderIds.includes(user.id)) ||
        [];

    return (
        <>
            <Button onClick={() => setOpen(true)}>ADD LEADER</Button>

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
                                Add Team Leader
                            </h2>
                        </div>
                    </div>
                }
            >
                {/* Wrapped the content in a form tag to enable validation and submission */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-3 flex h-full flex-col items-start justify-between w-full"
                >
                    <Select
                        label="Leader"
                        required
                        name="user_id"
                        // Pass the filtered availableUsers instead of the full users array
                        options={availableUsers.map((res) => ({
                            ...res,
                            label: res.name,
                            value: res.id,
                        }))}
                        value={watchedValues.user_id}
                        onChange={(val) =>
                            setValue("user_id", val, { shouldValidate: true })
                        }
                        error={errors.user_id?.message}
                        className="w-full"
                    />

                    <div className="w-full mt-auto pt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            loading={isSubmitting}
                        >
                            SUBMIT
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
