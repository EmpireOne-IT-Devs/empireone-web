import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiRotateCcw, FiCornerUpLeft } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import Button from "@/app/_components/button";
import {
    RETURN_CONDITIONS,
    RETURN_REASONS,
    toOptions,
} from "./device-return-helpers";

const DEFAULT_VALUES = {
    deviceName: "",
    returningEmployee: "",
    reason: "Resignation",
    returnDate: "",
    condition: "Good",
    notes: "",
};

function SectionHeading({ children }) {
    return <h3 className="text-sm font-semibold text-gray-900">{children}</h3>;
}

export default function ProcessReturnSection({
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
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: DEFAULT_VALUES });

    // Always start from a clean form when the modal opens.
    useEffect(() => {
        if (isOpen) reset(DEFAULT_VALUES);
    }, [isOpen, reset]);

    const handleClose = () => {
        reset(DEFAULT_VALUES);
        onClose?.();
    };

    const submit = async (values) => {
        await onSubmit?.({
            ...values,
            deviceName: values.deviceName.trim(),
            returningEmployee: values.returningEmployee.trim(),
            notes: values.notes.trim(),
            returnDate: values.returnDate || null,
        });
        handleClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-xl"
            title={
                <div>
                    <h2 className="flex items-center gap-2 text-[15px] font-semibold leading-snug text-neutral-800">
                        <FiCornerUpLeft className="h-4 w-4 text-purple-600" />
                        Process Device Return
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Record the device and return context before inspection.
                    </p>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-5 p-2"
                noValidate
            >
                {/* Return information */}
                <div className="space-y-4">
                    <SectionHeading>Return information</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Device name *"
                            name="deviceName"
                            placeholder="e.g. Dell Latitude 5440"
                            error={errors.deviceName}
                            {...register("deviceName", {
                                required: "Device name is required.",
                                minLength: { value: 2, message: "Device name is too short." },
                            })}
                        />
                        <Input
                            label="Returning employee *"
                            name="returningEmployee"
                            placeholder="Employee name"
                            error={errors.returningEmployee}
                            {...register("returningEmployee", {
                                required: "Returning employee is required.",
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="reason"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Return reason"
                                    name="reason"
                                    options={toOptions(RETURN_REASONS)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.reason}
                                />
                            )}
                        />
                        <Input
                            label="Return date"
                            name="returnDate"
                            type="date"
                            error={errors.returnDate}
                            {...register("returnDate")}
                        />
                    </div>
                </div>

                {/* Inspection handoff */}
                <div className="space-y-4">
                    <SectionHeading>Inspection handoff</SectionHeading>

                    <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Reported condition"
                                name="condition"
                                options={toOptions(RETURN_CONDITIONS)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.condition}
                            />
                        )}
                    />
                </div>

                {/* Return notes */}
                <TextArea
                    label="Return notes"
                    name="notes"
                    rows={3}
                    error={errors.notes?.message}
                    {...register("notes")}
                />

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
                        <FiRotateCcw className="mr-2 h-4 w-4" />
                        Process Return
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
