import React, { useCallback, useEffect, useState } from "react";
import { FaXmark, FaPlus, FaCheck, FaBan, FaUserCheck } from "react-icons/fa6";
import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_overtime_requests_service,
    create_overtime_request_service,
    endorse_overtime_request_service,
    approve_overtime_request_service,
    decline_overtime_request_service,
} from "@/app/services/overtime-service";

// Native date inputs follow the OS locale, so use antd's own calendar to lock the order to MM/DD/YYYY
const DATE_FORMAT = "MM/DD/YYYY";
const DATE_TIME_FORMAT = "MM/DD/YYYY hh:mm A";

const formatDateTime = (value) => {
    if (!value) return "";
    return dayjs(value).format(DATE_TIME_FORMAT);
};

export default function OvertimeSection({ date, onSaved }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        attendanceDate: dayjs(date),
        startDateTime: null,
        endDateTime: null,
        remark: "",
    });

    const [overtimeRequests, setOvertimeRequests] = useState([]);

    const fetchOvertimeRequests = useCallback(async () => {
        setLoading(true);

        try {
            const res = await get_overtime_requests_service(date);
            setOvertimeRequests(res.data.data);
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title:
                        err.response?.data?.message ||
                        "Failed to load overtime requests.",
                }),
            );
        } finally {
            setLoading(false);
        }
    }, [date, dispatch]);

    useEffect(() => {
        fetchOvertimeRequests();
    }, [fetchOvertimeRequests]);

    const inputClass =
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm " +
        "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

    const labelClass = "mb-1 block text-sm font-medium text-gray-700";

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name) => (date) => {
        setForm((prev) => ({
            ...prev,
            [name]: date,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.startDateTime || !form.endDateTime) {
            window.alert("Start and End Date and Time are required.");
            return;
        }

        setSubmitting(true);

        try {
            await create_overtime_request_service({
                date: form.attendanceDate.format("YYYY-MM-DD"),
                start_at: dayjs(form.startDateTime).format(
                    "YYYY-MM-DD HH:mm:ss",
                ),
                end_at: dayjs(form.endDateTime).format("YYYY-MM-DD HH:mm:ss"),
                remark: form.remark,
            });

            dispatch(
                setAlert({
                    type: "success",
                    title: "Overtime request submitted successfully!",
                }),
            );

            setForm((prev) => ({
                ...prev,
                startDateTime: null,
                endDateTime: null,
                remark: "",
            }));

            fetchOvertimeRequests();
            onSaved?.();
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title:
                        err.response?.data?.message ||
                        "Failed to submit overtime request.",
                }),
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Supervisor/leader endorsement — required before accounting can approve
    const handleEndorse = async (id) => {
        try {
            await endorse_overtime_request_service(id);
            fetchOvertimeRequests();
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title: err.response?.data?.message || "Failed to endorse request.",
                }),
            );
        }
    };

    // Final approval by accounting, only allowed once endorsed
    const handleApprove = async (id) => {
        try {
            await approve_overtime_request_service(id);
            fetchOvertimeRequests();
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title: err.response?.data?.message || "Failed to approve request.",
                }),
            );
        }
    };

    const handleDecline = async (id, role) => {
        const note = window.prompt(
            `Enter a reason for declining (${role}):`,
            "",
        );

        if (note === null) {
            return;
        }

        try {
            await decline_overtime_request_service(id, note);
            fetchOvertimeRequests();
            onSaved?.();
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title: err.response?.data?.message || "Failed to decline request.",
                }),
            );
        }
    };

    return (
        <>
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Overtime Request
                    </h2>

                    <p className="text-sm text-gray-500">
                        Submit and monitor your overtime request.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-5">
                {/* Request Form */}
                <form
                    onSubmit={handleSubmit}
                    // Enter inside the DatePicker (confirming a time) would otherwise submit the form and reset it
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                            e.preventDefault();
                        }
                    }}
                >
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="mb-4 text-base font-semibold text-gray-800">
                            Add Overtime
                        </h3>

                        {/* ConfigProvider raises the popup z-index above the parent Modal's z-[9999] */}
                        <ConfigProvider theme={{ token: { zIndexPopupBase: 10000 } }}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Attendance Date */}
                            <div>
                                <label className={labelClass}>
                                    Attendance Date
                                </label>

                                <DatePicker
                                    name="attendanceDate"
                                    format={DATE_FORMAT}
                                    value={form.attendanceDate}
                                    onChange={handleDateChange("attendanceDate")}
                                    className={`${inputClass} w-full`}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full gap-4 my-4">
                            {/* Start Date and Time */}
                            <div className="w-full md:flex-1">
                                <label className={labelClass}>
                                    Start Date and Time
                                </label>

                                <DatePicker
                                    name="startDateTime"
                                    showTime={{ format: "hh:mm A", use12Hours: true }}
                                    format={DATE_TIME_FORMAT}
                                    value={form.startDateTime}
                                    onChange={handleDateChange("startDateTime")}
                                    className={`${inputClass} w-full`}
                                />
                            </div>

                            {/* End Date and Time */}
                            <div className="w-full md:flex-1">
                                <label className={labelClass}>
                                    End Date and Time
                                </label>

                                <DatePicker
                                    name="endDateTime"
                                    showTime={{ format: "hh:mm A", use12Hours: true }}
                                    format={DATE_TIME_FORMAT}
                                    value={form.endDateTime}
                                    onChange={handleDateChange("endDateTime")}
                                    className={`${inputClass} w-full`}
                                />
                            </div>
                        </div>
                        </ConfigProvider>

                        {/* Remark */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                <span className="text-red-500">*</span> Remark
                            </label>

                            <textarea
                                name="remark"
                                value={form.remark}
                                onChange={handleChange}
                                rows={3}
                                required
                                placeholder="Enter overtime remark..."
                                className={inputClass}
                            />
                        </div>
                        {/* Add Overtime Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FaPlus />
                                {submitting ? "Saving..." : "Add Overtime"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Overtime Table */}
                <div className="mt-6 rounded-lg border border-gray-200">
                    <div className="border-b px-4 py-3">
                        <h3 className="text-base font-semibold text-gray-800">
                            Overtime Requests
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[1400px] w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Actions
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        ID
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Start Date and Time
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        End Date and Time
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Overtime In Minute
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Endorsed by Supervisor
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Approved by Accounting
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Declined
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Remark
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Supervisor Note
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Accounting Note
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {!loading && overtimeRequests.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="px-4 py-10 text-center text-gray-500"
                                        >
                                            No Data
                                        </td>
                                    </tr>
                                )}

                                {loading && (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="px-4 py-10 text-center text-gray-500"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {overtimeRequests.map((item) => {
                                    const endorsedBySupervisor =
                                        item.status === "endorsed" ||
                                        item.status === "approved";
                                    const approvedByAccounting =
                                        item.status === "approved";
                                    const declined = item.status === "declined";

                                    return (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {!endorsedBySupervisor &&
                                                    !declined && (
                                                        <button
                                                            type="button"
                                                            title="Endorse (Supervisor/Leader)"
                                                            onClick={() =>
                                                                handleEndorse(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white hover:bg-amber-600"
                                                        >
                                                            <FaUserCheck />
                                                            Endorse
                                                        </button>
                                                    )}

                                                {endorsedBySupervisor &&
                                                    !approvedByAccounting &&
                                                    !declined && (
                                                        <button
                                                            type="button"
                                                            title="Approve (Accounting)"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white hover:bg-green-600"
                                                        >
                                                            <FaCheck />
                                                            Approve
                                                        </button>
                                                    )}

                                                {!approvedByAccounting &&
                                                    !declined && (
                                                    <button
                                                        type="button"
                                                        title="Decline"
                                                        onClick={() =>
                                                            handleDecline(
                                                                item.id,
                                                                endorsedBySupervisor
                                                                    ? "accounting"
                                                                    : "supervisor",
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                                                    >
                                                        <FaBan />
                                                        Decline
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                            {item.id}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                            {formatDateTime(item.start_at) || "--"}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                            {formatDateTime(item.end_at) || "--"}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                            {item.overtime_minutes}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                            {endorsedBySupervisor
                                                ? "Yes"
                                                : "No"}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                            {approvedByAccounting
                                                ? "Yes"
                                                : "No"}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                            {declined ? "Yes" : "No"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {item.remark || "--"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {item.supervisor_note || "--"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {item.accounting_note || "--"}
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t bg-gray-50 px-6 py-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    Close
                </button>
            </div>
        </>
    );
}
