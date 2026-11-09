import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave, FiPackage } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import Button from "@/app/_components/button";
import {
    LOCATIONS,
    PART_TYPES,
    toOptions,
} from "./part-helpers";

const DEFAULT_VALUES = {
    type: "Memory",
    brand: "",
    name: "",
    price: "",
    quantity: "0",
    lowStockThreshold: "5",
    location: "Main office",
    description: "",
};

function SectionHeading({ children }) {
    return <h3 className="text-sm font-semibold text-gray-900">{children}</h3>;
}

export default function CreatePartSection({
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
            brand: values.brand.trim(),
            name: values.name.trim(),
            description: values.description.trim(),
            price: values.price === "" ? null : Number(values.price),
            quantity: Number(values.quantity),
            lowStockThreshold: Number(values.lowStockThreshold),
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
                        <FiPackage className="h-4 w-4 text-purple-600" />
                        Add Part
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Record a component or accessory for your parts inventory.
                    </p>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-5 p-2"
                noValidate
            >
                {/* Part information */}
                <div className="space-y-4">
                    <SectionHeading>Part information</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: "Select a type." }}
                            render={({ field }) => (
                                <Select
                                    label="Type *"
                                    name="type"
                                    options={toOptions(PART_TYPES)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.type}
                                />
                            )}
                        />
                        <Input
                            label="Brand *"
                            name="brand"
                            placeholder="e.g. Kingston"
                            error={errors.brand}
                            {...register("brand", {
                                required: "Brand is required.",
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Part name *"
                            name="name"
                            placeholder="e.g. Fury DDR4 16 GB"
                            error={errors.name}
                            {...register("name", {
                                required: "Part name is required.",
                            })}
                        />
                        <Input
                            label="Unit price"
                            name="price"
                            type="number"
                            min="0"
                            placeholder="e.g. ₱2,250"
                            error={errors.price}
                            {...register("price", {
                                min: { value: 0, message: "Price cannot be negative." },
                            })}
                        />
                    </div>
                </div>

                {/* Stock and location */}
                <div className="space-y-4">
                    <SectionHeading>Stock and location</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Quantity in stock"
                            name="quantity"
                            type="number"
                            min="0"
                            error={errors.quantity}
                            {...register("quantity", {
                                required: "Quantity is required.",
                                min: { value: 0, message: "Quantity cannot be negative." },
                            })}
                        />
                        <Input
                            label="Low-stock threshold"
                            name="lowStockThreshold"
                            type="number"
                            min="0"
                            error={errors.lowStockThreshold}
                            {...register("lowStockThreshold", {
                                required: "Threshold is required.",
                                min: { value: 0, message: "Threshold cannot be negative." },
                            })}
                        />
                    </div>

                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Location"
                                name="location"
                                options={toOptions(LOCATIONS)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.location}
                            />
                        )}
                    />
                </div>

                {/* Description */}
                <TextArea
                    label="Description"
                    name="description"
                    rows={3}
                    error={errors.description?.message}
                    {...register("description")}
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
                        variant="success"
                        disabled={isSubmitting || submitting}
                        loading={isSubmitting || submitting}
                        className="w-full sm:w-auto"
                    >
                        <FiSave className="mr-2 h-4 w-4" />
                        Save Part
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
