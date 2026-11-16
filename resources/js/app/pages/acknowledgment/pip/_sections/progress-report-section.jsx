"use client";

import React from "react";
import moment from "moment";

export default function ProgressReportSection({
    pip,
    user,
    isSubmitting,
    onSign,
    data,
    setData,
    processing,
    errors,
}) {
    const formatDate = (dateString) => {
        if (!dateString) return "_____________";
        return moment(dateString).format("LL");
    };

    // Exact name mappings matching your backend object
    const employeeFullName = pip
        ? [pip.first_name, pip.last_name].filter(Boolean).join(" ")
        : "";

    const supervisorFullName =
        pip?.supervisor_name ||
        [pip?.supervisor?.first_name, pip?.supervisor?.last_name]
            .filter(Boolean)
            .join(" ") ||
        "";

    const operationsManagerName =
        pip?.manager_name ||
        [pip?.manager?.first_name, pip?.manager?.last_name]
            .filter(Boolean)
            .join(" ") ||
        "";

    const hrFullName =
        [pip?.hr_first_name, pip?.hr_last_name].filter(Boolean).join(" ") ||
        [pip?.hr?.first_name, pip?.hr?.last_name].filter(Boolean).join(" ") ||
        "";

    // Final Signature Status Flags matching DB schema
    const isEmployeeFinalSigned =
        Number(pip?.is_employee_final_acknowledged) === 1;
    const isSupervisorFinalSigned =
        Number(pip?.is_supervisor_final_approved) === 1;
    const isOperationsManagerFinalSigned =
        Number(pip?.is_manager_final_approved) === 1;
    const isHrFinalSigned = Number(pip?.is_hr_final_approved) === 1;

    // Role-based permissions matching DB user IDs and roles
    const canEmployeeSign =
        !isEmployeeFinalSigned && Number(user?.id) === Number(pip?.user_id);

    const canSupervisorSign =
        !isSupervisorFinalSigned &&
        (Number(user?.id) === Number(pip?.supervisor_user_id) ||
            user?.role === "Supervisor");

    const canOperationsManagerSign =
        !isOperationsManagerFinalSigned &&
        (Number(user?.id) === Number(pip?.manager_user_id) ||
            user?.role === "Manager" ||
            user?.role === "Operations Manager");

    const canHrSign =
        !isHrFinalSigned &&
        (Number(user?.id) === Number(pip?.hr_user_id) || user?.role === "HR");

    // Check if the current logged-in user is the supervisor
    const isSupervisorUser =
        Number(user?.id) === Number(pip?.supervisor_user_id) ||
        user?.role === "Supervisor";

    // Can supervisor edit fields (only if they are the supervisor AND haven't signed yet)
    const canSupervisorEdit = isSupervisorUser && !isSupervisorFinalSigned;

    // is_passed should be numeric 1 or 0
    const isPassed = Number(data.is_passed) === 1;

    return (
        <div className="w-full max-w-[850px] bg-white border border-slate-300 shadow-xl p-8 space-y-6 print:border-none print:shadow-none print:p-6 text-[11px] leading-relaxed mx-auto my-8 print:page-break-before-always">
            {/* INTERACTIVE TOGGLE CONTROLS (Hidden during printing / Editable only by supervisor before signing) */}
            {canSupervisorEdit && (
                <div className="print:hidden bg-slate-100 border border-slate-300 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                    <span className="font-bold text-xs uppercase text-slate-700">
                        Select Evaluation Outcome (Supervisor Control):
                    </span>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 font-semibold text-xs cursor-pointer text-emerald-700">
                            <input
                                type="radio"
                                name="interactive_outcome_toggle"
                                value={1}
                                checked={isPassed}
                                onChange={() => setData("is_passed", 1)}
                                className="w-4 h-4 text-emerald-600"
                            />
                            Closed - Passed
                        </label>
                        <label className="flex items-center gap-2 font-semibold text-xs cursor-pointer text-red-700">
                            <input
                                type="radio"
                                name="interactive_outcome_toggle"
                                value={0}
                                checked={!isPassed}
                                onChange={() => setData("is_passed", 0)}
                                className="w-4 h-4 text-red-600"
                            />
                            Closed - Failed
                        </label>
                    </div>
                </div>
            )}

            {/* HEADER TABLE */}
            <div className="border border-black grid grid-cols-3">
                <div className="p-4 flex items-center justify-center border-r border-black">
                    <span className="text-2xl font-black tracking-tight text-blue-900">
                        Empire<span className="text-cyan-400">One</span>
                    </span>
                </div>
                <div className="col-span-2 p-4 flex flex-col items-center justify-center text-center font-bold uppercase tracking-wide text-xs">
                    <p>Performance Improvement Plan (PIP)</p>
                    <p className="text-base font-extrabold mt-0.5">
                        Progress Report
                    </p>
                </div>
            </div>

            <div className="text-center font-bold text-base underline uppercase tracking-wide pt-2">
                PIP Progress Report
            </div>

            {/* EMPLOYEE INFO TABLE */}
            <table className="w-full border-collapse border border-black text-xs">
                <tbody>
                    <tr>
                        <td className="border border-black p-2 font-semibold w-1/2">
                            Employee Name:{" "}
                            <span className="font-normal">
                                {employeeFullName || "Loading..."}
                            </span>
                        </td>
                        <td className="border border-black p-2 font-semibold w-1/2">
                            Employee Number:{" "}
                            <span className="font-normal">
                                {pip?.employee_id || ""}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2 font-semibold">
                            Position:{" "}
                            <span className="font-normal">
                                {pip?.position || ""}
                            </span>
                        </td>
                        <td className="border border-black p-2 font-semibold">
                            Immediate Supervisor:{" "}
                            <span className="font-normal">
                                {supervisorFullName}
                            </span>
                        </td>
                    </tr>
                    <tr className="text-center font-semibold bg-slate-100">
                        <td className="border border-black p-1.5">
                            PIP Start Date
                        </td>
                        <td className="border border-black p-1.5">
                            PIP End Date
                        </td>
                        <td className="border border-black p-1.5">
                            # of Enrollments
                        </td>
                        <td className="border border-black p-1.5">
                            Dates of Previous Enrollments
                        </td>
                    </tr>
                    <tr className="text-center">
                        <td className="border border-black p-2">
                            {formatDate(pip?.pip_start_date)}
                        </td>
                        <td className="border border-black p-2">
                            {formatDate(pip?.pip_end_date)}
                        </td>
                        <td className="border border-black p-2">
                            {pip?.pip_cycle || "1"}
                        </td>
                        <td className="border border-black p-2">N/A</td>
                    </tr>
                </tbody>
            </table>

            {/* NOTIFICATION PARAGRAPH */}
            <p className="text-justify">
                You were notified last{" "}
                <span className="underline">
                    {formatDate(pip?.notification_date) || "(month/date/year)"}
                </span>{" "}
                that you are being enrolled under the Performance Improvement
                Plan due to failing standard performance metrics from{" "}
                <strong>{formatDate(pip?.pip_start_date)}</strong> to{" "}
                <strong>{formatDate(pip?.pip_end_date)}</strong>. You were duly
                informed that you have 30 days from receipt to improve your
                performance. Weekly coaching was conducted to monitor and assess
                your progress.
            </p>

            <div className="font-bold text-xs uppercase pt-2">
                Below is the result of the weekly development progress:
            </div>

            {/* PROGRESS TABLE */}
            <table className="w-full border-collapse border border-black text-center text-xs">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="border border-black p-2 font-bold w-1/4">
                            KPI
                        </th>
                        <th className="border border-black p-2 font-bold w-1/4">
                            TARGET
                        </th>
                        {isPassed && (
                            <th className="border border-black p-2 font-bold w-1/4">
                                GOAL
                            </th>
                        )}
                        <th className="border border-black p-2 font-bold w-1/4">
                            ACTUAL
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-black p-2 text-left font-medium">
                            {pip?.history_kpi || "KPI 1"}
                        </td>
                        <td className="border border-black p-2">
                            {pip?.history_target || "—"}
                        </td>
                        {isPassed && (
                            <td className="border border-black p-2">
                                {pip?.action_kpi_goal || "—"}
                            </td>
                        )}
                        <td
                            className={`border border-black p-2 font-bold ${
                                isPassed ? "" : "text-red-600"
                            }`}
                        >
                            {pip?.history_actual || "—"}
                        </td>
                    </tr>
                    <tr>
                        <td
                            className="border border-black p-1.5 text-left italic text-slate-500 text-[10px]"
                            colSpan={isPassed ? 4 : 3}
                        >
                            (add as necessary)
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="text-justify">
                In line with the objective of achieving satisfactory
                performance, the following action plans were created:
            </p>

            {/* ACTION PLAN NOTES FIELD (Editable only by Supervisor before signing) */}
            <div className="space-y-1">
                {canSupervisorEdit ? (
                    <textarea
                        value={data.action_notes}
                        onChange={(e) =>
                            setData("action_notes", e.target.value)
                        }
                        rows={4}
                        placeholder="(Please enumerate all action plans implemented and not implemented. Indicate the reason for none implementation.)"
                        className="w-full border border-black p-3 text-xs text-slate-800 bg-slate-50/50 italic focus:outline-none focus:ring-1 focus:ring-blue-600 resize-y"
                    />
                ) : (
                    <div className="w-full border border-black p-3 text-xs text-slate-800 bg-slate-50 italic min-h-[80px] whitespace-pre-wrap">
                        {data.action_notes ||
                            "(No action notes specified by supervisor yet.)"}
                    </div>
                )}
                {errors.action_notes && (
                    <div className="text-red-600 text-[10px]">
                        {errors.action_notes}
                    </div>
                )}
            </div>

            {/* CONDITIONAL OUTCOME TEMPLATE RENDERING */}
            {isPassed ? (
                /* PASSED TEMPLATE */
                <div className="border border-black p-4 space-y-3 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 border-b border-black text-center font-bold pb-0.5 text-xs">
                            ✓
                        </div>
                        <span className="text-xs font-semibold">
                            Passed PIP for the Month of{" "}
                            {canSupervisorEdit ? (
                                <input
                                    type="text"
                                    value={data.passed_month}
                                    onChange={(e) =>
                                        setData("passed_month", e.target.value)
                                    }
                                    className="underline font-bold bg-transparent border-none text-xs w-44 focus:outline-none print:border-none"
                                    placeholder="___________________"
                                />
                            ) : (
                                <span className="underline font-bold">
                                    {data.passed_month || "___________________"}
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            ) : (
                /* FAILED & SANCTIONS TEMPLATE */
                <div className="border border-black p-4 space-y-4 bg-slate-50/30">
                    <p className="text-justify text-slate-700">
                        Based on the development program result, despite the
                        weekly assessment thru coaching and counseling you did
                        not meet the satisfactory performance ratings as
                        required by the PIP. You failed to pass the PIP
                        guidelines; hence, EmpireOne has found the following to
                        be valid and existing causes to impose the sanction of:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {[
                            "Written Warning",
                            "Final Written Warning",
                            "Recommended for Termination",
                        ].map((sanctionOption) => {
                            const isSelected = data.sanction === sanctionOption;
                            return (
                                <label
                                    key={sanctionOption}
                                    onClick={() => {
                                        if (canSupervisorEdit) {
                                            setData("sanction", sanctionOption);
                                        }
                                    }}
                                    className={`flex items-center gap-2 text-[11px] font-medium ${
                                        canSupervisorEdit
                                            ? "cursor-pointer"
                                            : "cursor-default"
                                    }`}
                                >
                                    {canSupervisorEdit && (
                                        <input
                                            type="radio"
                                            name="failure_sanction"
                                            checked={isSelected}
                                            onChange={() =>
                                                setData(
                                                    "sanction",
                                                    sanctionOption,
                                                )
                                            }
                                        />
                                    )}
                                    [ {isSelected ? "✓" : " "} ]{" "}
                                    {sanctionOption}
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="border-t border-black my-4"></div>

            {/* EMPLOYEE ACKNOWLEDGMENT FORM */}
            <div className="space-y-3 text-justify">
                <div className="font-bold text-xs uppercase text-center">
                    Employee Acknowledgment Form
                </div>
                <p>
                    I acknowledge and certify that the above report of my
                    performance from{" "}
                    <strong>{formatDate(pip?.pip_start_date)}</strong> to{" "}
                    <strong>{formatDate(pip?.pip_end_date)}</strong> under the
                    PIP has been properly discussed to me. Further, I hereby
                    agree to the contents of this report
                    {!isPassed ? ", including the sanction imposed" : ""}.
                </p>
            </div>

            {/* SIGNATURES BLOCK (4 Signatories) */}
            <div className="pt-6 space-y-4">
                <div className="font-bold text-xs uppercase">Signatures:</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pt-2">
                    {/* 1. Employee Signature Block */}
                    <div>
                        <div className="border-b border-black pb-1 min-h-[50px] flex flex-col items-center justify-end relative">
                            {isEmployeeFinalSigned &&
                            pip?.employee?.signature ? (
                                <img
                                    src={pip.employee.signature}
                                    alt="Signature"
                                    className="h-10 max-w-[110px] object-contain mb-0.5"
                                />
                            ) : canEmployeeSign ? (
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        onSign("is_employee_final_acknowledged")
                                    }
                                    className="print:hidden px-2 py-1 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-colors shadow-sm disabled:opacity-50 mb-1 cursor-pointer"
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Approve & Sign"}
                                </button>
                            ) : null}
                            <span className="font-bold leading-tight text-center">
                                {employeeFullName}
                            </span>
                        </div>
                        <span className="text-[10px] block mt-1 font-semibold text-slate-700">
                            Employee
                        </span>
                        <span className="text-[9px] text-slate-500">
                            Name and Signature/Date
                        </span>
                    </div>

                    {/* 2. Immediate Supervisor Signature Block */}
                    <div>
                        <div className="border-b border-black pb-1 min-h-[50px] flex flex-col items-center justify-end relative">
                            {isSupervisorFinalSigned &&
                            pip?.supervisor?.signature ? (
                                <img
                                    src={pip.supervisor.signature}
                                    alt="Signature"
                                    className="h-10 max-w-[110px] object-contain mb-0.5"
                                />
                            ) : canSupervisorSign ? (
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        onSign("is_supervisor_final_approved")
                                    }
                                    className="print:hidden px-2 py-1 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-colors shadow-sm disabled:opacity-50 mb-1 cursor-pointer"
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Approve & Sign"}
                                </button>
                            ) : null}
                            <span className="font-bold leading-tight text-center">
                                {supervisorFullName}
                            </span>
                        </div>
                        <span className="text-[10px] block mt-1 font-semibold text-slate-700">
                            Immediate Supervisor
                        </span>
                        <span className="text-[9px] text-slate-500">
                            Name and Signature/Date
                        </span>
                    </div>

                    {/* 3. Operations Manager Signature Block */}
                    <div>
                        <div className="border-b border-black pb-1 min-h-[50px] flex flex-col items-center justify-end relative">
                            {isOperationsManagerFinalSigned &&
                            pip?.manager?.signature ? (
                                <img
                                    src={pip.manager.signature}
                                    alt="Signature"
                                    className="h-10 max-w-[110px] object-contain mb-0.5"
                                />
                            ) : canOperationsManagerSign ? (
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        onSign("is_manager_final_approved")
                                    }
                                    className="print:hidden px-2 py-1 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-colors shadow-sm disabled:opacity-50 mb-1 cursor-pointer"
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Approve & Sign"}
                                </button>
                            ) : null}
                            <span className="font-bold leading-tight text-center">
                                {operationsManagerName}
                            </span>
                        </div>
                        <span className="text-[10px] block mt-1 font-semibold text-slate-700">
                            Operations Manager
                        </span>
                        <span className="text-[9px] text-slate-500">
                            Name and Signature/Date
                        </span>
                    </div>

                    {/* 4. Human Resources Signature Block */}
                    <div>
                        <div className="border-b border-black pb-1 min-h-[50px] flex flex-col items-center justify-end relative">
                            {isHrFinalSigned && pip?.hr?.signature ? (
                                <img
                                    src={pip.hr.signature}
                                    alt="Signature"
                                    className="h-10 max-w-[110px] object-contain mb-0.5"
                                />
                            ) : canHrSign ? (
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        onSign("is_hr_final_approved")
                                    }
                                    className="print:hidden px-2 py-1 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-colors shadow-sm disabled:opacity-50 mb-1 cursor-pointer"
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Approve & Sign"}
                                </button>
                            ) : null}
                            <span className="font-bold leading-tight text-center">
                                {hrFullName}
                            </span>
                        </div>
                        <span className="text-[10px] block mt-1 font-semibold text-slate-700">
                            Human Resources
                        </span>
                        <span className="text-[9px] text-slate-500">
                            Name and Signature/Date
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
