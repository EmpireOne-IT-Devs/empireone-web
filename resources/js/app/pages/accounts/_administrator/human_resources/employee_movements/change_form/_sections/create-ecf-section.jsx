import Button from "@/app/_components/button";
import Checkbox from "@/app/_components/checkbox";
import Input from "@/app/_components/input";
import InputSearch from "@/app/_components/input-search";
import Modal from "@/app/_components/modal";
import Radio from "@/app/_components/radio";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import allowances from "@/app/lib/allowance";
import { peso_format } from "@/app/lib/peso-format";
import { setAlert } from "@/app/redux/app-slice";
import { get_employee_applicants_thunk, get_employee_change_form_thunk, search_employee_thunk } from "@/app/redux/employee-relation-thunk";
import { create_employee_change_form_service } from "@/app/services/employee-change-form-service";
import store from "@/app/store/store";
import moment from "moment";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ALLOWANCE_OPTIONS = allowances.map(res => res.label);

const defaultFormValues = {
    user_id: null,
    ecf_id: null,
    name: null,
    employee_id: null,
    hire_date: null,
    position_level: "Rank and File",
    position: null,
    department: null,
    account: null,
    reporting_to: null,
    reason_for_change: null,
    effective_date: null,
    info_position_level_from: null,
    info_position_level_to: null,
    info_department_from: null,
    info_department_id_to: null,
    info_department_id_from: null,
    info_account_from: null,
    info_account_id_to: null,
    info_account_id_from: null,
    info_status_from: null,
    info_position_from: null,
    info_position_to: null,
    info_reporting_from: null,
    info_reporting_id_from: null,
    info_reporting_id_to: null,
    info_basic_pay_from: null,
    info_basic_pay_to: null,
    allowances: [],
    prepaired_by_id: 50,
    info_reporting_to: "",
    ack_date: null,
    is_edit_status: false,
    is_edit_reporting_to: false,
    is_edit_basic_pay: false,
    is_edit_allowances: false,
    is_account_transfer: false,
    is_department_transfer: false,
    is_position_and_title: false,
    is_tiering: false,
};

