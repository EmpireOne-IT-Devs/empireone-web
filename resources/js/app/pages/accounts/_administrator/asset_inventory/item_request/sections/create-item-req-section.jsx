import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FiAlertCircle, FiLoader, FiSearch, FiSend } from "react-icons/fi";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import Button from "@/app/_components/button";
import { search_asset_item_request_lookups_thunk } from "@/app/redux/asset-item-request-thunk";
import { ASSET_TYPES, PRIORITIES, REQUEST_TYPES, toOptions } from "./item-request-helpers";

const DEFAULT_VALUES = {
    assetType: "",
    assetUuid: "",
    assigneeId: "",
    requestType: "New Assignment",
    priority: "Normal",
    fromDate: "",
    untilDate: "",
    justification: "",
    purpose: "",
    approverIds: ["", "", ""],
};

function useLookupSearch(isOpen, query, key, dispatch) {
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        if (!isOpen) return undefined;
        const search = query.trim();
        let task;
        const timer = window.setTimeout(() => {
            task = dispatch(search_asset_item_request_lookups_thunk({ [key]: search }));
        }, search ? 250 : 0);
        return () => {
            window.clearTimeout(timer);
            task?.abort();
        };
    }, [dispatch, isOpen, key, query, retry]);
    return () => setRetry((value) => value + 1);
}

