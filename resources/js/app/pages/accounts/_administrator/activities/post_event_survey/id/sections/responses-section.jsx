import React, { useState } from "react";
import { export_survey_responses_service } from "@/app/services/post-event-survey-service";
import Table from "@/app/_components/table";
import Select from "@/app/_components/select";
import moment from "moment";
import EmployeeAnswerViewer from "./employee-answer-viewer";
import PaginationSection from "./pagination-section";
import Button from "@/app/_components/button";
import { Star, Download } from "lucide-react";

const STATUS_STYLES = {
    Completed: "bg-green-100 text-green-600",
    Pending:   "bg-yellow-100 text-yellow-600",
};

// Long free-text answers (paragraph/short answer) collapse to a fixed-width, clamped block with a toggle.
const LONG_TEXT_THRESHOLD = 160;

function WrappedTextAnswer({ text }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > LONG_TEXT_THRESHOLD;

    return (
        <div className="w-64">
            <p
                className={`whitespace-pre-wrap break-words text-sm text-gray-700 ${
                    isLong && !expanded ? "line-clamp-4" : ""
                }`}
            >
                {text}
            </p>
            {isLong && (
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-1 text-xs font-semibold text-orange-500 hover:underline"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
}

// Renders a raw stored answer according to its question type (rating stars, checkbox list, or wrapped text).
const formatQuestionAnswer = (question, rawAnswer) => {
    if (rawAnswer === undefined || rawAnswer === null || rawAnswer === "") {
        return <span className="text-gray-300">—</span>;
    }

    if (question.question_type === "rating") {
        const rating = Number(rawAnswer);
        if (!Number.isNaN(rating) && rating >= 1 && rating <= 5) {
            return (
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            size={13}
                            className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                        />
                    ))}
                </div>
            );
        }
        return rawAnswer;
    }

    if (question.question_type === "checkboxes") {
        try {
            const parsed = JSON.parse(rawAnswer);
            return <WrappedTextAnswer text={Array.isArray(parsed) ? parsed.join(", ") : rawAnswer} />;
        } catch {
            return <WrappedTextAnswer text={rawAnswer} />;
        }
    }

    if (question.question_type === "paragraph" || question.question_type === "short_answer") {
        return <WrappedTextAnswer text={String(rawAnswer)} />;
    }

    return rawAnswer;
};

export default function ResponsesSection({
    surveyId,
    responses,
    selectedSite,
    setSelectedSite,
    setCurrentPage,
    updateQueryParams,
    responsesLoading,
}) {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await export_survey_responses_service(surveyId, selectedSite);
            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `survey_${surveyId}_responses${selectedSite ? `_site_${selectedSite}` : ""}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } finally {
            setExporting(false);
        }
    };

  

    const {
        total_responses = 0,
        response_tracker = [],
        response_tracker_pagination,
        questions = [],
        sites = [],
    } = responses ?? {};

    const surveyQuestions = questions;
    const siteNames = Array.isArray(sites)
        ? sites
        : [...new Set(
              response_tracker
                  .map((row) => row.site)
                  .filter((site) => site && site !== "N/A")
          )].sort((a, b) => a.localeCompare(b));
    const siteOptions = [
        { label: "All Sites", value: "" },
        ...siteNames.map((site) => ({ label: site, value: site })),
    ];

    // Every survey question is surfaced as its own column, mirroring a spreadsheet response sheet.
    const questionColumns = surveyQuestions.map((question) => ({
        header: question.question_text,
        accessor: `question_${question.id}`,
        width: "w-64 align-top",
    }));

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Employee", accessor: "employee_name" },
        { header: "Site", accessor: "site" },
        { header: "Program / Department", accessor: "program_department" },
        { header: "Email", accessor: "email" },
        ...questionColumns,
        { header: "Status", accessor: "status" },
        { header: "Submitted At", accessor: "submitted_at" },
        // { header: "Action", accessor: "view_survey" },
    ];

    const tableData = response_tracker.map((row) => {
        const questionAnswers = {};
        surveyQuestions.forEach((question) => {
            questionAnswers[`question_${question.id}`] = formatQuestionAnswer(
                question,
                row.answers?.[question.id]
            );
        });

        return {
            ...row,
            ...questionAnswers,
            site: row.site || 'N/A',
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
        };
    });

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-700">Employee Response Tracker</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-48">
                            <Select
                                name="site_filter"
                                label="Site"
                                options={siteOptions}
                                value={selectedSite}
                                onChange={(value) => {
                                    setSelectedSite(value);
                                    setCurrentPage(1);
                                    updateQueryParams({
                                        site: value || null,
                                        page: "1",
                                    });
                                }}
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleExport}
                            disabled={responsesLoading || exporting || total_responses === 0}
                            className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
                        >
                            <Download size={14} />
                            {exporting ? "Exporting…" : "Export Responses"}
                        </Button>
                    </div>
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
                            <Table
                                columns={columns}
                                data={tableData}
                                isloading={responsesLoading}
                            />
                            {!responsesLoading && tableData.length === 0 && (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">
                                    {selectedSite ? "No employees found for this site." : "No employees found."}
                                </p>
                            )}
                            <div className="mt-4">
                                <PaginationSection
                                    data={response_tracker_pagination}
                                    onPageChange={(page) => {
                                        setCurrentPage(page);
                                        updateQueryParams({ page: String(page) });
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
        </div>
    );
}
