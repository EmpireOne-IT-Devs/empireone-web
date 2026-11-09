import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave, FiMonitor } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import {
    AVAILABILITY,
    MONITOR_STATUSES,
    MONITOR_TYPES,
    toOptions,
} from "./monitor-helpers";

const DEFAULT_VALUES = {
    serialNumber: "",
    brand: "",
    model: "",
    screenSize: "",
    deviceType: "LED Monitor",
    resolution: "",
    status: "Available",
    availability: "Available",
    location: "",
    station: "",
    issuedTo: "",
    price: "",
};

function SectionHeading({ children }) {
    return <h3 className="text-sm font-semibold text-gray-900">{children}</h3>;
}

export default function CreateMonitorSection({
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
            serialNumber: values.serialNumber.trim(),
            brand: values.brand.trim(),
            model: values.model.trim(),
            screenSize: values.screenSize.trim(),
            resolution: values.resolution.trim(),
            location: values.location.trim(),
            station: values.station.trim(),
            issuedTo: values.issuedTo.trim() || null,
            price: values.price === "" ? null : Number(values.price),
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
                        <FiMonitor className="h-4 w-4 text-purple-600" />
                        Add Monitor
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Create a monitor record for your asset inventory.
                    </p>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-5 p-2"
                noValidate
            >
                {/* Monitor specifications */}
                <div className="space-y-4">
                    <SectionHeading>Monitor specifications</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Serial number *"
                            name="serialNumber"
                            placeholder="e.g. DELL-P2422H-006"
                            error={errors.serialNumber}
                            {...register("serialNumber", {
                                required: "Serial number is required.",
                                minLength: { value: 3, message: "Serial number is too short." },
                            })}
                        />
                        <Input
                            label="Brand *"
                            name="brand"
                            placeholder="e.g. Dell"
                            error={errors.brand}
                            {...register("brand", {
                                required: "Brand is required.",
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Model *"
                            name="model"
                            placeholder="e.g. P2422H"
                            error={errors.model}
                            {...register("model", {
                                required: "Model is required.",
                            })}
                        />
                        <Input
                            label="Screen size *"
                            name="screenSize"
                            placeholder="e.g. 24 in"
                            error={errors.screenSize}
                            {...register("screenSize", {
                                required: "Screen size is required.",
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="deviceType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Device type"
                                    name="deviceType"
                                    options={toOptions(MONITOR_TYPES)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.deviceType}
                                />
                            )}
                        />
                        <Input
                            label="Resolution"
                            name="resolution"
                            placeholder="e.g. 1920 × 1080"
                            error={errors.resolution}
                            {...register("resolution")}
                        />
                    </div>
                </div>

                {/* Availability and assignment */}
                <div className="space-y-4">
                    <SectionHeading>Availability and assignment</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Status"
                                    name="status"
                                    options={toOptions(MONITOR_STATUSES)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.status}
                                />
                            )}
                        />
                        <Controller
                            name="availability"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Availability"
                                    name="availability"
                                    options={toOptions(AVAILABILITY)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.availability}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Location"
                            name="location"
                            placeholder="e.g. Main office"
                            error={errors.location}
                            {...register("location")}
                        />
                        <Input
                            label="Station"
                            name="station"
                            placeholder="e.g. Station 05"
                            error={errors.station}
                            {...register("station")}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Issued to"
                            name="issuedTo"
                            placeholder="Recipient name"
                            error={errors.issuedTo}
                            {...register("issuedTo")}
                        />
                        <Input
                            label="Price"
                            name="price"
                            type="number"
                            min="0"
                            placeholder="e.g. ₱10,900"
                            error={errors.price}
                            {...register("price", {
                                min: { value: 0, message: "Price cannot be negative." },
                            })}
                        />
                    </div>
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
                        variant="success"
                        disabled={isSubmitting || submitting}
                        loading={isSubmitting || submitting}
                        className="w-full sm:w-auto"
                    >
                        <FiSave className="mr-2 h-4 w-4" />
                        Save Monitor
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
