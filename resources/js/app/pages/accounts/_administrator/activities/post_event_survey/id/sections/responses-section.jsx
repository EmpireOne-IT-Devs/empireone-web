import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_survey_responses_thunk } from "@/app/redux/post-event-survey-slice";
import Skeleton from "@/app/_components/skeleton";

const STATUS_STYLES = {
    Completed: "bg-green-100 text-green-600",
    Pending:   "bg-yellow-100 text-yellow-600",
};

export default function ResponsesSection({ surveyId }) {
    const dispatch = useDispatch();
    const { responses, responsesLoading } = useSelector(
        (state) => state.post_event_surveys
    );

    useEffect(() => {
        dispatch(get_survey_responses_thunk(surveyId));
    }, [dispatch, surveyId]);

    if (responsesLoading || !responses) {
        return <Skeleton lines={6} />;
    }

    const { total_employees, total_responses, participation_rate, response_tracker } = responses;

    return (
        <div className="flex flex-col gap-5">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-gray-800">{total_employees}</p>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-mono">Total Employees</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-green-600">{total_responses}</p>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-mono">Responded</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-blue-600">{participation_rate}%</p>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-mono">Participation Rate</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Completion Progress</span>
                    <span>{total_responses} / {total_employees}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${participation_rate}%` }}
                    />
                </div>
            </div>

            {/* Response tracker table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700">Employee Response Tracker</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide font-mono">
                            <tr>
                                <th className="px-5 py-3 text-left">Employee</th>
                                <th className="px-5 py-3 text-left">Email</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-left">Submitted At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {response_tracker.map((row) => (
                                <tr key={row.user_id} className="hover:bg-gray-50 transition">
                                    <td className="px-5 py-3 font-medium text-gray-800">
                                        {row.employee_name}
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">{row.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[row.status] ?? "bg-gray-100 text-gray-500"}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">
                                        {row.submitted_at ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {response_tracker.length === 0 && (
                        <p className="px-5 py-6 text-sm text-gray-400 text-center">
                            No employees found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