function LookupField({ name, label, query, setQuery, selected, onSelect, options, loading, error, fieldError, onRetry }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        window.addEventListener("mousedown", closeOnOutsideClick, true);
        return () => window.removeEventListener("mousedown", closeOnOutsideClick, true);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <Input
                label={label}
                name={name}
                type="search"
                value={selected ? selected.label : query}
                iconLeft={<FiSearch size={16} />}
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls={isOpen && !selected && !loading && !error && options.length ? `${name}-options` : undefined}
                aria-invalid={Boolean(fieldError)}
                onFocus={() => setIsOpen(true)}
                onKeyDown={(event) => {
                    if (event.key === "Escape" && isOpen) {
                        event.stopPropagation();
                        setIsOpen(false);
                    }
                    if (event.key === "ArrowDown" && isOpen) {
                        event.preventDefault();
                        containerRef.current?.querySelector('[role="option"]')?.focus();
                    }
                }}
                onBlur={() => {
                    window.setTimeout(() => {
                        if (!containerRef.current?.contains(document.activeElement)) setIsOpen(false);
                    }, 0);
                }}
                onChange={(event) => {
                    if (selected) onSelect(null);
                    setQuery(event.target.value);
                    setIsOpen(true);
                }}
                error={fieldError}
            />
            {isOpen && !selected && (
                <div className="mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {loading ? (
                        <p className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500" role="status">
                            <FiLoader className="animate-spin" aria-hidden="true" />
                            Searching…
                        </p>
                    ) : error ? (
                        <div className="p-3 text-sm" role="alert">
                            <p className="text-red-700">{error.message}</p>
                            <Button type="button" variant="light" size="sm" className="mt-2" onClick={onRetry}>
                                Retry search
                            </Button>
                        </div>
                    ) : options.length > 0 ? (
                        <ul id={`${name}-options`} role="listbox" className="max-h-56 overflow-y-auto py-1">
                            {options.map((option) => (
                                <li key={option.uuid ?? option.id} role="presentation">
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={false}
                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-800 transition-colors hover:bg-purple-50 focus:bg-purple-50 focus:outline-none"
                                        onMouseDown={(event) => event.preventDefault()}
                                        onKeyDown={(event) => {
                                            if (event.key === "Escape") {
                                                event.stopPropagation();
                                                containerRef.current?.querySelector("input")?.focus();
                                                setIsOpen(false);
                                            }
                                        }}
                                        onClick={() => {
                                            onSelect(option);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-4 py-3 text-sm text-gray-500">
                            {query ? "No matching options found." : "Start typing to search."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

const messageFor = (value) => Array.isArray(value) ? value[0] : value;

export default function CreateItemReqSection({ isOpen, onClose, onSubmit, submitting = false }) {
    const dispatch = useDispatch();
    const lookups = useSelector((state) => state.asset_item_requests.lookups);
    const [assetQuery, setAssetQuery] = useState("");
    const [employeeQuery, setEmployeeQuery] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formError, setFormError] = useState("");
    const {
        register,
        handleSubmit,
        control,
        reset,
        getValues,
        watch,
        setError,
        clearErrors,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: DEFAULT_VALUES });

    const retryAssetSearch = useLookupSearch(isOpen, assetQuery, "assetSearch", dispatch);
    const retryEmployeeSearch = useLookupSearch(isOpen, employeeQuery, "employeeSearch", dispatch);

    useEffect(() => {
        if (isOpen) {
            dispatch(search_asset_item_request_lookups_thunk({ approverSearch: "" }));
            reset(DEFAULT_VALUES);
            setSelectedAsset(null);
            setSelectedEmployee(null);
            setAssetQuery("");
            setEmployeeQuery("");
            setFormError("");
        }
    }, [isOpen, reset]);

    const handleClose = () => {
        if (isSubmitting || submitting) return;
        reset(DEFAULT_VALUES);
        setSelectedAsset(null);
        setSelectedEmployee(null);
        setFormError("");
        onClose?.();
    };

    const submit = async (values) => {
        setFormError("");
        clearErrors();
        const payload = {
            assetType: values.assetType,
            assetUuid: values.assetUuid,
            assigneeId: Number(values.assigneeId),
            requestType: values.requestType,
            priority: values.priority,
            fromDate: values.fromDate || null,
            untilDate: values.untilDate || null,
            justification: values.justification.trim(),
            purpose: values.purpose.trim() || null,
            approverIds: values.approverIds.map(Number),
        };

        try {
            await onSubmit?.(payload);
            handleClose();
        } catch (failure) {
                const serverErrors = failure?.errors ?? {};
                Object.keys(DEFAULT_VALUES).forEach((field) => {
                    if (serverErrors[field]) setError(field, { type: "server", message: messageFor(serverErrors[field]) });
            });
            setFormError(failure?.message || "Unable to submit your request. Please try again.");
        }
    };

    const today = moment().format("YYYY-MM-DD");
    const fromDate = watch("fromDate");
    const busy = isSubmitting || submitting;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-xl"
            title="Create Item Request"
        >
            <form onSubmit={handleSubmit(submit)} className="mt-4 flex flex-col gap-4 p-2" noValidate>
                <p className="text-sm text-gray-500">Choose an inventory item and the employee who will receive it.</p>
                {formError && (
                    <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                        <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span>{formError}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                        name="assetUuid"
                        control={control}
                        rules={{ required: "Select an inventory item." }}
                        render={({ field }) => (
                            <LookupField
                                name="assetUuid"
                                label="Inventory item"
                                query={assetQuery}
                                setQuery={(value) => {
                                    setAssetQuery(value);
                                    if (errors.assetUuid) clearErrors("assetUuid");
                                    if (errors.assetType) clearErrors("assetType");
                                }}
                                selected={selectedAsset}
                                options={lookups.assets}
                                loading={lookups.assetLoading || lookups.assetSearch !== assetQuery.trim()}
                                error={lookups.assetSearch === assetQuery.trim() ? lookups.assetError : null}
                                onRetry={retryAssetSearch}
                                fieldError={errors.assetUuid}
                                onSelect={(option) => {
                                    setSelectedAsset(option);
                                    field.onChange(option?.uuid ?? "");
                                    setValue("assetType", option?.type ?? "", { shouldValidate: true });
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="assigneeId"
                        control={control}
                        rules={{ required: "Select an employee." }}
                        render={({ field }) => (
                            <LookupField
                                name="assigneeId"
                                label="Assign to"
                                query={employeeQuery}
                                setQuery={(value) => {
                                    setEmployeeQuery(value);
                                    if (errors.assigneeId) clearErrors("assigneeId");
                                }}
                                selected={selectedEmployee}
                                options={lookups.employees}
                                loading={lookups.employeeLoading || lookups.employeeSearch !== employeeQuery.trim()}
                                error={lookups.employeeSearch === employeeQuery.trim() ? lookups.employeeError : null}
                                onRetry={retryEmployeeSearch}
                                fieldError={errors.assigneeId}
                                onSelect={(option) => {
                                    setSelectedEmployee(option);
                                    field.onChange(option?.id ?? "");
                                }}
                            />
                        )}
                    />
                </div>
                {errors.assetType && <p className="-mt-3 text-sm text-red-600">{errors.assetType.message}</p>}
                <input
                    type="hidden"
                    {...register("assetType", {
                        validate: (value) =>
                            !getValues("assetUuid") ||
                            ASSET_TYPES.includes(value) ||
                            "Select an item with a supported asset type.",
                    })}
                />

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
                                !value || moment(value).isSameOrAfter(today, "day") || "From date cannot be in the past.",
                        })}
                    />
                    <Input
                        label="Until Date (Optional)"
                        name="untilDate"
                        type="date"
                        min={fromDate || today}
                        error={errors.untilDate}
                        {...register("untilDate", {
                            validate: (value) => {
                                if (!value) return true;
                                const from = getValues("fromDate");
                                if (!from) return "Enter a from date before choosing an until date.";
                                if (moment(value).isBefore(from, "day")) return "Until date cannot be before the from date.";
                                return moment(value).isSameOrAfter(today, "day") || "Until date cannot be in the past.";
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
                        required: "Please explain why this item is needed.",
                        minLength: { value: 10, message: "Add a little more detail (10+ characters)." },
                    })}
                />
                <TextArea label="Purpose (Optional)" name="purpose" rows={3} error={errors.purpose?.message} {...register("purpose")} />

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
                                    <LookupField
                                        name={`approverIds.${index}`}
                                        label={`Approver ${index + 1}`}
                                        query=""
                                        setQuery={() => {}}
                                        selected={lookups.approvers?.find((option) => String(option.id) === String(field.value)) ? {
                                            label: lookups.approvers.find((option) => String(option.id) === String(field.value)).label,
                                        } : null}
                                        options={(lookups.approvers ?? []).map((option) => ({ id: option.id, uuid: String(option.id), label: option.label }))}
                                        loading={false}
                                        error={null}
                                        onRetry={() => dispatch(search_asset_item_request_lookups_thunk({ approverSearch: "" }))}
                                        fieldError={errors.approverIds?.[index]}
                                        onSelect={(option) => field.onChange(option?.id ?? "")}
                                    />
                                )}
                            />
                        ))}
                    </div>
                </fieldset>

                <div className="mt-2 flex flex-col justify-end gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                    <Button type="button" variant="secondary" outlined onClick={handleClose} disabled={busy} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button type="submit" variant="secondary" disabled={busy} loading={busy} className="w-full sm:w-auto">
                        <FiSend className="mr-2 h-4 w-4" />
                        Submit Request
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
