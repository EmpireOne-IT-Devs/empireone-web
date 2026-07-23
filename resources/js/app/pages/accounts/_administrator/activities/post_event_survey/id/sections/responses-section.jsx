import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_survey_responses_thunk } from "@/app/redux/post-event-survey-slice";
import Skeleton from "@/app/_components/skeleton";
import Table from "@/app/_components/table";
import moment from "moment";
import EmployeeAnswerViewer from "./employee-answer-viewer";
import Button from "@/app/_components/button";

const STATUS_STYLES = {
    Completed: "bg-green-100 text-green-600",
    Pending:   "bg-yellow-100 text-yellow-600",
};

export default function ResponsesSection({ surveyId }) {
    const dispatch = useDispatch();
    const { responses, responsesLoading } = useSelector(
        (state) => state.post_event_surveys
    );
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        dispatch(get_survey_responses_thunk(surveyId));
    }, [dispatch, surveyId]);

    if (responsesLoading || !responses) {
        return <Skeleton lines={6} />;
    }

    const { total_employees, total_responses, participation_rate, response_tracker, sentiment_overview } = responses;
    const sentimentStats = sentiment_overview ?? {
        average_rating: 0,
        positive: { count: 0, percentage: 0 },
        neutral: { count: 0, percentage: 0 },
        negative: { count: 0, percentage: 0 },
    };

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Employee", accessor: "employee_name" },
        { header: "Program / Department", accessor: "program_department" },
        { header: "Email", accessor: "email" },
        { header: "Status", accessor: "status" },
        { header: "Submitted At", accessor: "submitted_at" },
        { header: "Action", accessor: "view_survey" },
    ];

    const tableData = response_tracker.map((row) => ({
        ...row,
        program_department: row.program_department || 'N/A',
        status: (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[row.status] ?? "bg-gray-100 text-gray-500"}`}>
                {row.status}
            </span>
        ),
        submitted_at: row.submitted_at
            ? moment(row.submitted_at).format("MMM DD, YYYY")
            : "—",
        view_survey: (
            <Button
                type="button"
                onClick={() => setSelectedUserId(row.user_id)}
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
            >
                View
            </Button>
        ),
    }));

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

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-gray-700">Survey Sentiment Overview</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-mono">Based on submitted survey responses</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-amber-500">
                            <span className="text-lg">⭐</span>
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Average Rating</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">
                            {Number(sentimentStats.average_rating ?? 0).toFixed(1)}
                            <span className="ml-1 text-sm font-medium text-gray-400">/ 5</span>
                        </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide">Positive</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">{sentimentStats.positive?.percentage ?? 0}%</p>
                        <p className="text-sm text-gray-500">{sentimentStats.positive?.count ?? 0} Responses</p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-amber-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide">Neutral</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">{sentimentStats.neutral?.percentage ?? 0}%</p>
                        <p className="text-sm text-gray-500">{sentimentStats.neutral?.count ?? 0} Responses</p>
                    </div>

                    <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-rose-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide">Negative</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">{sentimentStats.negative?.percentage ?? 0}%</p>
                        <p className="text-sm text-gray-500">{sentimentStats.negative?.count ?? 0} Responses</p>
                    </div>
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
                <div className="p-4">
                    {selectedUserId ? (
                        <EmployeeAnswerViewer
                            surveyId={surveyId}
                            userId={selectedUserId}
                            onClose={() => setSelectedUserId(null)}
                        />
                    ) : (
                        <>
                            <Table columns={columns} data={tableData} />
                            {response_tracker.length === 0 && (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">
                                    No employees found.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
