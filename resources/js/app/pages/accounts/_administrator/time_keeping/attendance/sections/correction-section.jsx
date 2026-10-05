import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { create_attendance_correction_service } from "@/app/services/attendance-service";

const DATE_FORMAT = "YYYY-MM-DD";
const DATETIME_LOCAL_FORMAT = "YYYY-MM-DDTHH:mm";
const DISPLAY_DATE_FORMAT = "MM/DD/YYYY";
const DISPLAY_DATETIME_FORMAT = "MM/DD/YYYY hh:mm A";

// Native datetime-local follows browser locale (dd/mm/yyyy); this always shows month first.
// The popup z-index must exceed the parent Modal's z-[9999] or the calendar is hidden behind it.
function DateTimeInput({ value, onChange }) {
    return (
        <ConfigProvider theme={{ token: { zIndexPopupBase: 10000 } }}>
            <DatePicker
                showTime={{ format: "hh:mm A", use12Hours: true }}
                use12Hours
                inputReadOnly
                format={DISPLAY_DATETIME_FORMAT}
                placeholder="MM/DD/YYYY --:-- --"
                value={value ? dayjs(value, DATETIME_LOCAL_FORMAT) : null}
                onChange={(v) => onChange(v ? v.format(DATETIME_LOCAL_FORMAT) : "")}
                className="w-full py-2"
            />
        </ConfigProvider>
    );
}

const TIME_ONLY_KEYS = [
    "time_in_correction",
    "time_out_correction",
    "break_start_correction",
    "break_end_correction",
    "time_in_2_correction",
    "time_out_2_correction",
];

