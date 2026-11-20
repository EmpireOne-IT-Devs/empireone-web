import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Plus, Search, Trash2 } from "lucide-react";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { record_paper_liability_thunk, search_paper_employees_thunk } from "@/app/redux/asset-liability-form-thunk";
import { ACCOUNTABILITY_ASSET_TYPES } from "@/app/pages/acknowledgment/liability_form/sections/accountability-template";

const EMPTY_ITEM = { assetType: "", brandModel: "" };
const CATEGORY_OPTIONS = ACCOUNTABILITY_ASSET_TYPES.map((value) => ({ value, label: value }));
const ITEM_FIELDS = [
    ["brandModel", "Brand / Model", 150], ["assetTag", "Asset tag (optional)", 100],
    ["serialNumber", "Serial number", 150], ["conditionAtIssuance", "Condition at issuance", 100],
    ["purchaseValue", "Purchase value (PHP)"], ["remarks", "Remarks", 500],
];

export default function RecordPaperFormSection({ onClose, onRecorded }) {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState([]);
    const [searched, setSearched] = useState(false);
    const [lookupError, setLookupError] = useState("");
    const [lookingUp, setLookingUp] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const lookup = useRef(null);
    const { control, register, handleSubmit, setError, clearErrors, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { employeeProfileId: "", items: [EMPTY_ITEM] },
    });
    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    useEffect(() => () => lookup.current?.abort(), []);

    const searchEmployees = async () => {
        const query = search.trim();
        if (query.length < 2 || lookingUp) return;
        const request = dispatch(search_paper_employees_thunk(query));
        lookup.current = request;
        setOptions([]);
        setSearched(false);
        setValue("employeeProfileId", "");
        setLookupError("");
        setLookingUp(true);
        try {
            const result = await request.unwrap();
            if (lookup.current === request) {
                setOptions(result.data.map((employee) => ({
                    value: employee.id, label: `${employee.name} (${employee.employeeNumber})`,
                })));
                setSearched(true);
            }
        } catch (error) {
            if (lookup.current === request) setLookupError(error.message);
        } finally {
            if (lookup.current === request) {
                lookup.current = null;
                setLookingUp(false);
            }
        }
    };

    const submit = async (values) => {
        setSubmitError("");
        clearErrors();
        try {
            const response = await dispatch(record_paper_liability_thunk(values)).unwrap();
            onRecorded(response.data);
        } catch (error) {
            for (const [field, messages] of Object.entries(error.errors ?? {})) {
                setError(field, { type: "server", message: messages[0] });
            }
            setSubmitError(error.message);
        }
    };

    return (
        <Modal isOpen trapFocus title="Record Paper Form" width="max-w-3xl" onClose={() => !isSubmitting && onClose()}>
            <form className="space-y-5 p-2" onSubmit={handleSubmit(submit)} noValidate>
                <p className="text-sm text-gray-600">
                    Enter the details from an already-signed form. No email will be sent and inventory will not change.
                </p>
                <fieldset disabled={isSubmitting} className="space-y-5">
                    <div className="space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input label="Search by name or employee number" name="paper_employee_search" value={search}
                                maxLength={150} disabled={lookingUp} onChange={(event) => {
                                    setSearch(event.target.value);
                                    setOptions([]);
                                    setSearched(false);
                                    setValue("employeeProfileId", "");
                                    setLookupError("");
                                }} onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        searchEmployees();
                                    }
                                }} />
                            <Button type="button" variant="secondary" outlined loading={lookingUp}
                                disabled={lookingUp || search.trim().length < 2} onClick={searchEmployees}>
                                <Search size={16} aria-hidden="true" /> Search
                            </Button>
                        </div>
                        {lookupError && <p role="alert" className="text-sm text-red-700">{lookupError}</p>}
                        <Controller name="employeeProfileId" control={control} rules={{ required: "Search and select an employee." }}
                            render={({ field }) => (
                                <Select label="Employee (required)" name={field.name} options={options} value={field.value}
                                    onChange={field.onChange} disabled={!options.length || lookingUp}
                                    error={errors.employeeProfileId} />
                            )} />
                        {!options.length && !lookingUp && !lookupError && (
                            <p role="status" className="text-xs text-gray-600">
                                {searched ? "No employees found. Try a different name or employee number."
                                    : "Search by at least two characters to find a current or former employee."}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <Input label="Original signed date" type="date" error={errors.signedDate}
                            {...register("signedDate", { required: "Enter the date on the signed form." })} />
                        <Input label="Date of issue (optional)" type="date" error={errors.issueDate} {...register("issueDate")} />
                        <Input label="Hire date (optional)" type="date" error={errors.hireDate} {...register("hireDate")} />
                        <Input label="Account / Program" maxLength={150} error={errors.accountProgram} {...register("accountProgram")} />
                        <Input label="Location" maxLength={150} error={errors.location} {...register("location")} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Items on the paper form</h3>
                        {fields.map((field, index) => (
                            <fieldset key={field.id} className="space-y-3 rounded-lg border border-gray-200 p-3">
                                <legend className="px-1 text-sm font-medium">Item {index + 1}</legend>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    <Controller name={`items.${index}.assetType`} control={control} rules={{ required: "Select an asset type." }}
                                        render={({ field }) => <Select label="Asset type" name={field.name} options={CATEGORY_OPTIONS}
                                            value={field.value} onChange={field.onChange} error={errors.items?.[index]?.assetType} />} />
                                    {ITEM_FIELDS.map(([key, label, maxLength]) => (
                                        <Input key={key} label={label} maxLength={maxLength} error={errors.items?.[index]?.[key]}
                                            inputMode={key === "purchaseValue" ? "decimal" : undefined}
                                            {...register(`items.${index}.${key}`, key === "brandModel" ? { required: "Enter the brand, model, or item description." } : {})} />
                                    ))}
                                </div>
                                {fields.length > 1 && <Button type="button" variant="danger" outlined size="sm" onClick={() => remove(index)}>
                                    <Trash2 size={16} aria-hidden="true" /> Remove item {index + 1}
                                </Button>}
                            </fieldset>
                        ))}
                        {errors.items?.message && <p role="alert" className="text-sm text-red-700">{errors.items.message}</p>}
                        <Button type="button" variant="secondary" outlined size="sm" disabled={fields.length >= 20} onClick={() => append(EMPTY_ITEM)}>
                            <Plus size={16} aria-hidden="true" /> Add item
                        </Button>
                    </div>
                    <Input label="Signed paper scan (optional)" type="file" accept=".pdf,.jpg,.jpeg,.png" error={errors.scan}
                        {...register("scan", { validate: (files) => !files?.[0] || files[0].size <= 10 * 1024 * 1024 || "Choose a file up to 10 MB." })} />
                    <p className="text-xs text-gray-600">PDF, JPG, or PNG, up to 10 MB. Only admins can download the original.</p>
                </fieldset>
                {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
                <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4">
                    <Button type="button" variant="secondary" outlined onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting || lookingUp}>Record signed form</Button>
                </div>
            </form>
        </Modal>
    );
}
