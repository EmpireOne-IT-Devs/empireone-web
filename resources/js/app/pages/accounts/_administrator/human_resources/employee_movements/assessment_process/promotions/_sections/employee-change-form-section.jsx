import Button from "@/app/_components/button";
import Checkbox from "@/app/_components/checkbox";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Radio from "@/app/_components/radio";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import { peso_format } from "@/app/lib/peso-format";
import { setAlert } from "@/app/redux/app-slice";
import { get_employee_applicants_thunk } from "@/app/redux/employee-relation-thunk";
import { create_employee_change_form_service } from "@/app/services/employee-change-form-service";
import store from "@/app/store/store";
import moment from "moment";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

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
    info_account_id_from: null, //
    info_status_from: null,
    info_status_to: null,
    info_position_from: null,
    info_position_to: null,
    info_reporting_from: null,
    info_reporting_id_from: null, // 
    info_reporting_id_to: null, //
    info_basic_pay_from: null,
    info_basic_pay_to: null,
    info_allowances_from: null,
    info_allowances_to: null,
    prepaired_by_id: 50,
    info_reporting_to: '',
    ack_date: null,
    is_edit_status: false,
    is_edit_reporting_to: false,
    is_edit_basic_pay: false,
    is_edit_allowances: false,
    is_account_transfer: false,
    is_department_transfer: false,
    is_position_and_title: false,
    is_tiering: false
};

