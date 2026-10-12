import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Pencil, Store, UploadCloud, X } from "lucide-react";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { update_engagement_e_store_item_thunk } from "@/app/redux/engagement-thunk";

const REWARD_TYPE_OPTIONS = [
    { label: "Avatar Decoration", value: "Avatar Decoration" },
    { label: "Meal Voucher", value: "Meal Voucher" },
    { label: "Gift Card", value: "Gift Card" },
    { label: "Merchandise", value: "Merchandise" },
    { label: "Workplace Perk", value: "Workplace Perk" },
];

function getDefaultValues(reward) {
    return {
        product_image: null,
        product_name: reward?.product_name ?? "",
        customer_description: reward?.customer_description ?? "",
        reward_type: reward?.reward_type ?? "",
        point_cost: reward?.point_cost ?? "",
        quantity:
            reward?.quantity === null || reward?.quantity === undefined
                ? ""
                : reward.quantity,
    };
}

export default function EditRewardSection({ reward }) {
    const dispatch = useDispatch();
    const { eStoreItemUpdatingId } = useSelector((state) => state.engagement);
    const [isOpen, setIsOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const isUpdating = eStoreItemUpdatingId === reward?.id;

    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm({ defaultValues: getDefaultValues(reward) });

    const form = watch();

    useEffect(() => {
        register("product_image", {
            validate: (value) => {
                if (!value) return true;
                const allowed = ["image/png", "image/jpeg", "image/webp"];
                return (
                    allowed.includes(value.type) ||
                    "Only PNG, JPG, or WEBP is allowed."
                );
            },
        });
    }, [register]);

    useEffect(() => {
        if (isOpen) {
            reset(getDefaultValues(reward));
        }
    }, [isOpen, reset, reward]);

    const imageLabel = useMemo(
        () => form.product_image?.name || null,
        [form.product_image],
    );

    const displayImage = previewUrl || reward?.product_image || null;

    const closeModal = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setIsOpen(false);
        reset(getDefaultValues(reward));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0] ?? null;
        setValue("product_image", file, { shouldValidate: true });
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const clearSelectedImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValue("product_image", null, { shouldValidate: true });
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const onSubmit = async (data) => {
        const payload = new FormData();
        if (data.product_image) payload.append("product_image", data.product_image);
        payload.append("product_name", data.product_name);
        payload.append("customer_description", data.customer_description || "");
        payload.append("reward_type", data.reward_type);
        payload.append("point_cost", String(data.point_cost));
        if (data.quantity !== "" && data.quantity !== null && data.quantity !== undefined) {
            payload.append("quantity", String(data.quantity));
        } else {
            payload.append("quantity", "");
        }

        const result = await dispatch(
            update_engagement_e_store_item_thunk({ id: reward.id, data: payload }),
        );

        if (update_engagement_e_store_item_thunk.rejected.match(result)) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to update reward item",
                    message:
                        result.payload?.message ||
                        "Please check your inputs and try again.",
                    open: true,
                }),
            );
            return;
        }

        dispatch(
            setAlert({
                type: "success",
                title: "Reward updated",
                message: `${data.product_name} was updated successfully.`,
                open: true,
            }),
        );
        closeModal();
    };

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className="p-1 rounded-full bg-amber-50 text-amber-500 hover:bg-amber-100 transition-colors"
                aria-label="Edit reward"
            >
                <Pencil className="w-3.5 h-3.5" />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                width="max-w-2xl"
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Store size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                                E-Store
                            </p>
                            <h2 className="text-sm font-semibold text-neutral-800">
                                Edit reward item
                            </h2>
                        </div>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-5 pb-5 pt-4 space-y-5">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Product image
                            </p>
                            <label
                                htmlFor={`edit_product_image_${reward.id}`}
                                className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors
                                    ${displayImage
                                        ? "border-amber-200 bg-amber-50/30"
                                        : "border-gray-200 bg-gray-50 hover:border-amber-300 hover:bg-amber-50/20"
                                    }`}
                            >
                                {displayImage ? (
                                    <>
                                        <img
                                            src={displayImage}
                                            alt="Product preview"
                                            className="h-20 w-20 flex-shrink-0 rounded-lg object-cover shadow-sm"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-800">
                                                {imageLabel || reward?.product_name || "Current image"}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Click to replace image
                                            </p>
                                        </div>
                                        {previewUrl && (
                                            <button
                                                type="button"
                                                onClick={clearSelectedImage}
                                                className="flex-shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                aria-label="Remove selected image"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                                            <UploadCloud size={24} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors">
                                                Upload product image
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-400">
                                                PNG, JPG, or WEBP · Optional
                                            </p>
                                        </div>
                                    </>
                                )}
                            </label>
                            <input
                                id={`edit_product_image_${reward.id}`}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {errors.product_image?.message && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.product_image.message}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-gray-100" />

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input
                                    label="Product name"
                                    placeholder="e.g. Travel Backpack"
                                    error={errors.product_name?.message}
                                    {...register("product_name", {
                                        required: "Product name is required.",
                                    })}
                                />
                                <Controller
                                    name="reward_type"
                                    control={control}
                                    rules={{ required: "Reward type is required." }}
                                    render={({ field, fieldState }) => (
                                        <Select
                                            label="Reward type"
                                            name="reward_type"
                                            options={[
                                                { label: "Select reward type", value: "" },
                                                ...REWARD_TYPE_OPTIONS,
                                            ]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>

                            <Input
                                label="Description"
                                placeholder="e.g. Durable everyday carry bag with laptop compartment"
                                error={errors.customer_description?.message}
                                {...register("customer_description")}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Points cost"
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 1000"
                                    error={errors.point_cost?.message}
                                    {...register("point_cost", {
                                        required: "Points cost is required.",
                                        valueAsNumber: true,
                                        min: {
                                            value: 0,
                                            message: "Points cost cannot be negative.",
                                        },
                                    })}
                                />
                                <Input
                                    label="Quantity"
                                    type="number"
                                    min={0}
                                    placeholder="Blank = unlimited"
                                    error={errors.quantity?.message}
                                    {...register("quantity", {
                                        setValueAs: (value) =>
                                            value === "" ? "" : Number(value),
                                        validate: (value) =>
                                            value === "" ||
                                            value >= 0 ||
                                            "Quantity cannot be negative.",
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={closeModal}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="engagement"
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving…" : "Save changes"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
