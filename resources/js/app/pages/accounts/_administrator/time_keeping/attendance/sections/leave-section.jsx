import React, { useState } from "react";
import { FaClock, FaXmark, FaPlus } from "react-icons/fa6";

export default function LeaveSection() {
    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        attendanceDate: "2026-09-19",
        leaveType: "",
        leaveReason: "",
    });

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
    ];

    const leaveCredits = [
        {
            date: "2026-08-31 12:00 AM",
            credit: "0.42",
            note: "",
            deleted: "No",
        },
        {
            date: "2026-07-31 12:00 AM",
            credit: "0.42",
            note: "",
            deleted: "No",
        },
        {
            date: "2026-06-30 12:00 AM",
            credit: "0.42",
            note: "",
            deleted: "No",
        },
        {
            date: "2026-05-31 12:00 AM",
            credit: "0.42",
            note: "",
            deleted: "No",
        },
        {
            date: "2026-04-30 12:00 AM",
            credit: "0.42",
            note: "",
            deleted: "No",
        },
        {
            date: "2026-03-31 12:00 AM",
            credit: "0.42",
            note: "",
            deleted: "No",
        },
        {
            date: "2026-02-04 12:00 AM",
            credit: "0.42",
            note: "",
            deleted: "No",
        },
    ];

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

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Leave Request:", form);

        // Add your API request here
        // Example:
        // dispatch(createLeaveRequest(form));

        setIsOpen(false);
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
                            2.94
                        </div>
                    </div>
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

                                <input
                                    type="date"
                                    name="attendanceDate"
                                    value={form.attendanceDate}
                                    onChange={handleChange}
                                    className={inputClass}
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

                        {/* Submit */}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                            >
                                <FaPlus />
                                Add Leave
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
                        <StatusItem label="Is On Leave" value="No" />

                        <StatusItem label="Leave Endorsed" value="No" />

                        <StatusItem label="Leave Approved" value="No" />

                        <StatusItem label="Leave Declined" value="No" />

                        <StatusItem label="Leave Paid Time Off" value="No" />

                        <StatusItem label="Leave Date Filed" value="No Data" />
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
