import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { search_asset_purchase_approvers_thunk } from "@/app/redux/asset-purchase-request-thunk";
import { FiSend } from "react-icons/fi";
import { Plus, X } from "lucide-react";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import TextArea from "@/app/_components/textarea";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import {
    CATEGORIES,
    DEPARTMENTS,
    MAX_ITEMS,
    PRIORITIES,
    formatItemCents,
    itemCostInCents,
    toOptions,
} from "./purchase-request-helpers";

const EMPTY_ITEM = { description: "", quantity: "1", unitCost: "" };
const DEFAULT_VALUES = {
    items: [EMPTY_ITEM],
    department: "IT Department",
    justification: "",
    category: "Computer Hardware",
    priority: "Normal",
    supplierName: "",
    approverIds: ["", "", ""],
};

export default function CreatePurchaseReqSection({
    isOpen,
    onClose,
    onSubmit,
    requesterName = "",
    submitting = false,
}) {
    const dispatch = useDispatch();
    const approvers = useSelector((state) => state.asset_purchase_requests.approvers);
    useEffect(() => {
        if (isOpen) dispatch(search_asset_purchase_approvers_thunk(""));
    }, [dispatch, isOpen]);
    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: DEFAULT_VALUES });
    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const items = useWatch({ control, name: "items" }) ?? [];
    const lineTotals = items.map(itemCostInCents);
    const grandTotal = lineTotals.reduce((total, cost) => total + (cost ?? 0n), 0n);
    const busy = isSubmitting || submitting;
    const quotationInput = useRef(null);
    const [hasQuotation, setHasQuotation] = useState(false);

    const clearQuotation = () => {
        if (quotationInput.current) quotationInput.current.value = "";
        setHasQuotation(false);
    };

    // Always start from a clean form when the modal opens.
    useEffect(() => {
        if (isOpen) {
            reset(DEFAULT_VALUES);
            clearQuotation();
        }
    }, [isOpen, reset]);

    const handleClose = () => {
        reset(DEFAULT_VALUES);
        clearQuotation();
        onClose?.();
    };

    const submit = async (values) => {
        clearErrors();
        try {
            await onSubmit({
                ...values,
                items: values.items.map((item) => ({ ...item, description: item.description.trim() })),
                justification: values.justification.trim(),
                supplierName: values.supplierName.trim(),
                approverIds: values.approverIds.map(Number),
                supplierQuotation: quotationInput.current?.files[0],
            });
            handleClose();
        } catch (error) {
            for (const [field, messages] of Object.entries(error?.errors ?? {})) {
                setError(field, { message: messages[0] });
            }
            setError("root", { message: error?.message ?? "Could not save your request." });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={isSubmitting || submitting ? () => {} : handleClose}
            width="sm:max-w-4xl"
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
                <section aria-labelledby="purchase-request-items" className="space-y-3">
                    <h3 id="purchase-request-items" className="text-sm font-semibold text-gray-900">Items</h3>
                    {fields.map((field, index) => {
                        const name = `items.${index}`;
                        const rowErrors = errors.items?.[index];
                        return (
                            <fieldset key={field.id} disabled={busy} className="min-w-0 border-b border-gray-200 pb-3">
                                <legend className="mb-3 text-xs font-medium text-gray-600">Item {index + 1}</legend>
                                {rowErrors?.message && <p role="alert" className="mb-2 text-xs text-red-600">{rowErrors.message}</p>}
                                <div className="grid items-start gap-3 sm:grid-cols-2 md:grid-cols-[minmax(8rem,2fr)_minmax(5rem,0.8fr)_minmax(6rem,1fr)_minmax(6rem,1fr)_auto]">
                                    <Input
                                        label="Item Name"
                                        maxLength={150}
                                        error={rowErrors?.description}
                                        {...register(`${name}.description`, {
                                            validate: (value) => value.trim().length >= 2 || "Enter an item name with at least 2 characters.",
                                        })}
                                    />
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        min="1"
                                        max="1000000"
                                        error={rowErrors?.quantity}
                                        {...register(`${name}.quantity`, {
                                            validate: (value) => (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 1000000) || "Enter a whole number from 1 to 1,000,000.",
                                        })}
                                    />
                                    <Input
                                        label="Unit Cost (₱)"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        error={rowErrors?.unitCost}
                                        {...register(`${name}.unitCost`, {
                                            validate: (value) => itemCostInCents({ quantity: "1", unitCost: value }) !== null || "Enter a valid cost with up to 2 decimal places.",
                                        })}
                                    />
                                    <div className="min-w-0 text-sm">
                                        <div className="text-xs text-gray-600">Total Cost (₱)</div>
                                        <output className="block break-words font-semibold text-gray-900">
                                            {lineTotals[index] == null ? "—" : formatItemCents(lineTotals[index])}
                                        </output>
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        outlined
                                        ariaLabel={`Remove item ${index + 1}`}
                                        disabled={fields.length === 1}
                                        onClick={() => remove(index)}
                                        className="min-h-11 w-11"
                                    >
                                        <X size={16} aria-hidden="true" />
                                    </Button>
                                </div>
                            </fieldset>
                        );
                    })}
                    {(errors.items?.message || errors.items?.root?.message) && (
                        <p role="alert" className="text-xs text-red-600">{errors.items.message ?? errors.items.root.message}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button variant="success" size="sm" disabled={busy || fields.length >= MAX_ITEMS} onClick={() => append({ ...EMPTY_ITEM })}>
                            <Plus size={16} className="mr-1" aria-hidden="true" /> Add Item
                        </Button>
                        <p className="text-sm font-semibold text-gray-900">Grand Total: {formatItemCents(grandTotal)}</p>
                    </div>
                    {fields.length >= MAX_ITEMS && <p className="text-xs text-gray-600">Maximum of {MAX_ITEMS} items per request.</p>}
                </section>

                <TextArea
                    label="Reason for request"
                    rows={3}
                    required
                    maxLength={1000}
                    error={errors.justification?.message}
                    {...register("justification", {
                        validate: (value) => Boolean(value.trim()) || "Explain why you need this item.",
                        maxLength: { value: 1000, message: "Use 1,000 characters or fewer." },
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
                        value={requesterName}
                        readOnly
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

                <Input
                    label="Supplier name"
                    name="supplierName"
                    error={errors.supplierName}
                    {...register("supplierName")}
                />

                <fieldset disabled={busy} className="space-y-3">
                    <legend className="text-sm font-semibold text-gray-900">Approval sequence</legend>
                    <p className="text-xs text-gray-500">The selected approvers must act in this exact order.</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[0, 1, 2].map((index) => (
                            <Controller
                                key={index}
                                name={`approverIds.${index}`}
                                control={control}
                                rules={{ required: "Select an approver." }}
                                render={({ field }) => (
                                    <Select
                                        label={`Approver ${index + 1}`}
                                        name={`approverIds.${index}`}
                                        required
                                        options={approvers.map((option) => ({ value: String(option.id), label: option.label }))}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onSelect={(option) => field.onChange(option.value)}
                                        error={errors.approverIds?.[index]}
                                    />
                                )}
                            />
                        ))}
                    </div>
                </fieldset>

                <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                            <Input
                                ref={quotationInput}
                                label="Supplier quotation (optional)"
                                name="supplierQuotation"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                error={errors.supplierQuotation}
                                aria-describedby="supplier-quotation-help"
                                disabled={isSubmitting || submitting}
                                onChange={(event) => setHasQuotation(event.target.files.length > 0)}
                                className="file:mr-2 file:rounded file:border-0 file:bg-purple-50 file:px-2 file:py-1 file:text-sm file:font-medium file:text-purple-700"
                            />
                        </div>
                        {hasQuotation && (
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                outlined
                                ariaLabel="Remove supplier quotation"
                                disabled={isSubmitting || submitting}
                                onClick={() => {
                                    clearQuotation();
                                    quotationInput.current?.focus();
                                }}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                    <p id="supplier-quotation-help" className="text-xs text-gray-500">
                        PDF, JPG, or PNG, up to 10 MB.
                    </p>
                </div>

                {errors.root && <p role="alert" className="text-sm text-red-600">{errors.root.message}</p>}
                <div className="mt-2 flex flex-col justify-end gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                    <Button
                        type="button"
                        variant="secondary"
                        outlined
                        disabled={isSubmitting || submitting}
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