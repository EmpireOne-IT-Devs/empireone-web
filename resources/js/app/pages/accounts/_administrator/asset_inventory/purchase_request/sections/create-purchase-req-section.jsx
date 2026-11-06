import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import {
    CATEGORIES,
    DEPARTMENTS,
    PRIORITIES,
    toOptions,
} from "./purchase-request-helpers";

const DEFAULT_VALUES = {
    itemName: "",
    department: "IT Department",
    requesterName: "",
    category: "Computer Hardware",
    priority: "Normal",
    quantity: "1",
    unitPrice: "",
    supplierName: "",
};

export default function CreatePurchaseReqSection({
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
            itemName: values.itemName.trim(),
            requesterName: values.requesterName.trim(),
            supplierName: values.supplierName.trim(),
            quantity: Number(values.quantity),
            unitPrice: Number(values.unitPrice),
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
                    <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                        Create Purchase Request
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Request new assets or equipment for your department.
                    </p>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-4 p-2"
                noValidate
            >
                <Input
                    label="Item name"
                    name="itemName"
                    error={errors.itemName}
                    {...register("itemName", {
                        required: "Item name is required.",
                        minLength: { value: 2, message: "Item name is too short." },
                    })}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="department"
                        control={control}
                        rules={{ required: "Select a department." }}
                        render={({ field }) => (
                            <Select
                                label="Department"
                                name="department"
                                options={toOptions(DEPARTMENTS)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.department}
                            />
                        )}
                    />
                    <Input
                        label="Requester name"
                        name="requesterName"
                        error={errors.requesterName}
                        {...register("requesterName", {
                            required: "Requester name is required.",
                        })}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: "Select a category." }}
                        render={({ field }) => (
                            <Select
                                label="Category"
                                name="category"
                                options={toOptions(CATEGORIES)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.category}
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
                        label="Quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        error={errors.quantity}
                        {...register("quantity", {
                            required: "Quantity is required.",
                            min: { value: 1, message: "Quantity must be at least 1." },
                        })}
                    />
                    <Input
                        label="Unit price (₱)"
                        name="unitPrice"
                        type="number"
                        min="0"
                        error={errors.unitPrice}
                        {...register("unitPrice", {
                            required: "Unit price is required.",
                            min: { value: 0, message: "Unit price cannot be negative." },
                        })}
                    />
                </div>

                <Input
                    label="Supplier name"
                    name="supplierName"
                    error={errors.supplierName}
                    {...register("supplierName")}
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