const CreateECFSection = () => {
    const { data } = useSelector((store) => store.app);
    const { leaders, employee } = useSelector((store) => store.human_resources);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const dispatch = useDispatch();
    const searchTimeoutRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: defaultFormValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "allowances",
    });

    const watchedValues = watch();

    const employee_information = selected;
    const personal_information = selected?.personal_information;
    const leader_information = employee_information?.er_leader?.employee;
    const agent_account = employee_information?.account;

    const new_report = leaders?.find((res) => res.user_id == watchedValues.info_reporting_id_to);
    const selected_ecf = agent_account?.ecfs?.find((res) => res.id == watchedValues.ecf_id);

    // Centralized Form Updater: Runs whenever the active employee changes
    useEffect(() => {
        if (employee_information) {
            const reportingName = `${leader_information?.personal_information?.first_name || ""} ${leader_information?.personal_information?.last_name || ""}`.trim();
            const employeeName = `${personal_information?.first_name || ""} ${personal_information?.last_name || ""}`.trim();

            const fieldUpdates = {
                user_id: employee_information?.user_id,
                name: employeeName,
                employee_id: employee_information?.employee_id,
                hire_date: employee_information?.started_at,
                position_level: employee_information?.position_level ?? "N/A",
                info_position_level_from: employee_information?.position_level ?? "N/A",
                info_position_level_to: employee_information?.position_level ?? "N/A",
                info_department_from: employee_information?.department?.name,
                info_department_id_from: employee_information?.department?.id,
                info_department_id_to: employee_information?.department?.id,
                info_account_from: employee_information?.account?.name,
                info_account_id_from: employee_information?.account?.id,
                info_account_id_to: employee_information?.account_id,
                info_status_from: employee_information?.status,
                info_position_from: employee_information?.position,
                info_position_to: employee_information?.position,
                info_reporting_from: reportingName,
                info_reporting_id_from: leader_information?.id,
                info_reporting_id_to: employee_information?.user?.id,
                info_basic_pay_from: employee_information?.basic_pay,
                info_basic_pay_to: employee_information?.basic_pay,
                position: employee_information?.position,
                department: employee_information?.department?.name,
                account: employee_information?.account?.name ?? "",
                reporting_to: reportingName,
                regular: false,
                notes: ''
            };

            Object.entries(fieldUpdates).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [employee_information, personal_information, leader_information, setValue]);

    // Track the new reporting leader name
    useEffect(() => {
        if (new_report) {
            setValue(
                "info_reporting_to",
                `${new_report?.user?.personal_information?.first_name || ""} ${new_report?.user?.personal_information?.last_name || ""}`.trim()
            );
        }
    }, [new_report, setValue]);

    const onSubmit = async (form_data) => {
        try {
            await create_employee_change_form_service({
                ...form_data,
            });
            await store.dispatch(get_employee_change_form_thunk())
            dispatch(
                setAlert({
                    type: "success",
                    title: "Change Form Created Successfully!",
                    message: "The change Form has been created and is ready for review.",
                    open: true,
                })
            );
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    async function search_employee(value) {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(async () => {
            await store.dispatch(search_employee_thunk(value));
        }, 1500);
    }

    return (
        <>
            <Button variant="primary" onClick={() => setOpen(true)}>
                CREATE CHANGE FORM
            </Button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width="max-w-7xl"
                title="Employee Change Form"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-8 text-black font-sans">
                    {/* Header */}
                    <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
                        <div className="flex flex-col">
                            <div className="text-4xl font-extrabold text-blue-900 tracking-tight flex items-baseline">
                                <img src="/images/E1CXlogo2.png" className="w-52" alt="Logo" />
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-between gap-4">
                            <div className="flex-1">
                                <InputSearch
                                    label="Name Of Employee"
                                    name="name"
                                    className="w-full"
                                    options={employee?.data?.map((res) => ({
                                        ...res,
                                        label: res.name,
                                        value: res, // Passes the full employee object
                                    }))}
                                    value={watchedValues.name}
                                    onChange={(val) => {
                                        setValue("name", val);
                                        search_employee(val);
                                    }}
                                    onSelect={(val) => {
                                        setSelected(val);
                                        if (val) {
                                            setValue("name", val.name);
                                        }
                                    }}
                                    error={!watchedValues.name}
                                />
                            </div>
                            <h1 className="text-xl font-bold uppercase tracking-wide">
                                Employee Change Form
                            </h1>
                        </div>
                    </div>

                    {/* General Employee Information */}
                    <div className="mb-6">
                        <h2 className="font-bold text-sm mb-1">
                            General Employee Information:
                        </h2>
                        <div className="border-t-2 border-black mb-1"></div>
                        <table className="w-full border-collapse border border-black text-sm">
                            <tbody>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 w-1/4 uppercase align-top">
                                        Name:
                                    </td>
                                    <td colSpan="3" className="border border-black p-1 px-2 font-bold uppercase">
                                        <Input
                                            type="text"
                                            {...register("name", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-left text-black"
                                            error={errors.name}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Employee ID:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("employee_id", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.employee_id}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Hire Date:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("hire_date", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.hire_date}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Position Level:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("position_level", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.position_level}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Position Title:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("position", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.position}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Department:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("department", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.department}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Account:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("account")}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.account}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Reporting To:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("reporting_to", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.reporting_to}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Employment Status:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        {employee_information?.status}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Reason For Change */}
                    <div className="mb-6 flex items-start flex-col gap-3 w-full text-sm">
                        <div className="mt-1 flex items-center">
                            <span className="italic text-xs mr-2">
                                (Kindly make sure to attach the necessary documentation):
                            </span>
                        </div>
                        <div className="font-bold w-full">
                            <TextArea
                                label="Reason for Change"
                                type="text"
                                {...register("reason_for_change", {
                                    required: "Required!",
                                })}

                                className="bg-transparent w-full outline-none text-black"
                                error={errors?.reason_for_change?.message ?? ""}
                                onChange={(val) =>
                                    setValue("reason_for_change", val.target.value)
                                }
                            />
                        </div>
                        <div className="flex gap-3 items-start justify-center w-full">
                            {employee_information?.status === "Probationary" && (
                                <Checkbox
                                    label="Regular"
                                    disabled
                                    {...register("regular")}
                                    checked={watchedValues.regular}
                                    onChange={(val) => setValue("regular", val.target.checked)}
                                />
                            )}
                            <Checkbox
                                label="Account Transfer"
                                {...register("is_account_transfer")}
                                checked={watchedValues.is_account_transfer}
                                disabled
                                onChange={(val) => setValue("is_account_transfer", val.target.checked)}
                            />
                            <Checkbox
                                label="Department Transfer"
                                disabled
                                {...register("is_department_transfer")}
                                checked={watchedValues.is_department_transfer}
                                onChange={(val) => setValue("is_department_transfer", val.target.checked)}
                            />
                            <Checkbox
                                label="Position & Title"
                                disabled
                                {...register("is_position_and_title")}
                                checked={watchedValues.is_position_and_title}
                                onChange={(val) => setValue("is_position_and_title", val.target.checked)}
                            />
                            <Checkbox
                                label="Tiering"
                                {...register("is_tiering")}
                                checked={watchedValues.is_tiering}
                                disabled={!watchedValues.is_tiering}
                                onChange={(val) => setValue("is_tiering", val.target.checked)}
                            />
                        </div>

                        {watchedValues.is_tiering && (
                            <Select
                                label="Tiers"
                                name="ecf_id"
                                className="w-full"
                                options={agent_account?.ecfs?.map((res) => ({
                                    ...res,
                                    label: res.original,
                                    value: res.id,
                                }))}
                                value={watchedValues.ecf_id}
                                onChange={(val) => setValue("ecf_id", val, { shouldValidate: true })}
                                error={!watchedValues.ecf_id}
                            />
                        )}
                    </div>

                    {watchedValues.is_tiering && (
                        <table className="w-full border-collapse border border-black text-sm mb-6">
                            <tbody>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6">
                                        {selected_ecf?.name}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6">
                                        {selected_ecf?.original}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6">
                                        {selected_ecf?.role}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6">
                                        {selected_ecf?.responsibility}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6">
                                        {selected_ecf?.payout_details}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6">
                                        Total Allowances: {peso_format(selected_ecf?.amount)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}

                    {/* New Information Details */}
                    <div className="my-6">
                        <h2 className="font-bold uppercase text-sm mb-1">
                            New Information Details:
                        </h2>
                        <table className="w-full border-collapse border border-black text-sm mb-2">
                            <tbody>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 w-[15%] uppercase">
                                        Effective Date:
                                    </td>
                                    <td className="border border-black p-1 px-2 font-bold w-[85%]">
                                        <Input
                                            type="date"
                                            {...register("effective_date", { required: true })}
                                            className="bg-transparent w-full outline-none font-bold text-black"
                                            error={errors.effective_date}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Information Details Table */}
                        <table className="w-full border-collapse border border-black text-sm text-center mb-6">
                            <thead>
                                <tr>
                                    <th colSpan="4" className="border border-black p-1 font-bold uppercase bg-gray-100">
                                        Information Details
                                    </th>
                                </tr>
                                <tr>
                                    <th className="border border-black p-1 w-[25%]">Field</th>
                                    <th className="border border-black p-1 w-[35%]">From</th>
                                    <th className="border border-black p-1 w-[35%]">To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Position Level */}
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Position Level:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_position_level_from", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_position_level_from}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        No Change
                                    </td>

                                </tr>

                                {/* Department */}
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Department:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_department_from", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        No Change
                                    </td>

                                </tr>

                                {/* Account */}
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Account:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_account_from")}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        No Change
                                    </td>

                                </tr>

                                {/* Status */}
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Status:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_status_from", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        No Change
                                    </td>

                                </tr>

                                {/* Position Title */}
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Position Title:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_position_from", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        No Change
                                    </td>

                                </tr>

                                {/* Reporting To */}
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Reporting To:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_reporting_from", { required: true })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        No Change
                                    </td>
                                </tr>

                                {/* Basic Pay */}
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Basic Pay:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="number"
                                            {...register("info_basic_pay_from", { required: false })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        No Change
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Dynamic Allowances Section */}
                        <div className="my-6">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-bold uppercase text-sm">
                                    Allowances:
                                </h2>
                                <Button
                                    type="button"
                                    className="text-xs px-3 py-1 bg-blue-600 text-white"
                                    onClick={() =>
                                        append({
                                            name: ALLOWANCE_OPTIONS[0],
                                            amount_from: 0,
                                            amount_to: 0,
                                        })
                                    }
                                >
                                    + Add Allowance
                                </Button>
                            </div>

                            <table className="w-full border-collapse border border-black text-sm text-center">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-black p-1 w-[35%]">Allowance Type</th>
                                        <th className="border border-black p-1 w-[25%]">From</th>
                                        <th className="border border-black p-1 w-[25%]">To</th>
                                        <th className="border border-black p-1 w-[15%]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-2 border border-black italic text-gray-500">
                                                No allowances added. Click "+ Add Allowance" above to add dynamic fields.
                                            </td>
                                        </tr>
                                    ) : (
                                        fields.map((field, index) => (
                                            <tr key={field.id}>
                                                <td className="border border-black p-1">
                                                    <Select
                                                        name={`allowances.${index}.name`}
                                                        className="w-full text-center"
                                                        options={ALLOWANCE_OPTIONS.map((opt) => ({
                                                            label: opt,
                                                            value: opt,
                                                        }))}
                                                        value={watchedValues.allowances?.[index]?.name}
                                                        onChange={(val) =>
                                                            setValue(`allowances.${index}.name`, val, { shouldValidate: true })
                                                        }
                                                    />
                                                </td>
                                                <td className="border border-black p-1">
                                                    <Input
                                                        type="number"
                                                        {...register(`allowances.${index}.amount_from`, { required: true })}
                                                        className="bg-transparent w-full outline-none text-center text-black"
                                                        error={errors?.allowances?.[index]?.amount_from}
                                                    />
                                                </td>
                                                <td className="border border-black p-1">
                                                    <Input
                                                        type="number"
                                                        {...register(`allowances.${index}.amount_to`, { required: true })}
                                                        className="bg-transparent w-full outline-none text-center text-black"
                                                        error={errors?.allowances?.[index]?.amount_to}
                                                    />
                                                </td>
                                                <td className="border border-black p-1">
                                                    <Button
                                                        type="button"
                                                        className="text-xs px-2 py-1 bg-red-600 text-white w-full"
                                                        onClick={() => remove(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <TextArea
                        label="Notes"
                        type="text"
                        {...register("notes", { required: "Required!" })}
                        className="bg-transparent w-full outline-none text-black"
                        error={errors?.notes?.message ?? ""}
                        onChange={(val) => setValue("notes", val.target.value)}
                    />

                    {/* Signatures Section */}
                    <div className="mt-8 text-sm">
                        <div className="mb-8">
                            <p className="font-bold mb-8">Prepared & Approved by:</p>
                            <p className="font-bold">Anthony Aragon</p>
                            <p className="italic">HR Director</p>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold mb-6">Acknowledgment and Confirmation:</p>
                            <div className="border-t border-black w-64 mb-1"></div>
                        </div>

                        <div className="flex justify-between items-end mb-12">
                            <div className="flex items-end">
                                <span className="font-bold mr-2 mb-1">Date:</span>
                                <div className="border-b text-center border-black w-48">
                                    {moment().format("LL")}
                                </div>
                            </div>
                            <div className="text-[10px] text-gray-700">
                                *It is not a guaranteed allowance and may be removed by the program
                            </div>
                        </div>
                    </div>

                    {/* Footer / Disclaimer */}
                    <div className="text-center mt-12 mb-8">
                        <p className="font-bold italic text-sm mb-2">Confidential and Proprietary</p>
                        <p className="text-[10px] text-gray-400 italic text-center leading-tight">
                            Disclaimer:
                            <br />
                            This document and its contents are the property of EmpireOne BPO
                            Solutions, Inc. and are intended for internal use only.
                            Unauthorized reproduction, disclosure, or distribution of this
                            material, in whole or in part, without prior written permission
                            from the company is strictly prohibited.
                        </p>
                    </div>

                    {/* Form Submit Actions */}
                    <div className="flex justify-end border-t pt-4">
                        <Button
                            type="button"
                            onClick={() => reset()}
                            className="mr-4 bg-gray-200 text-black"
                        >
                            Reset
                        </Button>
                        <Button loading={isSubmitting} type="submit">
                            Submit Change Form
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CreateECFSection;