const EmployeeChangeFormSection = ({ props_data }) => {
    const params = new URLSearchParams(window.location.search);
    const user_id = props_data?.applicant?.id;
    const { data } = useSelector((store) => store.app);
    const { employees, leaders } = useSelector((store) => store.human_resources);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: defaultFormValues,
    });


    const employee_information = props_data?.applicant?.account_employee;
    const leader_information = props_data?.applicant?.account_employee?.er_leader?.employee;
    const new_position_information = props_data?.job_posting?.job_requisition
    const agent_account = props_data?.applicant?.account_employee?.account;
    const watchedValues = watch();
    console.log('props_data?.applicant', props_data?.applicant)

    const new_report = leaders?.find(res => res.user_id == watchedValues.info_reporting_id_to)
    console.log('new_report', new_report?.user?.personal_information?.first_name)
    useEffect(() => {
        if (watchedValues.info_account_id_from != new_position_information?.account_id) {
            setValue("is_account_transfer", true);
        }
        if (watchedValues.info_department_id_from != new_position_information?.department?.id) {
            setValue("is_department_transfer", true);
        }
        if (watchedValues.position != new_position_information?.title) {
            setValue("is_position_and_title", true);
        }
        if (leader_information?.id != new_position_information?.user?.id && new_position_information?.user?.id != undefined) {
            setValue("is_edit_reporting_to", true);
        }

        if (props_data?.recommendation == 'Regular') {
            setValue("regular", true)
        }

        setValue('name', `${props_data?.applicant?.personal_information?.first_name} ${props_data?.applicant?.personal_information?.last_name}`)

    }, [])


    useEffect(() => {
        if (new_report) {
            setValue("info_reporting_to", `${new_report?.user?.personal_information?.first_name} ${new_report?.user?.personal_information?.last_name}`);
        }
    }, [new_report, watchedValues.info_reporting_to])

    const selected_employee = useMemo(() => {
        return Array.isArray(employees)
            ? employees.find((res) => res?.user_id == watchedValues?.user_id)
            : null;
    }, [employees, watchedValues?.user_id]);


    const selected_ecf = agent_account?.ecfs?.find(res => res.id == watchedValues.ecf_id)

    useEffect(() => {
        setValue("user_id", user_id);
    }, []);


    useEffect(() => {
        if (employee_information) {
            const reportingName =
                `${leader_information?.personal_information?.first_name || ""} ${leader_information?.personal_information?.last_name || ""}`.trim();

            const fieldUpdates = {
                employee_id: employee_information?.employee_id,
                hire_date: employee_information?.started_at,
                position_level: employee_information?.position_level ?? "N/A",
                info_position_level_from:
                    employee_information?.position_level ?? "N/A",
                info_position_level_to:
                    employee_information?.position_level ?? "N/A",
                info_department_from: employee_information?.department?.name,
                info_department_id_from: employee_information?.department?.id,
                info_department_id_to: new_position_information?.department?.id,
                info_account_from: employee_information?.account?.name,
                info_account_id_from: employee_information?.account?.id,
                info_account_id_to: new_position_information?.account_id,
                info_status_from: employee_information?.status,
                info_status_to: props_data?.recommendation,
                info_position_from: employee_information?.position,
                info_position_to: new_position_information?.title,
                info_reporting_from: reportingName,
                info_reporting_id_from: leader_information?.id,
                info_reporting_id_to: new_position_information?.user?.id,
                info_basic_pay_from: employee_information?.basic_pay,
                info_basic_pay_to: employee_information?.basic_pay,
                info_allowances_from: employee_information?.allowance,
                info_allowances_to: employee_information?.allowance,
                info_reporting_to: watchedValues.info_reporting_to,
                position: employee_information?.position,
                department: employee_information?.department?.name,
                account: employee_information?.account?.name ?? '',
                reporting_to: reportingName,
            };

            Object.entries(fieldUpdates).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [employee_information, setValue]);

    console.log('new_position_information', employee_information?.status)

    const onSubmit = async (form_data) => {
        console.log("Form Submitted:", form_data);
        try {

            await create_employee_change_form_service({
                ...form_data,
                job_application_id: props_data.id
            })
            await store.dispatch(get_employee_applicants_thunk())
            dispatch(
                setAlert({
                    type: "success",
                    title: "Change Form Created Successfully!",
                    message:
                        "The change Form has been created and is ready for review.",
                    open: true,
                }),
            );
            setOpen(false);
        } catch (error) {

        }
    };
    console.log('selected_employee', selected_employee)

    return (
        <>
            <div className="w-full flex items-center justify-center">
                <Button
                    className="w-full"
                    variant="primary"
                    onClick={() => setOpen(true)}>
                    CREATE CHANGE FORM
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
                                        {/* <Select
                                            label="Employee"
                                            name="user_id"
                                            options={employees?.map((res) => ({
                                                ...res,
                                                label: `${res.personal_information.first_name} ${res.personal_information.last_name}`,
                                                value: `${res?.personal_information.user_id}`,
                                            }))}
                                            value={watchedValues.user_id}
                                            onChange={(val) =>
                                                setValue("user_id", val, {
                                                    shouldValidate: true,
                                                })
                                            }
                                            error={!watchedValues.user_id}
                                            className="w-full"
                                        /> */}
                                        <Input
                                            type="text"
                                            {...register("name", {
                                                required: true,
                                            })}
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
                                            {...register("employee_id", {
                                                required: true,
                                            })}
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
                                            {...register("hire_date", {
                                                required: true,
                                            })}
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
                                            {...register("position_level", {
                                                required: true,
                                            })}
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
                                            {...register("position", {
                                                required: true,
                                            })}
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
                                            {...register("department", {
                                                required: true,
                                            })}
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
                                            {...register("reporting_to", {
                                                required: true,
                                            })}
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
                            {employee_information?.status == "Probationary" && (
                                <Checkbox
                                    label="Regular"
                                    {...register("regular")}
                                    checked={watchedValues.regular}
                                    onChange={(val) =>
                                        setValue("regular", val.target.checked)
                                    }
                                />
                            )}

                            <Checkbox
                                label="Account Transfer"
                                {...register("is_account_transfer")}
                                checked={watchedValues.is_account_transfer}
                                onChange={(val) =>
                                    setValue(
                                        "is_account_transfer",
                                        val.target.checked,
                                    )
                                }
                            />


                            <Checkbox
                                label="Department Transfer"
                                {...register("is_department_transfer")}
                                checked={watchedValues.is_department_transfer}
                                onChange={(val) =>
                                    setValue(
                                        "is_department_transfer",
                                        val.target.checked,
                                    )
                                }
                            />
                            <Checkbox
                                label="Position & Title"
                                {...register("is_position_and_title")}
                                checked={watchedValues.is_position_and_title}
                                onChange={(val) =>
                                    setValue(
                                        "is_position_and_title",
                                        val.target.checked,
                                    )
                                }
                            />
                            <Checkbox
                                label="Tiering"
                                {...register("is_tiering")}
                                checked={watchedValues.is_tiering}
                                disabled={!watchedValues.is_tiering}
                                onChange={(val) =>
                                    setValue("is_tiering", val.target.checked)
                                }
                            />
                        </div>
                        {watchedValues.is_tiering && (
                            <Select
                                label="Tiers"
                                name="ecf_id"
                                className="w-full"
                                options={agent_account?.ecfs?.map(
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
                    {watchedValues.is_tiering && (
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
                                        {watchedValues.is_position_and_title ? (
                                            <Select

                                                name="info_position_level_to"
                                                className="w-full text-center"
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
                                        {watchedValues.is_department_transfer ? (
                                            <Select
                                                name="info_department_id_to"
                                                className="w-full text-center"

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
                                            {...register("info_account_from")}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues.is_account_transfer ? (
                                            <Select

                                                name="info_account_id_to"
                                                className="w-full text-center"
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
                                        {watchedValues?.regular ? (
                                            <Input
                                                type="text"
                                                {...register("info_status_to", {
                                                    required: true,
                                                })}
                                                disabled
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
                                        {watchedValues.is_position_and_title ? (
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
                                            {...register("info_reporting_from", {
                                                required: true,
                                            })}
                                            disabled
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                        {/* leader_information */}
                                    </td>
                                    <td className="border border-black p-1">
                                        {watchedValues?.is_edit_reporting_to ? (
                                            <Select

                                                name="info_reporting_id_to"
                                                className="w-full text-center"
                                                options={leaders?.map((res) => ({
                                                    label: res?.user?.name,
                                                    value: res?.user_id,
                                                }))}
                                                value={
                                                    watchedValues?.info_reporting_id_to
                                                }
                                                onChange={(val) =>
                                                    setValue(
                                                        "info_reporting_id_to",
                                                        val,
                                                    )
                                                }
                                                error={
                                                    errors?.info_reporting_id_to
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
                                                { required: false },
                                            )}
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
                                                { required: false },
                                            )}

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
                            <p className="font-bold">
                                {/* {watchedValues.prepaired_by_id} */}
                                Anthony Aragon
                            </p>
                            <p className="italic">HR Director</p>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold mb-6">
                                Acknowledgment and Confirmation:
                            </p>
                            <div className="border-t border-black w-64 mb-1"></div>
                            {/* <div className="border border-black w-64 font-bold p-1 uppercase">
                                <Input
                                    type="text"
                                    {...register("prepaired_by_id", {
                                        required: true,
                                    })}
                                    className="bg-transparent w-full outline-none uppercase font-bold text-black"
                                    error={errors.prepaired_by_id && "Required"}
                                />
                                
                            </div> */}
                        </div>

                        <div className="flex justify-between items-end mb-12">
                            <div className="flex items-end">
                                <span className="font-bold mr-2 mb-1">
                                    Date:
                                </span>
                                <div className="border-b text-center border-black w-48">
                                    {/* <Input
                                        type="date"
                                        {...register("ack_date", {
                                            required: true,
                                        })}
                                        className="bg-transparent w-full outline-none text-black pb-1"
                                        error={errors.ack_date && "Required"}
                                    /> */}
                                    {moment().format("LL")}
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
                        <Button
                            loading={isSubmitting}
                            type="submit">Submit Change Form</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default EmployeeChangeFormSection;
