import React, { useState } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";

export default function OvertimeSection() {
    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        attendanceDate: "2026-09-19",
        startDateTime: "",
        endDateTime: "",
        remark: "",
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Overtime Request:", form);

        // Add your API request here
        // Example:
        // dispatch(createOvertimeRequest(form));

        setIsOpen(false);
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
                <form onSubmit={handleSubmit}>
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="mb-4 text-base font-semibold text-gray-800">
                            Add Overtime
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

                            {/* Start Date and Time */}
                            <div>
                                <label className={labelClass}>
                                    Start Date and Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="startDateTime"
                                    value={form.startDateTime}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* End Date and Time */}
                            <div>
                                <label className={labelClass}>
                                    End Date and Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="endDateTime"
                                    value={form.endDateTime}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Remark */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    <span className="text-red-500">*</span>{" "}
                                    Remark
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
                        </div>

                        {/* Add Overtime Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                            >
                                <FaPlus />
                                Add Overtime
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
                                        Approved by HR
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
                                        HR/Admin Note
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td
                                        colSpan={11}
                                        className="px-4 py-10 text-center text-gray-500"
                                    >
                                        No Data
                                    </td>
                                </tr>
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
