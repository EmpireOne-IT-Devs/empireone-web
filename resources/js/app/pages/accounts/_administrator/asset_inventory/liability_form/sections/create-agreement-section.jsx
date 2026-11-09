import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSend, FiMonitor, FiUser, FiTool, FiAlertTriangle } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import MultiSelect from "@/app/_components/multi-select";
import TextArea from "@/app/_components/textarea";
import Button from "@/app/_components/button";
import {
    ACCESSORY_OPTIONS,
    DEVICE_CONDITIONS,
    toOptions,
} from "./liability-form-helpers";
import { deviceOptions } from "../../item_request/sections/item-request-helpers";
import { initialItemRequests } from "../../item_request/sections/item-request-mock-data";
const DEFAULT_VALUES = {
    itemRequestId: "",
    assetTag: "",
    employeeId: "",
    condition: "Good",
    accessories: [],
    adminNotes: "",
};

// Approved item requests that have not been issued yet are the recommended source.
const approvedRequestOptions = () =>
    initialItemRequests
        .filter((r) => r.status === "Approved")
        .map((r) => ({
            label: `${r.id} — ${r.deviceName} (${r.assetTag}) → ${r.assigneeName}`,
            value: r.id,
        }));

function SectionHeading({ icon: Icon, children }) {
    return (
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Icon className="h-4 w-4 text-purple-600" />
            {children}
        </h3>
    );
}

export default function CreateAgreementSection({
    isOpen,
    onClose,
    onSubmit,
    submitting = false,
}) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: DEFAULT_VALUES });

    const itemRequestId = watch("itemRequestId");
    const assetTag = watch("assetTag");

    // Always start from a clean form when the modal opens.
    useEffect(() => {
        if (isOpen) reset(DEFAULT_VALUES);
    }, [isOpen, reset]);

    // Picking an approved request pre-fills device + employee.
    useEffect(() => {
        if (!itemRequestId) return;
        const request = initialItemRequests.find((r) => r.id === itemRequestId);
        if (request) {
            setValue("assetTag", request.assetTag);
            setValue("employeeId", request.assigneeId);
        }
    }, [itemRequestId, setValue]);

    // Picking a device directly clears the approved-request selection.
    useEffect(() => {
        if (assetTag && itemRequestId) {
            const request = initialItemRequests.find((r) => r.id === itemRequestId);
            if (request && request.assetTag !== assetTag) {
                setValue("itemRequestId", "");
            }
        }
    }, [assetTag, itemRequestId, setValue]);

    const handleClose = () => {
        reset(DEFAULT_VALUES);
        onClose?.();
    };

    const submit = async (values) => {
        await onSubmit?.({
            ...values,
            employeeId: values.employeeId.trim(),
            adminNotes: values.adminNotes.trim(),
        });
        handleClose();
    };

    const requestOptions = useMemo(() => approvedRequestOptions(), []);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-xl"
            title={
                <div>
                    <h2 className="flex items-center gap-2 text-[15px] font-semibold leading-snug text-neutral-800">
                        <FiMonitor className="h-4 w-4 text-purple-600" />
                        Device Assignment
                    </h2>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-5 p-2"
                noValidate
            >
                {/* Device source */}
                <div className="space-y-3">
                    <Controller
                        name="itemRequestId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Select from Approved Device Request (Recommended)"
                                name="itemRequestId"
                                options={[
                                    { label: "Choose an approved device request…", value: "" },
                                    ...requestOptions,
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.itemRequestId}
                            />
                        )}
                    />

                    <div className="flex items-center gap-3" aria-hidden="true">
                        <span className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            OR
                        </span>
                        <span className="h-px flex-1 bg-gray-200" />
                    </div>

                    <Controller
                        name="assetTag"
                        control={control}
                        rules={{ required: "Select a device." }}
                        render={({ field }) => (
                            <Select
                                label="Select Device Directly"
                                name="assetTag"
                                options={[
                                    { label: "Choose a device…", value: "" },
                                    ...deviceOptions(),
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.assetTag}
                            />
                        )}
                    />
                </div>

                {/* Employee */}
                <div className="space-y-3">
                    <SectionHeading icon={FiUser}>Employee Information</SectionHeading>
                    <div>
                        <Input
                            label="Employee ID *"
                            name="employeeId"
                            error={errors.employeeId}
                            {...register("employeeId", {
                                required: "Employee ID is required.",
                                minLength: { value: 3, message: "Employee ID is too short." },
                            })}
                        />
                        <p className="mt-1 text-xs text-gray-400">
                            The employee will need to verify this ID to access the agreement
                        </p>
                    </div>
                </div>

                {/* Condition & accessories */}
                <div className="space-y-3">
                    <SectionHeading icon={FiTool}>Device Condition &amp; Accessories</SectionHeading>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="condition"
                            control={control}
                            rules={{ required: "Select a condition." }}
                            render={({ field }) => (
                                <Select
                                    label="Device Condition"
                                    name="condition"
                                    options={toOptions(DEVICE_CONDITIONS)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.condition}
                                />
                            )}
                        />
                        <Controller
                            name="accessories"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    label="Included Accessories"
                                    name="accessories"
                                    options={toOptions(ACCESSORY_OPTIONS)}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Admin notes */}
                <div>
                    <TextArea
                        label="Admin Notes (Internal)"
                        name="adminNotes"
                        rows={3}
                        error={errors.adminNotes?.message}
                        {...register("adminNotes")}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        These notes are for internal use and will not be visible to the employee
                    </p>
                </div>

                {/* Checklist */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                        <FiAlertTriangle className="h-4 w-4" />
                        Before Creating the Agreement
                    </h4>
                    <ul className="mt-2 list-disc space-y-1 pl-6 text-xs leading-relaxed text-amber-800">
                        <li>Ensure the device is available and ready for assignment</li>
                        <li>Verify the employee ID is correct and active</li>
                        <li>The generated link will be valid for 7 days</li>
                        <li>The employee will need to complete their personal information and sign digitally</li>
                    </ul>
                </div>

                <div className="mt-1 flex flex-col justify-end gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                    <Button
                        type="button"
                        variant="secondary"
                        outlined
                        onClick={handleClose}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={isSubmitting || submitting}
                        loading={isSubmitting || submitting}
                        className="w-full sm:w-auto"
                    >
                        <FiSend className="mr-2 h-4 w-4" />
                        Create Agreement
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
