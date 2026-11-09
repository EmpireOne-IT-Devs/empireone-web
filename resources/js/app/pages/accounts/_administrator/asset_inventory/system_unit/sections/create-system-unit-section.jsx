import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave, FiMonitor } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import {
    LOCATIONS,
    SYSTEM_STATUSES,
    SYSTEM_TYPES,
    toOptions,
} from "./system-unit-helpers";

const DEFAULT_VALUES = {
    name: "",
    type: "Desktop",
    cpu: "",
    ram: "",
    storage: "",
    os: "",
    status: "Available",
    location: "Main office",
    station: "",
};

function SectionHeading({ children }) {
    return (
        <h3 className="text-sm font-semibold text-gray-900">{children}</h3>
    );
}

export default function CreateSystemUnitSection({
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
            name: values.name.trim(),
            cpu: values.cpu.trim(),
            ram: values.ram.trim(),
            storage: values.storage.trim(),
            os: values.os.trim(),
            station: values.station.trim(),
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
                        Add System Unit
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Capture the configuration and availability of a computer system.
                    </p>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-5 p-2"
                noValidate
            >
                {/* System information */}
                <div className="space-y-4">
                    <SectionHeading>System information</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="System name *"
                            name="name"
                            placeholder="e.g. Dell OptiPlex 7010"
                            error={errors.name}
                            {...register("name", {
                                required: "System name is required.",
                                minLength: { value: 2, message: "System name is too short." },
                            })}
                        />
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: "Select a type." }}
                            render={({ field }) => (
                                <Select
                                    label="Type *"
                                    name="type"
                                    options={toOptions(SYSTEM_TYPES)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.type}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="CPU *"
                            name="cpu"
                            placeholder="e.g. Intel Core i5"
                            error={errors.cpu}
                            {...register("cpu", {
                                required: "CPU is required.",
                            })}
                        />
                        <Input
                            label="RAM *"
                            name="ram"
                            placeholder="e.g. 16 GB"
                            error={errors.ram}
                            {...register("ram", {
                                required: "RAM is required.",
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Storage *"
                            name="storage"
                            placeholder="e.g. 512 GB SSD"
                            error={errors.storage}
                            {...register("storage", {
                                required: "Storage is required.",
                            })}
                        />
                        <Input
                            label="Operating system *"
                            name="os"
                            placeholder="e.g. Windows 11 Pro"
                            error={errors.os}
                            {...register("os", {
                                required: "Operating system is required.",
                            })}
                        />
                    </div>
                </div>

                {/* Assignment */}
                <div className="space-y-4">
                    <SectionHeading>Assignment</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Select a status." }}
                            render={({ field }) => (
                                <Select
                                    label="Status"
                                    name="status"
                                    options={toOptions(SYSTEM_STATUSES)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.status}
                                />
                            )}
                        />
                        <Controller
                            name="location"
                            control={control}
                            rules={{ required: "Select a location." }}
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
                        <Input
                            label="Station"
                            name="station"
                            placeholder="e.g. Station 04"
                            error={errors.station}
                            {...register("station")}
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
                        Save System Unit
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
