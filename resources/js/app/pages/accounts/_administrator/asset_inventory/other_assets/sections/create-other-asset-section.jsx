import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave, FiArchive } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import Button from "@/app/_components/button";
import {
    ASSET_CATEGORIES,
    ASSET_STATUSES,
    LOCATIONS,
    toOptions,
} from "./other-asset-helpers";

const DEFAULT_VALUES = {
    name: "",
    category: "Furniture",
    purchasePrice: "",
    purchaseDate: "",
    location: "Main office",
    assignedTo: "",
    status: "Available",
    details: "",
};

function SectionHeading({ children }) {
    return <h3 className="text-sm font-semibold text-gray-900">{children}</h3>;
}

export default function CreateOtherAssetSection({
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
            assignedTo: values.assignedTo.trim() || "Available",
            details: values.details.trim(),
            purchasePrice: values.purchasePrice === "" ? null : Number(values.purchasePrice),
            purchaseDate: values.purchaseDate || null,
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
                        <FiArchive className="h-4 w-4 text-purple-600" />
                        Add Other Asset
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Register a facility, furniture, or miscellaneous asset.
                    </p>
                </div>
            }
        >
            <form
                onSubmit={handleSubmit(submit)}
                className="mt-4 flex flex-col gap-5 p-2"
                noValidate
            >
                {/* Asset information */}
                <div className="space-y-4">
                    <SectionHeading>Asset information</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Asset name *"
                            name="name"
                            placeholder="e.g. Conference table"
                            error={errors.name}
                            {...register("name", {
                                required: "Asset name is required.",
                                minLength: { value: 2, message: "Asset name is too short." },
                            })}
                        />
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: "Select a category." }}
                            render={({ field }) => (
                                <Select
                                    label="Category *"
                                    name="category"
                                    options={toOptions(ASSET_CATEGORIES)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.category}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Purchase price"
                            name="purchasePrice"
                            type="number"
                            min="0"
                            placeholder="e.g. ₱12,500"
                            error={errors.purchasePrice}
                            {...register("purchasePrice", {
                                min: { value: 0, message: "Price cannot be negative." },
                            })}
                        />
                        <Input
                            label="Purchase date"
                            name="purchaseDate"
                            type="date"
                            error={errors.purchaseDate}
                            {...register("purchaseDate")}
                        />
                    </div>
                </div>

                {/* Location and assignment */}
                <div className="space-y-4">
                    <SectionHeading>Location and assignment</SectionHeading>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        <Input
                            label="Assigned to"
                            name="assignedTo"
                            placeholder="Person, team, or room"
                            error={errors.assignedTo}
                            {...register("assignedTo")}
                        />
                    </div>

                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Status"
                                name="status"
                                options={toOptions(ASSET_STATUSES)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.status}
                            />
                        )}
                    />
                </div>

                {/* Details */}
                <TextArea
                    label="Details"
                    name="details"
                    rows={3}
                    error={errors.details?.message}
                    {...register("details")}
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
                        Save Asset
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
