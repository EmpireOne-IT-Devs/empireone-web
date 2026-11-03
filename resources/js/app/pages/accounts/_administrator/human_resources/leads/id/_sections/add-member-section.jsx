import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_leader_by_id_thunk,
    get_leader_thunk,
} from "@/app/redux/employee-relation-thunk";
import { add_subordinates_service } from "@/app/services/er-leaders-service";
import store from "@/app/store/store";
import { FiCheckSquare as ClipboardCheckIcon } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

export default function AddMemberSection() {
    const dispatch = useDispatch();
    const { data } = useSelector((store) => store.app);
    const { leader } = useSelector((store) => store.human_resources);
    const er_leader_id = window.location.pathname.split("/")[5];
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
            subordinates: [{ location_id: "", user_id: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subordinates",
    });

    const watchedSubordinates = watch("subordinates") || [];

    useEffect(() => {
        fields.forEach((_, index) => {
            register(`subordinates.${index}.location_id`, {
                required: "Please select a location",
            });
            register(`subordinates.${index}.user_id`, {
                required: "Please select a member",
            });
        });
    }, [register, fields]);

    const selectedUserIds = watchedSubordinates
        .map((sub) => sub.user_id)
        .filter(Boolean);

    // List of already assigned user IDs to exclude
    const existingLeaderIds =
        leader?.data?.subordinates?.map(
            (item) => item.user_id || item.id,
        ) || [];

    // All available employees excluding existing ones
    const unassignedEmployees =
        leader?.employees?.filter(
            (user) => !existingLeaderIds.includes(user.id),
        ) || [];

    // Helper to safely extract user location_id across different API shapes
    const getUserLocationId = (user) => {
        if (!user) return null;
        if (user.location_id !== undefined && user.location_id !== null) {
            return String(user.location_id);
        }
        if (Array.isArray(user.account_employee) && user.account_employee.length > 0) {
            return String(user.account_employee[0]?.location_id || "");
        }
        if (user.account_employee?.location_id !== undefined && user.account_employee?.location_id !== null) {
            return String(user.account_employee.location_id);
        }
        if (user.employee?.location_id !== undefined && user.employee?.location_id !== null) {
            return String(user.employee.location_id);
        }
        return null;
    };

    const locationOptions =
        data?.locations?.map((loc) => ({
            label: loc.name || loc.location_name || `Location ${loc.id}`,
            value: loc.id,
        })) || [];

    const onSubmit = async (formData) => {
        try {
            const payload = {
                er_leader_id: er_leader_id,
                subordinates: formData.subordinates.map((sub) => ({
                    user_id: sub.user_id,
                    location_id: sub.location_id,
                })),
            };

            await add_subordinates_service(payload);
            await store.dispatch(
                get_leader_by_id_thunk(window.location.pathname.split("/")[5]),
            );

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

    const handleClose = () => {
        setOpen(false);
        reset({
            subordinates: [{ location_id: "", user_id: "" }],
        });
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>ADD MEMBER</Button>

            <Modal
                isOpen={open}
                onClose={handleClose}
                width="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
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
                                Add Member
                            </h2>
                        </div>
                    </div>
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 flex flex-col w-full h-full"
                >
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[55vh] p-4">
                        {fields.map((field, index) => {
                            const rowLocationId = watchedSubordinates[index]?.location_id;
                            const rowUserId = watchedSubordinates[index]?.user_id;

                            const locationError =
                                errors?.subordinates?.[index]?.location_id?.message;
                            const memberError =
                                errors?.subordinates?.[index]?.user_id?.message;

                            // Filter members for this row
                            const rowMemberOptions = unassignedEmployees
                                .filter((user) => {
                                    const userLocId = getUserLocationId(user);

                                    // If a location is selected, match against user's location
                                    if (rowLocationId && userLocId) {
                                        if (String(userLocId) !== String(rowLocationId)) {
                                            return false;
                                        }
                                    }

                                    // Retain the current user if already chosen in this row
                                    if (rowUserId && String(rowUserId) === String(user.id)) {
                                        return true;
                                    }

                                    // Prevent selecting the same member in other rows
                                    return !selectedUserIds.includes(user.id);
                                })
                                .map((res) => {
                                    const firstName =
                                        res?.personal_information?.first_name ||
                                        res?.first_name ||
                                        "";
                                    const lastName =
                                        res?.personal_information?.last_name ||
                                        res?.last_name ||
                                        "";
                                    const fullName = `${firstName} ${lastName}`.trim();

                                    return {
                                        label: fullName || res?.name || res?.email || `Employee #${res.id}`,
                                        value: res.id,
                                    };
                                });

                            return (
                                <div
                                    key={field.id}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Member #{index + 1}
                                        </span>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors text-xs flex items-center gap-1"
                                                title="Remove row"
                                            >
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Location Select */}
                                        <Select
                                            label="Location"
                                            required
                                            name={`subordinates.${index}.location_id`}
                                            options={locationOptions}
                                            value={rowLocationId || ""}
                                            onChange={(val) => {
                                                setValue(
                                                    `subordinates.${index}.location_id`,
                                                    val,
                                                    { shouldValidate: true },
                                                );
                                                setValue(
                                                    `subordinates.${index}.user_id`,
                                                    "",
                                                );
                                            }}
                                            error={locationError}
                                            className="w-full"
                                        />

                                        {/* Member Select */}
                                        <Select
                                            label="Member"
                                            required
                                            name={`subordinates.${index}.user_id`}
                                            options={rowMemberOptions}
                                            value={rowUserId || ""}
                                            onChange={(val) =>
                                                setValue(
                                                    `subordinates.${index}.user_id`,
                                                    val,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            disabled={!rowLocationId}
                                            error={memberError}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() =>
                                append({ location_id: "", user_id: "" })
                            }
                            className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:text-blue-800 transition-colors p-3 border border-dashed border-blue-300 rounded-lg w-full justify-center hover:bg-blue-50 mt-2"
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