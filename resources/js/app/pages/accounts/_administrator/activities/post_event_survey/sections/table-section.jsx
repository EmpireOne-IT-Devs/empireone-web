import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_post_event_surveys_thunk } from "@/app/redux/post-event-survey-slice";
import OpenSurveySection from "./open-survey-section";
import Skeleton from "@/app/_components/skeleton";
import Table from "@/app/_components/table";
import moment from "moment";

const categoryColors = {
    "Events Calendar": "bg-indigo-100 text-indigo-600",
};

const isEventSurvey = (survey) => {
    const category = String(survey?.event?.category ?? "").trim().toLowerCase();
    return category === "events calendar" || category === "event";
};

const columns = [
    { header: "Event ID", accessor: "event_id" },
    { header: "Event", accessor: "event" },
    { header: "Category", accessor: "category" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
    { header: "Survey", accessor: "survey" },
];

const buildRows = (surveys = []) =>
    surveys.filter(isEventSurvey).map((survey) => ({
        event_id: (
            <span className="text-sm text-gray-600">
                {`SID-${String(survey.id).padStart(2, "0")}`}
            </span>
        ),

        event: (
            <div>
                <p className="font-semibold text-gray-900">
                    {survey.event?.headline ?? "—"}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                    {survey.title ?? "No Title"}
                </p>
            </div>
        ),

        category: (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                    categoryColors[survey.event?.category] ??
                    "bg-gray-100 text-gray-500"
                }`}
            >
                {survey.event?.category ?? "—"}
            </span>
        ),

        date: (
            <span className="text-sm text-gray-600">
                {survey.published_at
                    ? moment(survey.published_at).format("MMM DD, YYYY")
                    : "—"}
            </span>
        ),

        status: (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    survey.status === "published"
                        ? "bg-green-100 text-green-600"
                        : survey.status === "draft"
                          ? "bg-yellow-100 text-yellow-600"
                          : survey.status === "closed"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                }`}
            >
                {survey.status === "published"
                    ? "Published"
                    : survey.status === "closed"
                      ? "Closed"
                      : survey.status === "draft"
                        ? "Draft"
                        : survey.status ?? "Unknown"}
            </span>
        ),

        // Cleaned up to use the dedicated standalone component
        survey: <OpenSurveySection survey={survey} />,
    }));

export default function TableSection() {
    const dispatch = useDispatch();

    const { surveys = [], surveysLoading = false } = useSelector(
        (state) => state.post_event_surveys,
    );

    useEffect(() => {
        dispatch(get_post_event_surveys_thunk());
    }, [dispatch]);

    return (
        <div className="mt-3">
            {surveysLoading ? (
                <div className="py-8 text-center text-sm text-gray-400">
                    <Skeleton variant="table" />
                </div>
            ) : (
                <Table columns={columns} data={buildRows(surveys)} />
            )}
        </div>
    );
}
