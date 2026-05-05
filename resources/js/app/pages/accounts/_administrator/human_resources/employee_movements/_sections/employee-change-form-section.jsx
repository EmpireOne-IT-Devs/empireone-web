import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const EmployeeChangeFormSection = ({ data }) => {
    const [open, setOpen] = useState(false);

    // Initialize react-hook-form and extract errors
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "Rodolfo S. Tiongson",
            employee_id: "25072801",
            hire_date: "28 July 2025",
            position_level: "Rank and File",
            position_title: "CSR – Tier 3",
            department: "Operations",
            account: "Simple Tire",
            reporting_to: "Team Lead",
            division: "CSR - Voice",
            reason_for_change: "Regularization",
            effective_date: "March 26, 2026",
            change_type: "Change To",
            info_position_level_from: "Rank and File",
            info_position_level_to: "No Change",
            info_department_from: "Operations",
            info_department_to: "No Change",
            info_account_from: "Simple Tire",
            info_account_to: "No Change",
            info_division_from: "CSR - Voice",
            info_division_to: "No Change",
            info_status_from: "Probationary",
            info_status_to: "Regular",
            info_position_title_from: "CSR – Tier 3",
            info_position_title_to: "No Change",
            info_reporting_to_from: "Team Lead",
            info_reporting_to_to: "No Change",
            info_basic_pay_from: "Php",
            info_basic_pay_to: "No Change",
            info_allowances_from: "Php",
            info_allowances_to: "No Change",
            ack_name: "Rodolfo S. Tiongson",
            ack_date: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Form Submitted:", data);
        // Add your API call or state update here

        // Optional: Close modal after submission
        // setOpen(false);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>EMPLOYEE CHANGE FORM</Button>
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
                                Empire<span className="text-blue-500">One</span>
                                <div className="w-3 h-3 bg-blue-500 rounded-full ml-1"></div>
                            </div>
                            <div className="h-0.5 w-full bg-blue-200 mt-1"></div>
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
                                        <Input
                                            type="text"
                                            {...register("name", { required: true })}
                                            className="bg-transparent w-full outline-none uppercase font-bold text-black"
                                            error={errors.name && "Required"}
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
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.employee_id && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Hire Date:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("hire_date", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.hire_date && "Required"}
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
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.position_level && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Position Title:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("position_title", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.position_title && "Required"}
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
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.department && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Account:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("account", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.account && "Required"}
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
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.reporting_to && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase align-top">
                                        Division/Section:
                                    </td>
                                    <td className="border border-black p-1 px-2 text-center">
                                        <Input
                                            type="text"
                                            {...register("division", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.division && "Required"}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Reason For Change */}
                    <div className="mb-6 flex items-start text-sm">
                        <div className="mt-1 flex items-center">
                            <span className="font-bold uppercase mr-1">
                                Reason for Change
                            </span>
                            <span className="italic text-xs mr-2">
                                (Kindly make sure to attach the necessary documentation):
                            </span>
                        </div>
                        <div className="font-bold italic px-2 py-0.5 border border-black w-64">
                            <Input
                                type="text"
                                {...register("reason_for_change", { required: true })}
                                className="bg-transparent w-full outline-none text-black"
                                error={errors.reason_for_change && "Required"}
                            />
                        </div>
                    </div>

                    {/* New Information Details */}
                    <div className="mb-6">
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
                                            type="text"
                                            {...register("effective_date", { required: true })}
                                            className="bg-transparent w-full outline-none font-bold text-black"
                                            error={errors.effective_date && "Required"}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Checkboxes (Radio behavior via form values) */}
                        <div className="flex justify-end items-center text-xs mb-1">
                            <span className="italic mr-2">
                                (Mark the applicable item)
                            </span>
                            <label className="flex items-center mr-4 cursor-pointer">
                                <Input
                                    type="radio"
                                    value="Change To"
                                    {...register("change_type", { required: true })}
                                    className="w-4 h-4 border border-black mr-1 accent-black"
                                    error={errors.change_type && "Required"}
                                />
                                <span>Change To</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <Input
                                    type="radio"
                                    value="Add to Current Status"
                                    {...register("change_type", { required: true })}
                                    className="w-4 h-4 border border-black mr-1 accent-black"
                                    error={errors.change_type && "Required"}
                                />
                                <span>Add to Current Status</span>
                            </label>
                        </div>

                        {/* Information Details Table */}
                        <table className="w-full border-collapse border border-black text-sm text-center">
                            <thead>
                                <tr>
                                    <th
                                        colSpan="3"
                                        className="border border-black p-1 font-bold uppercase"
                                    >
                                        Information Details
                                    </th>
                                </tr>
                                <tr>
                                    <th className="border border-black p-1 w-[25%]"></th>
                                    <th className="border border-black p-1 w-[37.5%]">
                                        From
                                    </th>
                                    <th className="border border-black p-1 w-[37.5%]">
                                        To
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Position Level:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_position_level_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_position_level_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_position_level_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_position_level_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Department:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_department_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_department_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_department_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_department_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Account:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_account_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_account_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_account_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_account_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Division:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_division_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_division_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_division_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_division_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Status:
                                    </td>
                                    <td className="border border-black p-1 font-bold">
                                        <Input
                                            type="text"
                                            {...register("info_status_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center font-bold text-black"
                                            error={errors.info_status_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1 font-bold">
                                        <Input
                                            type="text"
                                            {...register("info_status_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center font-bold text-black"
                                            error={errors.info_status_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Position Title:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_position_title_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_position_title_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_position_title_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_position_title_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Reporting To:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_reporting_to_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_reporting_to_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_reporting_to_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_reporting_to_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Basic Pay:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_basic_pay_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_basic_pay_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_basic_pay_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_basic_pay_to && "Required"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Allowances:
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_allowances_from", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_allowances_from && "Required"}
                                        />
                                    </td>
                                    <td className="border border-black p-1">
                                        <Input
                                            type="text"
                                            {...register("info_allowances_to", { required: true })}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                            error={errors.info_allowances_to && "Required"}
                                        />
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
                                    {...register("ack_name", { required: true })}
                                    className="bg-transparent w-full outline-none uppercase font-bold text-black"
                                    error={errors.ack_name && "Required"}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-12">
                            <div className="flex items-end">
                                <span className="font-bold mr-2 mb-1">Date:</span>
                                <div className="border-b border-black w-48">
                                    <Input
                                        type="date"
                                        {...register("ack_date", { required: true })}
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
                        <p className="text-[10px] text-gray-400 italic text-left leading-tight">
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