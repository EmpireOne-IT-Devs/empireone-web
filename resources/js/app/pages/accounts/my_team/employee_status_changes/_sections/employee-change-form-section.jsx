import Button from "@/app/_components/button";
import Checkbox from "@/app/_components/checkbox";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Radio from "@/app/_components/radio";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import { peso_format } from "@/app/lib/peso-format";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

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
    change_type: null,
    info_position_level_from: null,
    info_position_level_to: null,
    info_department_from: null,
    info_department_id_to: null,
    info_account_from: null,
    info_account_id_to: null,
    info_status_from: null,
    info_status_to: null,
    info_position_from: null,
    info_position_to: null,
    info_reporting_from: null,
    info_reporting_to: null,
    info_basic_pay_from: null,
    info_basic_pay_to: null,
    info_allowances_from: null,
    info_allowances_to: null,
    ack_name: null,
    ack_date: null,
    // Toggles for inline editing
    is_edit_status: false,
    is_edit_reporting_to: false,
    is_edit_basic_pay: false,
    is_edit_allowances: false,
};

const EmployeeChangeFormSection = () => {
    const { data } = useSelector((store) => store.app);
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: defaultFormValues,
    });

    const watchedValues = watch();

    // Optimize derivations using useMemo
    const selected_employee = useMemo(() => {
        return data?.user?.leader?.subordinates?.find(
            (res) => res.subordinate_id == watchedValues.user_id,
        );
    }, [data?.user?.leader?.subordinates, watchedValues.user_id]);

    const selected_ecf = useMemo(() => {
        return data?.user?.account_employee?.account?.ecfs?.find(
            (res) => res.id == watchedValues.ecf_id,
        );
    }, [data?.user?.account_employee?.account?.ecfs, watchedValues.ecf_id]);

    // Batch setValues loop to keep code clean
    useEffect(() => {
        if (selected_employee) {
            const empData = selected_employee?.employee?.account_employee;
            const leaderData =
                selected_employee?.leader?.user?.personal_information;
            const reportingName =
                `${leaderData?.first_name || ""} ${leaderData?.last_name || ""}`.trim();

            const fieldUpdates = {
                employee_id: empData?.employee_id,
                hire_date: empData?.started_at,
                position_level: empData?.position_level ?? "N/A",
                info_position_level_from: empData?.position_level ?? "N/A",
                info_position_level_to: empData?.position_level ?? "N/A",
                info_department_from: empData?.department?.name,
                info_department_id_to: empData?.department?.id,
                info_account_from: empData?.account?.name,
                info_account_id_to: empData?.account?.id,
                info_status_from: empData?.status,
                info_status_to: empData?.status,
                info_position_from: empData?.position,
                info_position_to: empData?.position,
                info_reporting_from: reportingName,
                info_reporting_to: reportingName,
                info_basic_pay_from: empData?.basic_pay,
                info_allowances_from: empData?.allowance,
                position: empData?.position,
                department: empData?.department?.name,
                account: empData?.account?.name,
                reporting_to: reportingName,
            };

            Object.entries(fieldUpdates).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [selected_employee, setValue]);

    const onSubmit = (form_data) => {
        console.log("Form Submitted:", form_data);
        // setOpen(false);
    };

    return (
        <>
            <div className="w-full flex items-center justify-end">
                <Button className="w-96" onClick={() => setOpen(true)}>
                    EMPLOYEE CHANGE FORM
                </Button>
            </div>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width="max-w-7xl"
                title="Employee Change Form"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" mx-auto p-8 text-black font-sans"
                >
                    {/* Header */}
                    <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
                        <div className="flex flex-col">
                            <div className="text-4xl font-extrabold text-blue-900 tracking-tight flex items-baseline">
                                <img
                                    src="/images/E1CXlogo2.png"
                                    className="w-52"
                                />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold uppercase tracking-wide">
                            Employee Change Form
                        </h1>
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
                                    <td
                                        colSpan="3"
                                        className="border border-black p-1 px-2 font-bold uppercase"
                                    >
                                        <Select
                                            label="Employee"
                                            name="user_id"
                                            options={data?.user?.leader?.subordinates?.map(
                                                (res) => ({
                                                    ...res,
                                                    label: `${res.employee.personal_information.first_name} ${res.employee.personal_information.last_name}`,
                                                    value: res.employee
                                                        .personal_information
                                                        .user_id,
                                                }),
                                            )}
                                            value={watchedValues.user_id}
                                            onChange={(val) =>
                                                setValue("user_id", val, {
                                                    shouldValidate: true,
                                                })
                                            }
                                            error={!watchedValues.user_id}
                                            className="w-full"
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
                                            {...register("employee_id", {
                                                required: true,
                                            })}
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
                                            {...register("hire_date", {
                                                required: true,
                                            })}
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
                                            {...register("position_level", {
                                                required: true,
                                            })}
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
                                            {...register("position", {
                                                required: true,
                                            })}
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
                                            {...register("department", {
                                                required: true,
                                            })}
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
                                            {...register("account", {
                                                required: true,
                                            })}
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
                                            {...register("reporting_to", {
                                                required: true,
                                            })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.reporting_to}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Employment Status:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        {
                                            selected_employee?.employee
                                                ?.account_employee?.status
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Reason For Change */}
                    <div className="mb-6 flex items-start flex-col gap-3 w-full text-sm">
                        <div className="mt-1 flex items-center">
                            <span className="italic text-xs mr-2">
                                (Kindly make sure to attach the necessary
                                documentation):
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
                                    setValue(
                                        "reason_for_change",
                                        val.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="flex gap-3 items-start justify-center w-full">
                            {data?.user?.account_employee?.status ==
                                "Probationar" && (
                                <Checkbox
                                    label="Regular"
                                    {...register("regular")}
                                    onChange={(val) =>
                                        setValue("regular", val.target.checked)
                                    }
                                />
                            )}

                            <Checkbox
                                label="Account Transfer"
                                {...register("account_transfer")}
                                onChange={(val) =>
                                    setValue(
                                        "account_transfer",
                                        val.target.checked,
                                    )
                                }
                            />

                            <Checkbox
                                label="Department Transfer"
                                {...register("department_transfer")}
                                onChange={(val) =>
                                    setValue(
                                        "department_transfer",
                                        val.target.checked,
                                    )
                                }
                            />
                            <Checkbox
                                label="Position & Title"
                                {...register("position_and_title")}
                                onChange={(val) =>
                                    setValue(
                                        "position_and_title",
                                        val.target.checked,
                                    )
                                }
                            />
                            <Checkbox
                                label="Tiering"
                                {...register("tiering")}
                                onChange={(val) =>
                                    setValue("tiering", val.target.checked)
                                }
                            />
                        </div>

                        {watchedValues.tiering && (
                            <Select
                                label="Tiers"
                                name="ecf_id"
                                className="w-full"
                                options={data?.user?.account_employee?.account?.ecfs?.map(
                                    (res) => ({
                                        ...res,
                                        label: res.original,
                                        value: res.id,
                                    }),
                                )}
                                value={watchedValues.ecf_id}
                                onChange={(val) =>
                                    setValue("ecf_id", val, {
                                        shouldValidate: true,
                                    })
                                }
                                error={!watchedValues.ecf_id}
                            />
                        )}
                    </div>
                    {watchedValues.tiering && (
                        <table className="w-full border-collapse border border-black text-sm mb-6">
                            <tbody>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6 ">
                                        {selected_ecf?.name}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6 ">
                                        {selected_ecf?.original}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6 ">
                                        {selected_ecf?.role}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6 ">
                                        {selected_ecf?.responsibility}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6 ">
                                        {selected_ecf?.payout_details}
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase w-1/6 ">
                                        Total Allowances:{" "}
                                        {peso_format(selected_ecf?.amount)}
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
                                            {...register("effective_date", {
                                                required: true,
                                            })}
                                            className="bg-transparent w-full outline-none font-bold text-black"
                                            error={errors.effective_date}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Information Details Table */}
                        <table className="w-full border-collapse border border-black text-sm text-center">
                            <thead>
                                <tr>
                                    <th
                                        colSpan="4"
                                        className="border border-black p-1 font-bold uppercase bg-gray-100"
                                    >
                                        Information Details
                                    </th>
                                </tr>
                                <tr>
                                    <th className="border border-black p-1 w-[25%]">
                                        Field
                                    </th>
                                    <th className="border border-black p-1 w-[35%]">
                                        From
                                    </th>
                                    <th className="border border-black p-1 w-[35%]">
                                        To
                                    </th>
                                    <th className="border border-black p-1 w-[5%]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Position Level:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register(
                                                "info_position_level_from",
                                                { required: true },
                                            )}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={
                                                errors.info_position_level_from
                                            }
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.position_and_title ? (
                                            <Select
                                                name="info_position_level_to"
                                                className="w-full"
                                                options={[
                                                    "Rank and File",
                                                    "Supervisor",
                                                    "Manager",
                                                    "Executive",
                                                ]?.map((res) => ({
                                                    label: res,
                                                    value: res,
                                                }))}
                                                value={
                                                    watchedValues.info_position_level_to
                                                }
                                                onChange={(val) =>
                                                    setValue(
                                                        "info_position_level_to",
                                                        val,
                                                    )
                                                }
                                                error={
                                                    errors.info_position_level_to
                                                }
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1 text-xs italic text-gray-500">
                                        Auto-link
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Department:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register(
                                                "info_department_from",
                                                { required: true },
                                            )}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.department_transfer ? (
                                            <Select
                                                name="info_department_id_to"
                                                className="w-full"
                                                options={data?.departments?.map(
                                                    (res) => ({
                                                        label: res.name,
                                                        value: res.id,
                                                    }),
                                                )}
                                                value={
                                                    watchedValues.info_department_id_to
                                                }
                                                onChange={(val) =>
                                                    setValue(
                                                        "info_department_id_to",
                                                        val,
                                                    )
                                                }
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1 text-xs italic text-gray-500">
                                        Auto-link
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Account:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_account_from", {
                                                required: true,
                                            })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.account_transfer ? (
                                            <Select
                                                name="info_account_id_to"
                                                className="w-full"
                                                options={data?.accounts?.map(
                                                    (res) => ({
                                                        label: res.name,
                                                        value: res.id,
                                                    }),
                                                )}
                                                value={
                                                    watchedValues.info_account_id_to
                                                }
                                                onChange={(val) =>
                                                    setValue(
                                                        "info_account_id_to",
                                                        val,
                                                    )
                                                }
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1 text-xs italic text-gray-500">
                                        Auto-link
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Status:
                                    </td>
                                    <td className="border border-black p-1 ">
                                        <Input
                                            type="text"
                                            {...register("info_status_from", {
                                                required: true,
                                            })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1 ">
                                        {watchedValues.regular ? (
                                            <Input
                                                type="text"
                                                {...register("info_status_to", {
                                                    required: true,
                                                })}
                                                className="bg-transparent w-full outline-none text-center text-black"
                                                error={errors.info_status_to}
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1 text-xs italic text-gray-500">
                                        Auto-link
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Position Title:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_position_from", {
                                                required: true,
                                            })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.position_and_title ? (
                                            <Input
                                                type="text"
                                                {...register(
                                                    "info_position_to",
                                                    { required: true },
                                                )}
                                                className="bg-transparent w-full outline-none text-center text-black"
                                                error={errors.info_position_to}
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1 text-xs italic text-gray-500">
                                        Auto-link
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Reporting To:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register(
                                                "info_reporting_from",
                                                { required: true },
                                            )}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.is_edit_reporting_to ? (
                                            <Input
                                                type="text"
                                                {...register(
                                                    "info_reporting_to",
                                                    { required: true },
                                                )}
                                                className="bg-transparent w-full outline-none text-center text-black"
                                                error={errors.info_reporting_to}
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1">
                                        <Button
                                            type="button"
                                            className="text-xs px-2 py-1 w-full"
                                            onClick={() =>
                                                setValue(
                                                    "is_edit_reporting_to",
                                                    !watchedValues.is_edit_reporting_to,
                                                )
                                            }
                                        >
                                            {watchedValues.is_edit_reporting_to
                                                ? "Cancel"
                                                : "Edit"}
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Basic Pay:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="number"
                                            {...register(
                                                "info_basic_pay_from",
                                                { required: true },
                                            )}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.is_edit_basic_pay ? (
                                            <Input
                                                type="number"
                                                {...register(
                                                    "info_basic_pay_to",
                                                    { required: true },
                                                )}
                                                className="bg-transparent w-full outline-none text-center text-black"
                                                error={errors.info_basic_pay_to}
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1">
                                        <Button
                                            type="button"
                                            className="text-xs px-2 py-1 w-full"
                                            onClick={() =>
                                                setValue(
                                                    "is_edit_basic_pay",
                                                    !watchedValues.is_edit_basic_pay,
                                                )
                                            }
                                        >
                                            {watchedValues.is_edit_basic_pay
                                                ? "Cancel"
                                                : "Edit"}
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-center uppercase">
                                        Allowances:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="number"
                                            {...register(
                                                "info_allowances_from",
                                                { required: true },
                                            )}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.is_edit_allowances ? (
                                            <Input
                                                type="number"
                                                {...register(
                                                    "info_allowances_to",
                                                    { required: true },
                                                )}
                                                className="bg-transparent w-full outline-none text-center text-black"
                                                error={
                                                    errors.info_allowances_to
                                                }
                                            />
                                        ) : (
                                            "No Change"
                                        )}
                                    </td>
                                    <td className="border border-black p-1">
                                        <Button
                                            type="button"
                                            className="text-xs px-2 py-1 w-full"
                                            onClick={() =>
                                                setValue(
                                                    "is_edit_allowances",
                                                    !watchedValues.is_edit_allowances,
                                                )
                                            }
                                        >
                                            {watchedValues.is_edit_allowances
                                                ? "Cancel"
                                                : "Edit"}
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Signatures Section */}
                    <div className="mt-8 text-sm">
                        <div className="mb-8">
                            <p className="font-bold mb-8">
                                Prepared & Approved by:
                            </p>
                            <p className="font-bold">Anthony Aragon</p>
                            <p className="italic">HR Director</p>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold mb-6">
                                Acknowledgment and Confirmation:
                            </p>
                            <div className="border-t border-black w-64 mb-1"></div>
                            <div className="border border-black w-64 font-bold p-1 uppercase">
                                <Input
                                    type="text"
                                    {...register("ack_name", {
                                        required: true,
                                    })}
                                    className="bg-transparent w-full outline-none uppercase font-bold text-black"
                                    error={errors.ack_name && "Required"}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-12">
                            <div className="flex items-end">
                                <span className="font-bold mr-2 mb-1">
                                    Date:
                                </span>
                                <div className="border-b border-black w-48">
                                    <Input
                                        type="date"
                                        {...register("ack_date", {
                                            required: true,
                                        })}
                                        className="bg-transparent w-full outline-none text-black pb-1"
                                        error={errors.ack_date && "Required"}
                                    />
                                </div>
                            </div>
                            <div className="text-[10px] text-gray-700">
                                *It is not a guaranteed allowance and may be
                                removed by the program
                            </div>
                        </div>
                    </div>

                    {/* Footer / Disclaimer */}
                    <div className="text-center mt-12 mb-8">
                        <p className="font-bold italic text-sm mb-2">
                            Confidential and Proprietary
                        </p>
                        <p className="text-[10px] text-gray-400 italic text-center leading-tight">
                            Disclaimer:
                            <br />
                            This document and its contents are the property of
                            EmpireOne BPO Solutions, Inc. and are intended for
                            internal use only. Unauthorized reproduction,
                            disclosure, or distribution of this material, in
                            whole or in part, without prior written permission
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
                        <Button type="submit">Submit Change Form</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default EmployeeChangeFormSection;
