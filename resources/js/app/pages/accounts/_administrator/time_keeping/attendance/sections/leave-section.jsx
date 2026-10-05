import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { FaClock, FaXmark, FaPlus } from "react-icons/fa6";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_leave_requests_service,
    get_leave_credits_service,
    create_leave_request_service,
} from "@/app/services/leave-service";
import { DatePicker } from "antd";

const VOLUNTARY_TIME_OFF = "Voluntary Time Off";
const DEDUCTIBLE_TYPES = ["Emergency Leave", "Sick Leave", "Vacation Leave"];

export default function LeaveSection({ date, onSaved }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [credits, setCredits] = useState(null);

    const [form, setForm] = useState({
        attendanceDate: dayjs(date),
        leaveType: "",
        leaveReason: "",
    });

    const DATE_FORMAT = "MM/DD/YYYY";
    const DATE_TIME_FORMAT = "MM/DD/YYYY hh:mm A";

    const leaveTypes = [
        "Emergency Leave",
        "Floating/Temporary Lay-off",
        "Leave of Absence",
        "Magna Carta Leave",
        "Maternity Leave",
        "Paternity Leave",
        "Reduction in Force",
        "Sick Leave",
        "Solo Parent Leave",
        "Suspension Type Example",
        "Vacation Leave",
        "VAWC (Violence Against Women and Children)",
        VOLUNTARY_TIME_OFF,
    ];

    const leaveCredits = credits?.history ?? [];
    const isDeductible = DEDUCTIBLE_TYPES.includes(form.leaveType);
    const noCredits =
        isDeductible && (!credits?.is_regular || credits.balance < 1);

    const inputClass =
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm " +
        "focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";

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

    const fetchLeaveRequests = useCallback(async () => {
        try {
            const res = await get_leave_requests_service(date);
            setLeaveRequests(res.data.data ?? []);
        } catch {
            setLeaveRequests([]);
        }
    }, [date]);

    const fetchCredits = useCallback(async () => {
        try {
            const res = await get_leave_credits_service();
            setCredits(res.data.data);
        } catch {
            setCredits(null);
        }
    }, []);

    useEffect(() => {
        fetchLeaveRequests();
    }, [fetchLeaveRequests]);

    useEffect(() => {
        fetchCredits();
    }, [fetchCredits]);

    const activeLeave = leaveRequests.find((r) => r.status !== "declined");
    const isOnLeave =
        !!activeLeave && activeLeave.leave_type !== VOLUNTARY_TIME_OFF;
    const declinedLeave = leaveRequests.find((r) => r.status === "declined");
    const latestLeave = activeLeave ?? declinedLeave;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        try {
            await create_leave_request_service({
                date: form.attendanceDate.format("YYYY-MM-DD"),
                leave_type: form.leaveType,
                reason: form.leaveReason,
            });

            dispatch(
                setAlert({
                    type: "success",
                    title: "Leave request submitted successfully!",
                }),
            );

            setForm((prev) => ({ ...prev, leaveType: "", leaveReason: "" }));
            fetchLeaveRequests();
            fetchCredits();
            onSaved?.();
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title:
                        err.response?.data?.message ||
                        "Failed to submit leave request.",
                }),
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Leave
                    </h2>

                    <p className="text-sm text-gray-500">
                        Submit and monitor your leave request.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-5">
                {/* Leave Credit */}
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-base font-semibold text-gray-800">
                                Leave Credit
                            </h3>

                            <p className="text-sm text-gray-500">
                                Subject for verification by the HR
                            </p>
                        </div>

                        <div className="text-2xl font-bold text-green-600">
                            {(credits?.balance ?? 0).toFixed(2)}
                        </div>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                        {credits?.is_regular
                            ? `${credits.year} credits: earned ${credits.earned.toFixed(2)} - used ${credits.used} | ${credits.annual_entitlement} days/year, credited monthly (regularized ${moment(credits.regularization_date).format("LL")}).`
                            : "Leave credits start accruing once you are regularized."}
                    </p>
                </div>

                {/* Leave Request Form */}
                <form onSubmit={handleSubmit}>
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="mb-4 text-base font-semibold text-gray-800">
                            Leave Request
                        </h3>

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

                            {/* Leave Type */}
                            <div>
                                <label className={labelClass}>Leave Type</label>

                                <select
                                    name="leaveType"
                                    value={form.leaveType}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">
                                        Please select a Leave Type
                                    </option>

                                    {leaveTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Leave Reason */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Leave Reason
                                </label>

                                <textarea
                                    name="leaveReason"
                                    value={form.leaveReason}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Enter leave reason..."
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {noCredits && (
                            <p className="mt-3 text-sm text-red-600">
                                {credits?.is_regular
                                    ? "Insufficient leave credits for this leave type."
                                    : "Only regular employees can use leave credits."}
                            </p>
                        )}

                        {/* Submit */}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || noCredits}
                                className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60"
                            >
                                <FaPlus />
                                {submitting ? "Submitting..." : "Add Leave"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Leave Status */}
                <div className="mt-6 rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-4 text-base font-semibold text-gray-800">
                        Leave Status
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <StatusItem
                            label="Is On Leave"
                            value={isOnLeave ? "Yes" : "No"}
                        />

                        <StatusItem
                            label="Leave Endorsed"
                            value={
                                latestLeave?.status === "endorsed"
                                    ? "Yes"
                                    : "No"
                            }
                        />

                        <StatusItem
                            label="Leave Approved"
                            value={
                                latestLeave?.status === "approved"
                                    ? "Yes"
                                    : "No"
                            }
                        />

                        <StatusItem
                            label="Leave Declined"
                            value={declinedLeave && !activeLeave ? "Yes" : "No"}
                        />

                        <StatusItem label="Leave Paid Time Off" value="No" />

                        <StatusItem
                            label="Leave Date Filed"
                            value={
                                latestLeave
                                    ? moment(latestLeave.created_at).format(
                                          "LLL",
                                      )
                                    : "No Data"
                            }
                        />
                    </div>
                </div>

                {/* Approval Information */}
                <div className="mt-6 rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-4 text-base font-semibold text-gray-800">
                        Leave Approval Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className={labelClass}>
                                Leave Endorsed By
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
                                Leave Approved By
                            </label>

                            <input
                                type="text"
                                readOnly
                                placeholder="Not yet approved"
                                className={`${inputClass} bg-gray-50`}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Leave Declined By
                            </label>

                            <input
                                type="text"
                                readOnly
                                placeholder="Not declined"
                                className={`${inputClass} bg-gray-50`}
                            />
                        </div>
                    </div>
                </div>

                {/* Leave Credit History */}
                <div className="mt-6 rounded-lg border border-gray-200">
                    <div className="border-b px-4 py-3">
                        <h3 className="text-base font-semibold text-gray-800">
                            Leave Credit History
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-sm">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Date Credited
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Credit
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Note
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">
                                        Deleted
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {leaveCredits.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No leave credits yet.
                                        </td>
                                    </tr>
                                )}

                                {leaveCredits.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-gray-700">
                                            {item.date}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {item.credit}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {item.note || "--"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {item.deleted}
                                        </td>
                                    </tr>
                                ))}
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

function StatusItem({ label, value }) {
    return (
        <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
        </div>
    );
}
