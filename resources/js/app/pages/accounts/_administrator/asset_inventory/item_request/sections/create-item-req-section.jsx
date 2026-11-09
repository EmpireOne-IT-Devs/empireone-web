import React, { useEffect } from "react";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import Button from "@/app/_components/button";
import {
    PRIORITIES,
    REQUEST_TYPES,
    deviceOptions,
    employeeOptions,
    toOptions,
} from "./item-request-helpers";

const DEFAULT_VALUES = {
    assetTag: "",
    assigneeId: "",
    requestType: "New Assignment",
    priority: "Normal",
    fromDate: "",
    untilDate: "",
    justification: "",
    purpose: "",
};

export default function CreateItemReqSection({
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
        getValues,
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
            justification: values.justification.trim(),
            purpose: values.purpose.trim(),
        });
        handleClose();
    };

    const today = moment().format("YYYY-MM-DD");

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-xl"
            title={
                <div>
                    <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                        Create Item Request
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Request a device assignment for yourself or another.
                    </p>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-4 p-2"
                noValidate
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="assetTag"
                        control={control}
                        rules={{ required: "Select a device." }}
                        render={({ field }) => (
                            <Select
                                label="Device"
                                name="assetTag"
                                options={deviceOptions()}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.assetTag}
                            />
                        )}
                    />
                    <Controller
                        name="assigneeId"
                        control={control}
                        rules={{ required: "Select an employee." }}
                        render={({ field }) => (
                            <Select
                                label="Assign To"
                                name="assigneeId"
                                options={employeeOptions()}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.assigneeId}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="requestType"
                        control={control}
                        rules={{ required: "Select a request type." }}
                        render={({ field }) => (
                            <Select
                                label="Request Type"
                                name="requestType"
                                options={toOptions(REQUEST_TYPES)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.requestType}
                            />
                        )}
                    />
                    <Controller
                        name="priority"
                        control={control}
                        rules={{ required: "Select a priority." }}
                        render={({ field }) => (
                            <Select
                                label="Priority"
                                name="priority"
                                options={toOptions(PRIORITIES)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.priority}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="From Date (Optional)"
                        name="fromDate"
                        type="date"
                        min={today}
                        error={errors.fromDate}
                        {...register("fromDate", {
                            validate: (value) =>
                                !value ||
                                moment(value).isSameOrAfter(today, "day") ||
                                "From date cannot be in the past.",
                        })}
                    />
                    <Input
                        label="Until Date (Optional)"
                        name="untilDate"
                        type="date"
                        min={getValues("fromDate") || today}
                        error={errors.untilDate}
                        {...register("untilDate", {
                            validate: (value) => {
                                if (!value) return true;
                                const from = getValues("fromDate");
                                if (from && moment(value).isBefore(from, "day")) {
                                    return "Until date cannot be before the from date.";
                                }
                                return (
                                    moment(value).isSameOrAfter(today, "day") ||
                                    "Until date cannot be in the past."
                                );
                            },
                        })}
                    />
                </div>

                <TextArea
                    label="Justification"
                    name="justification"
                    rows={3}
                    error={errors.justification?.message}
                    {...register("justification", {
                        required: "Please explain why this device is needed.",
                        minLength: { value: 10, message: "Add a little more detail (10+ characters)." },
                    })}
                />

                <TextArea
                    label="Purpose (Optional)"
                    name="purpose"
                    rows={3}
                    error={errors.purpose?.message}
                    {...register("purpose")}
                />

                <div className="mt-2 flex flex-col justify-end gap-2 border-t border-gray-100 pt-4 sm:flex-row">
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
                        Submit Request
                    </Button>
                </div>
            </form>
        </Modal>
    );
}