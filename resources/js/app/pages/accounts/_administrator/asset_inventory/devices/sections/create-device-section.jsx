import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import {
    AVAILABILITY,
    DEVICE_STATUSES,
    DEVICE_TYPES,
    toOptions,
} from "./device-helpers";

const CONDITIONS = ["Brandnew", "Second Hand"];
const NATURES = ["Dedicated", "Shared"];

const DEFAULT_VALUES = {
    assetTag: "",
    serialNumber: "",
    deviceType: "Laptop",
    brand: "",
    model: "",
    status: "New",
    availability: "Available",
    condition: "Brandnew",
    nature: "Dedicated",
    price: "",
    purchaseDate: "",
    account: "",
    issuedTo: "",
    receivedBy: "",
    location: "",
    site: "",
};

// Maps API field names (snake_case) to form field names (camelCase).
const API_TO_FORM = {
    asset_tag: "assetTag",
    serial_number: "serialNumber",
    device_type: "deviceType",
    purchase_date: "purchaseDate",
    issued_to: "issuedTo",
    received_by: "receivedBy",
};

export default function CreateDeviceSection({
    isOpen,
    onClose,
    onSubmit,
    submitting = false,
    apiErrors = {},
}) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: DEFAULT_VALUES });

    // Always start from a clean form when the modal opens.
    useEffect(() => {
        if (isOpen) reset(DEFAULT_VALUES);
    }, [isOpen, reset]);

    // Map Laravel 422 errors onto the matching inputs.
    useEffect(() => {
        Object.entries(apiErrors).forEach(([field, messages]) => {
            const formField = API_TO_FORM[field] ?? field;
            const message = Array.isArray(messages) ? messages[0] : String(messages);
            setError(formField, { type: "server", message });
        });
    }, [apiErrors, setError]);

    const handleClose = () => {
        reset(DEFAULT_VALUES);
        onClose?.();
    };

    const submit = async (values) => {
        await onSubmit?.({
            asset_tag: values.assetTag.trim(),
            serial_number: values.serialNumber.trim() || null,
            device_type: values.deviceType,
            brand: values.brand.trim(),
            model: values.model.trim() || null,
            status: values.status,
            availability: values.availability,
            condition: values.condition || null,
            nature: values.nature || null,
            price: values.price === "" ? null : Number(values.price),
            purchase_date: values.purchaseDate || null,
            account: values.account.trim() || null,
            issued_to: values.issuedTo.trim() || null,
            received_by: values.receivedBy.trim() || null,
            location: values.location.trim() || null,
            site: values.site.trim() || null,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-xl"
            title={
                <div>
                    <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                        Add Device
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Register a new device in the inventory.
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
                    <Input
                        label="Asset tag"
                        name="assetTag"
                        error={errors.assetTag}
                        {...register("assetTag", {
                            required: "Asset tag is required.",
                        })}
                    />
                    <Input
                        label="Serial number"
                        name="serialNumber"
                        error={errors.serialNumber}
                        {...register("serialNumber")}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="deviceType"
                        control={control}
                        rules={{ required: "Select a device type." }}
                        render={({ field }) => (
                            <Select
                                label="Device type"
                                name="deviceType"
                                options={toOptions(DEVICE_TYPES)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.deviceType}
                            />
                        )}
                    />
                    <Input
                        label="Brand"
                        name="brand"
                        error={errors.brand}
                        {...register("brand", {
                            required: "Brand is required.",
                        })}
                    />
                </div>

                <Input
                    label="Model"
                    name="model"
                    error={errors.model}
                    {...register("model")}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Select a status." }}
                        render={({ field }) => (
                            <Select
                                label="Status"
                                name="status"
                                options={toOptions(DEVICE_STATUSES)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.status}
                            />
                        )}
                    />
                    <Controller
                        name="availability"
                        control={control}
                        rules={{ required: "Select availability." }}
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
                    <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Condition"
                                name="condition"
                                options={toOptions(CONDITIONS)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.condition}
                            />
                        )}
                    />
                    <Controller
                        name="nature"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Nature"
                                name="nature"
                                options={toOptions(NATURES)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.nature}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="Price (₱) — optional"
                        name="price"
                        type="number"
                        min="0"
                        error={errors.price}
                        {...register("price", {
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="Account"
                        name="account"
                        error={errors.account}
                        {...register("account")}
                    />
                    <Input
                        label="Issued to"
                        name="issuedTo"
                        error={errors.issuedTo}
                        {...register("issuedTo")}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="Received by"
                        name="receivedBy"
                        error={errors.receivedBy}
                        {...register("receivedBy")}
                    />
                    <Input
                        label="Location"
                        name="location"
                        error={errors.location}
                        {...register("location")}
                    />
                </div>

                <Input
                    label="Site"
                    name="site"
                    error={errors.site}
                    {...register("site")}
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
                        variant="success"
                        disabled={isSubmitting || submitting}
                        loading={isSubmitting || submitting}
                        className="w-full sm:w-auto"
                    >
                        <FiSave className="mr-2 h-4 w-4" />
                        Save Device
                    </Button>
                </div>
            </form>
        </Modal>
    );
}