import React, { useState } from "react";
import { FaClock, FaXmark } from "react-icons/fa6";

export default function CorrectionSection() {
    const inputClass =
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";

    const labelClass = "mb-1 block text-sm font-medium text-gray-700";

    const correctionFields = [
        ["Time In", "Time In Correction"],
        ["Time Out", "Time Out Correction"],
        ["Clock In", "Clock In Correction"],
        ["Clock Out", "Clock Out Correction"],
        ["Break Start", "Break Start Correction"],
        ["Break End", "Break End Correction"],
    ];

    const breakFields = [
        ["Break Time Start 1", "Break Time End 1"],
        ["Break Time Start 2", "Break Time End 2"],
        ["Break Time Start 3", "Break Time End 3"],
    ];

    const shift2Fields = [
        ["Time In 2", "Time In 2 Correction"],
        ["Time Out 2", "Time Out 2 Correction"],
        ["Clock In 2", "Clock In 2 Correction"],
        ["Clock Out 2", "Clock Out 2 Correction"],
    ];

    return (
        <>
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Attendance Correction
                    </h2>
                    <p className="text-sm text-gray-500">
                        Request correction for attendance records
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-5">
                {/* Attendance Date */}
                <section className="mb-6">
                    <h3 className="mb-3 text-base font-semibold text-gray-800">
                        Attendance Date
                    </h3>

                    <div className="max-w-sm">
                        <input
                            type="date"
                            defaultValue="2026-09-19"
                            className={inputClass}
                        />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Please advise your supervisor to endorse your request to
                        the HR/Admin for approval.
                    </p>
                </section>

                {/* Shift 1 */}
                <section className="mb-6 rounded-lg border border-gray-200 p-4">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-800">
                            Shift 1
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            If Time In is not appropriate, please specify the
                            correct Time In in the Time In Correction field. The
                            same scenario applies to Time Out.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {correctionFields.map(([label, correctionLabel]) => (
                            <React.Fragment key={label}>
                                <div>
                                    <label className={labelClass}>
                                        {label}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        {correctionLabel}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Duration */}
                    <div className="mt-5">
                        <label className={labelClass}>
                            Duration in Minutes
                        </label>

                        <input
                            type="number"
                            value=""
                            placeholder="No Data"
                            readOnly
                            className={`${inputClass} bg-gray-50`}
                        />
                    </div>

                    {/* Manual Break Time */}
                    <div className="mt-6">
                        <h4 className="mb-3 text-sm font-semibold text-gray-800">
                            Manually Add Time (Break Time 1 - 3)
                        </h4>

                        <div className="space-y-4">
                            {breakFields.map(
                                ([startLabel, endLabel], index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                    >
                                        <div>
                                            <label className={labelClass}>
                                                {startLabel}
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                {endLabel}
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </section>

                {/* Shift 2 */}
                <section className="mb-6 rounded-lg border border-gray-200 p-4">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-800">
                            Shift 2
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Double Shift Support — leave blank if you only
                            worked one shift.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {shift2Fields.map(([label, correctionLabel]) => (
                            <React.Fragment key={label}>
                                <div>
                                    <label className={labelClass}>
                                        {label}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        {correctionLabel}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Shift 2 Breaks */}
                    <div className="mt-6">
                        <h4 className="mb-3 text-sm font-semibold text-gray-800">
                            Manually Add Time (Break Time 1 - 3)
                        </h4>

                        <div className="space-y-4">
                            {[1, 2, 3].map((breakNumber) => (
                                <div
                                    key={breakNumber}
                                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                >
                                    <div>
                                        <label className={labelClass}>
                                            Shift 2 Break Time Start{" "}
                                            {breakNumber}
                                        </label>

                                        <input
                                            type="datetime-local"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Shift 2 Break Time End {breakNumber}
                                        </label>

                                        <input
                                            type="datetime-local"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Attendance Summary */}
                <section className="mb-6 rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-2 text-base font-semibold text-gray-800">
                        Attendance Summary
                    </h3>

                    <p className="mb-4 text-sm text-gray-500">
                        Late In Minute, Overtime In Minute, Undertime In Minute
                        and Breaktime will only change once the correction
                        request has been granted.
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                            "Late",
                            "Regular Overtime",
                            "Undertime",
                            "Breaktime Limit",
                            "Breaktime",
                        ].map((field) => (
                            <div key={field}>
                                <label className={labelClass}>{field}</label>

                                <input
                                    type="text"
                                    placeholder="No Data"
                                    readOnly
                                    className={`${inputClass} bg-gray-50`}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Correction Reason */}
                <section className="mb-6 rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-4 text-base font-semibold text-gray-800">
                        Correction Request
                    </h3>

                    <div>
                        <label className={labelClass}>Correction Reason</label>

                        <textarea
                            rows={4}
                            placeholder="Enter the reason for this correction request..."
                            className={inputClass}
                        />
                    </div>
                </section>

                {/* Approval Information */}
                <section className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-4 text-base font-semibold text-gray-800">
                        Approval Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className={labelClass}>
                                Correction Request Endorsed By
                            </label>

                            <input
                                type="text"
                                readOnly
                                placeholder="Not yet endorsed"
                                className={`${inputClass} bg-gray-50`}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Correction Request Granted By
                            </label>

                            <input
                                type="text"
                                readOnly
                                placeholder="Not yet granted"
                                className={`${inputClass} bg-gray-50`}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Correction Request Declined By
                            </label>

                            <input
                                type="text"
                                readOnly
                                placeholder="Not declined"
                                className={`${inputClass} bg-gray-50`}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
                    Submit Correction
                </button>
            </div>
        </>
    );
}