export default function CorrectionSection({ date, log, setIsOpen, onSaved }) {
    const dispatch = useDispatch();

    const inputClass =
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";

    const labelClass = "mb-1 block text-sm font-medium text-gray-700";

    // A shift like 5pm-2am ends the next calendar day.
    const isOvernightShift =
        log?.schedule_time_in &&
        log?.schedule_time_out &&
        moment(log.schedule_time_out, "HH:mm:ss").isSameOrBefore(
            moment(log.schedule_time_in, "HH:mm:ss"),
        );

    const toDatetimeLocal = (value) =>
        value ? moment(value).format(DATETIME_LOCAL_FORMAT) : "";

    const toTimeOnly = (time) =>
        time ? moment(time, "HH:mm:ss").format("HH:mm") : "";

    // The left "current value" column displays the actual attendance record.
    const currentValues = {
        time_in: toTimeOnly(log?.time_in ?? log?.schedule_time_in),
        time_out: toTimeOnly(log?.time_out ?? log?.schedule_time_out),
        clock_in: toDatetimeLocal(log?.clock_in_at),
        clock_out: toDatetimeLocal(log?.clock_out_at),
        break_start: log?.break_start_at ? moment(log.break_start_at).format("HH:mm") : "",
        break_end: log?.break_end_at ? moment(log.break_end_at).format("HH:mm") : "",
    };

    const [form, setForm] = useState({
        attendanceDate: date ? dayjs(date) : dayjs(),
        reason: "",
        time_in_correction: "",
        time_out_correction: "",
        clock_in_correction: "",
        clock_out_correction: "",
        break_start_correction: "",
        break_end_correction: "",
        break1_start: "",
        break1_end: "",
        break2_start: "",
        break2_end: "",
        break3_start: "",
        break3_end: "",
        time_in_2_correction: "",
        time_out_2_correction: "",
        clock_in_2_correction: "",
        clock_out_2_correction: "",
        shift2_break1_start: "",
        shift2_break1_end: "",
        shift2_break2_start: "",
        shift2_break2_end: "",
        shift2_break3_start: "",
        shift2_break3_end: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleDateChange = (value) => {
        setForm((prev) => ({ ...prev, attendanceDate: value }));
    };

    const handleFieldChange = (field) => (event) => {
        const value = event?.target ? event.target.value : event;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setErrors({});

        setSubmitting(true);

        const payload = Object.entries(form).reduce((acc, [key, value]) => {
            if (key === "attendanceDate") {
                acc.date = value ? value.format(DATE_FORMAT) : null;
            } else if (TIME_ONLY_KEYS.includes(key) && value) {
                // Time-only input; anchor to the row's date, next day when an overnight shift wraps past midnight.
                const base = moment(form.attendanceDate.format(DATE_FORMAT));
                if (
                    isOvernightShift &&
                    value < moment(log.schedule_time_in, "HH:mm:ss").format("HH:mm")
                ) {
                    base.add(1, "day");
                }
                acc[key] = `${base.format(DATE_FORMAT)}T${value}`;
            } else {
                acc[key] = value === "" ? null : value;
            }
            return acc;
        }, {});

        try {
            await create_attendance_correction_service(payload);

            dispatch(
                setAlert({
                    type: "success",
                    title: "Correction request submitted successfully!",
                }),
            );

            setIsOpen(false);
            onSaved?.();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data?.errors ?? {});
            } else {
                dispatch(
                    setAlert({
                        type: "error",
                        title:
                            err.response?.data?.message ??
                            "Failed to submit correction request.",
                    }),
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const fieldError = (field) =>
        errors[field]?.[0] ? (
            <p className="mt-1 text-xs text-red-600">{errors[field][0]}</p>
        ) : null;

    const correctionFields = [
        { label: "Time In", key: "time_in", correctionKey: "time_in_correction", timeOnly: true },
        { label: "Time Out", key: "time_out", correctionKey: "time_out_correction", timeOnly: true },
        { label: "Clock In", key: "clock_in", correctionKey: "clock_in_correction" },
        { label: "Clock Out", key: "clock_out", correctionKey: "clock_out_correction" },
        { label: "Break Start", key: "break_start", correctionKey: "break_start_correction", timeOnly: true },
        { label: "Break End", key: "break_end", correctionKey: "break_end_correction", timeOnly: true },
    ];

    const breakFields = [
        { index: 1, startKey: "break1_start", endKey: "break1_end" },
        { index: 2, startKey: "break2_start", endKey: "break2_end" },
        { index: 3, startKey: "break3_start", endKey: "break3_end" },
    ];

    const shift2Fields = [
        { label: "Time In 2", correctionKey: "time_in_2_correction", timeOnly: true },
        { label: "Time Out 2", correctionKey: "time_out_2_correction", timeOnly: true },
        { label: "Clock In 2", correctionKey: "clock_in_2_correction" },
        { label: "Clock Out 2", correctionKey: "clock_out_2_correction" },
    ];

    const shift2BreakFields = [
        { index: 1, startKey: "shift2_break1_start", endKey: "shift2_break1_end" },
        { index: 2, startKey: "shift2_break2_start", endKey: "shift2_break2_end" },
        { index: 3, startKey: "shift2_break3_start", endKey: "shift2_break3_end" },
    ];

    const summaryFields = [
        { label: "Late", value: log?.late_minutes != null ? `${log.late_minutes} min(s)` : "" },
        { label: "Regular Overtime", value: "" },
        { label: "Undertime", value: log?.undertime_minutes != null ? `${log.undertime_minutes} min(s)` : "" },
        { label: "Breaktime Limit", value: log?.breaktime_limit != null ? `${log.breaktime_limit} min(s)` : "" },
        { label: "Breaktime", value: log?.breaktime_minutes != null ? `${log.breaktime_minutes} min(s)` : "" },
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
                        <DatePicker
                            name="attendanceDate"
                            format={DISPLAY_DATE_FORMAT}
                            value={form.attendanceDate}
                            onChange={handleDateChange}
                            disabled
                            className={`${inputClass} w-full`}
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
                        {correctionFields.map(({ label, key, correctionKey, timeOnly }) => (
                            <React.Fragment key={key}>
                                <div>
                                    <label className={labelClass}>
                                        {label}
                                    </label>
                                    {currentValues[key] ? (
                                        <input
                                            type={timeOnly ? "time" : "text"}
                                            value={
                                                timeOnly
                                                    ? currentValues[key]
                                                    : moment(currentValues[key]).format(DISPLAY_DATETIME_FORMAT)
                                            }
                                            readOnly
                                            disabled
                                            className={`${inputClass} bg-gray-50`}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value="No Data"
                                            readOnly
                                            disabled
                                            className={`${inputClass} bg-gray-50`}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        {label} Correction
                                    </label>
                                    {timeOnly ? (
                                        <input
                                            type="time"
                                            value={form[correctionKey]}
                                            onChange={handleFieldChange(correctionKey)}
                                            className={inputClass}
                                        />
                                    ) : (
                                        <DateTimeInput
                                            value={form[correctionKey]}
                                            onChange={handleFieldChange(correctionKey)}
                                        />
                                    )}
                                    {fieldError(correctionKey)}
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
                            type="text"
                            value={
                                log?.breaktime_minutes != null
                                    ? `${log.breaktime_minutes} min(s)`
                                    : ""
                            }
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
                            {breakFields.map(({ index, startKey, endKey }) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                >
                                    <div>
                                        <label className={labelClass}>
                                            Break Time Start {index}
                                        </label>
                                        <DateTimeInput
                                            value={form[startKey]}
                                            onChange={handleFieldChange(startKey)}
                                        />
                                        {fieldError(startKey)}
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Break Time End {index}
                                        </label>
                                        <DateTimeInput
                                            value={form[endKey]}
                                            onChange={handleFieldChange(endKey)}
                                        />
                                        {fieldError(endKey)}
                                    </div>
                                </div>
                            ))}
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
                        {shift2Fields.map(({ label, correctionKey, timeOnly }) => (
                            <React.Fragment key={correctionKey}>
                                <div>
                                    <label className={labelClass}>
                                        {label}
                                    </label>
                                    <input
                                        type="text"
                                        value="No Data"
                                        readOnly
                                        disabled
                                        className={`${inputClass} bg-gray-50`}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        {label} Correction
                                    </label>
                                    {timeOnly ? (
                                        <input
                                            type="time"
                                            value={form[correctionKey]}
                                            onChange={handleFieldChange(correctionKey)}
                                            className={inputClass}
                                        />
                                    ) : (
                                        <DateTimeInput
                                            value={form[correctionKey]}
                                            onChange={handleFieldChange(correctionKey)}
                                        />
                                    )}
                                    {fieldError(correctionKey)}
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
                            {shift2BreakFields.map(({ index, startKey, endKey }) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                >
                                    <div>
                                        <label className={labelClass}>
                                            Shift 2 Break Time Start {index}
                                        </label>

                                        <DateTimeInput
                                            value={form[startKey]}
                                            onChange={handleFieldChange(startKey)}
                                        />
                                        {fieldError(startKey)}
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Shift 2 Break Time End {index}
                                        </label>

                                        <DateTimeInput
                                            value={form[endKey]}
                                            onChange={handleFieldChange(endKey)}
                                        />
                                        {fieldError(endKey)}
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
                        {summaryFields.map(({ label, value }) => (
                            <div key={label}>
                                <label className={labelClass}>{label}</label>

                                <input
                                    type="text"
                                    value={value}
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
                        <label className={labelClass}>Correction Reason (Optional)</label>

                        <textarea
                            rows={4}
                            value={form.reason}
                            onChange={handleFieldChange("reason")}
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
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Submit Correction"}
                </button>
            </div>
        </>
    );
}
