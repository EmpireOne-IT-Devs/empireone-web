import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
import { add_subordinates_service } from "@/app/services/er-leaders-service";
import store from "@/app/store/store";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

export default function AddMemberSection() {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.job_requisitions);
    const { data } = useSelector((store) => store.app);
    const { leader } = useSelector((store) => store.human_resourcess);
    const er_leader_id = data?.user?.leader?.id;
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
            subordinates: [{ user_id: "" }], // Start with one empty dynamic field
        },
    });

    // Setup dynamic field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "subordinates",
    });

    // Safely watch the array, defaulting to an empty array
    const watchedSubordinates = watch("subordinates") || [];

    // --- DOUBLE CHOOSE PREVENTION LOGIC ---
    // Extract all user_ids currently selected in the form
    const selectedUserIds = watchedSubordinates
        .map((sub) => sub.user_id)
        .filter(Boolean); // Remove empty strings/undefined

    // Register all dynamic fields to enforce validation
    useEffect(() => {
        fields.forEach((_, index) => {
            register(`subordinates.${index}.user_id`, {
                required: "Please select a member",
            });
        });
    }, [register, fields]);

    // Handle form submission
    const onSubmit = async (form_data) => {
        try {
            const payload = {
                subordinates: form_data.subordinates.map((sub) => sub.user_id),
                er_leader_id: er_leader_id,
            };

            await add_subordinates_service(payload);

            await store.dispatch(get_app_data_thunk());

            await dispatch(
                setAlert({
                    type: "success",
                    title: "Members Added Successfully!",
                }),
            );

            handleClose();
        } catch (error) {
            console.error("Failed to assign members:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Failed to add members",
                }),
            );
        }
    };

    // Helper to close modal and clear form completely
    const handleClose = () => {
        setOpen(false);
        reset({ subordinates: [{ user_id: "" }] });
    };

    // --- BASE FILTERING LOGIC ---
    const existingLeaderIds =
        data?.user?.leader?.subordinates?.map(
            (leader) => leader.employee.id || leader.id,
        ) || [];

    console.log("leader?.employees", data?.user?.leader?.subordinates);
    // Filter out users who are already saved as subordinates
    const availableUsers =
        leader?.employees?.filter(
            (user) => !existingLeaderIds.includes(user.id),
        ) || [];

    return (
        <>
            <Button onClick={() => setOpen(true)}>ADD MEMBER</Button>

            <Modal
                isOpen={open}
                onClose={handleClose}
                width="max-w-xl max-h-[80vh] overflow-hidden flex flex-col"
                title="Add Members"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 flex flex-col w-full h-full "
                >
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[50vh] p-5">
                        {fields.map((field, index) => {
                            const fieldError =
                                errors?.subordinates?.[index]?.user_id?.message;

                            return (
                                <div
                                    key={field.id}
                                    className="flex items-start gap-2 relative bg-gray-50  rounded border border-gray-100"
                                >
                                    <div className="flex-1">
                                        <Select
                                            label={`Member ${index + 1}`}
                                            required
                                            name={`subordinates.${index}.user_id`}
                                            options={availableUsers
                                                // Filter out options already selected in OTHER dropdowns
                                                .filter((res) => {
                                                    // Always keep the option if it's the one currently selected in THIS dropdown
                                                    if (
                                                        watchedSubordinates[
                                                            index
                                                        ]?.user_id === res.id
                                                    )
                                                        return true;
                                                    // Otherwise, remove it if it exists in the selectedUserIds array
                                                    return !selectedUserIds.includes(
                                                        res.id,
                                                    );
                                                })
                                                .map((res) => ({
                                                    ...res,
                                                    label: res.name,
                                                    value: res.id,
                                                }))}
                                            value={
                                                watchedSubordinates[index]
                                                    ?.user_id || ""
                                            }
                                            onChange={(val) =>
                                                setValue(
                                                    `subordinates.${index}.user_id`,
                                                    val,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            error={fieldError}
                                            className="w-full"
                                        />
                                    </div>

                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className=" text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition-colors h-10 w-10 flex items-center justify-center"
                                            title="Remove member"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => append({ user_id: "" })}
                            className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:text-blue-800 transition-colors p-3 border border-dashed border-blue-300 rounded w-full justify-center hover:bg-blue-50 mt-2"
                        >
                            + Add Another Member
                        </button>

                        <div className="w-full mt-6 pt-4 border-t border-gray-200 bg-white">
                            <Button
                                type="submit"
                                className="w-full"
                                loading={isSubmitting}
                            >
                                SUBMIT MEMBERS
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
}
