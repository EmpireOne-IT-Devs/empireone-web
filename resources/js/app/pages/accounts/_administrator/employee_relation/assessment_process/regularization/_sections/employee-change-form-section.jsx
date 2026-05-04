import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const EmployeeChangeFormSection = () => {
    const [open, setOpen] = useState(false);

    // Initialize react-hook-form
    const { register, handleSubmit, reset } = useForm({
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
                    className=" mx-auto p-8 text-black font-sans shadow-lg my-8 "
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
                                    <td className="border border-black font-bold p-1 px-2 w-1/4 uppercase">
                                        Name:
                                    </td>
                                    <td
                                        colSpan="3"
                                        className="border border-black bg-yellow-300 p-1 px-2 font-bold uppercase"
                                    >
                                        <input
                                            {...register("name")}
                                            className="bg-transparent w-full outline-none uppercase font-bold text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Employee ID:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-right">
                                        <input
                                            {...register("employee_id")}
                                            className="bg-transparent w-full outline-none text-right text-black"
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Hire Date:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-right">
                                        <input
                                            {...register("hire_date")}
                                            className="bg-transparent w-full outline-none text-right text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Position Level:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-center">
                                        <input
                                            {...register("position_level")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Position Title:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-right">
                                        <input
                                            {...register("position_title")}
                                            className="bg-transparent w-full outline-none text-right text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Department:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-center">
                                        <input
                                            {...register("department")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Account:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-right">
                                        <input
                                            {...register("account")}
                                            className="bg-transparent w-full outline-none text-right text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Reporting To:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-center">
                                        <input
                                            {...register("reporting_to")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black font-bold p-1 px-2 uppercase">
                                        Division/Section:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 px-2 text-right">
                                        <input
                                            {...register("division")}
                                            className="bg-transparent w-full outline-none text-right text-black"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Reason For Change */}
                    <div className="mb-6 flex items-center text-sm">
                        <span className="font-bold uppercase mr-1">
                            Reason for Change
                        </span>
                        <span className="italic text-xs mr-2">
                            (Kindly make sure to attach the necessary
                            documentation):
                        </span>
                        <div className="font-bold italic bg-yellow-300 px-2 py-0.5 border border-transparent w-64">
                            <input
                                {...register("reason_for_change")}
                                className="bg-transparent w-full outline-none text-black"
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
                                    <td className="border border-black bg-yellow-300 p-1 px-2 font-bold w-[85%]">
                                        <input
                                            {...register("effective_date")}
                                            className="bg-transparent w-full outline-none font-bold text-black"
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
                                <input
                                    type="radio"
                                    value="Change To"
                                    {...register("change_type")}
                                    className="w-4 h-4 border border-black mr-1 accent-black"
                                />
                                <span>Change To</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="Add to Current Status"
                                    {...register("change_type")}
                                    className="w-4 h-4 border border-black mr-1 accent-black"
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
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_position_level_from",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_position_level_to",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Department:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_department_from",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_department_to")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Account:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_account_from")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_account_to")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Division:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_division_from")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_division_to")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Status:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 font-bold">
                                        <input
                                            {...register("info_status_from")}
                                            className="bg-transparent w-full outline-none text-center font-bold text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1 font-bold">
                                        <input
                                            {...register("info_status_to")}
                                            className="bg-transparent w-full outline-none text-center font-bold text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Position Title:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_position_title_from",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_position_title_to",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Reporting To:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_reporting_to_from",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_reporting_to_to",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Basic Pay:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_basic_pay_from")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_basic_pay_to")}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold p-1 px-2 text-left uppercase">
                                        Allowances:
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register(
                                                "info_allowances_from",
                                            )}
                                            className="bg-transparent w-full outline-none text-center text-black"
                                        />
                                    </td>
                                    <td className="border border-black bg-yellow-300 p-1">
                                        <input
                                            {...register("info_allowances_to")}
                                            className="bg-transparent w-full outline-none text-center text-black"
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
                            <div className="bg-yellow-300 w-64 font-bold p-1 uppercase">
                                <input
                                    {...register("ack_name")}
                                    className="bg-transparent w-full outline-none uppercase font-bold text-black"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-12">
                            <div className="flex items-end">
                                <span className="font-bold mr-2">Date:</span>
                                <div className="border-b border-black w-48">
                                    <input
                                        type="date"
                                        {...register("ack_date")}
                                        className="bg-transparent w-full outline-none text-black"
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
