import React, { useEffect } from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import { useDispatch, useSelector } from "react-redux";
import { get_post_event_surveys_thunk } from "@/app/redux/post-event-survey-slice";
import { router } from "@inertiajs/react";
import { TbFileText } from "react-icons/tb";
import { ClipboardList } from "lucide-react";
import Skeleton from "@/app/_components/skeleton";
import Table from "@/app/_components/table";
import moment from "moment";

const STATUS_STYLES = {
    published: "bg-green-100 text-green-600",
    draft: "bg-yellow-100 text-yellow-600",
    closed: "bg-red-100 text-red-600",
};

const categoryColors = {
    "Events Calendar": "bg-indigo-100 text-indigo-600",
};

const isEventSurvey = (survey) => {
    const category = String(survey?.event?.category ?? "").trim().toLowerCase();
    return category === "events calendar" || category === "event";
};

const columns = [
    { header: "Survey", accessor: "survey" },
    { header: "Event", accessor: "event" },
    { header: "Category", accessor: "category" },
    { header: "Published", accessor: "published" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
];

function OpenButton({ survey }) {
    return (
        <button
            type="button"
            onClick={() => router.visit(`/accounts/employee/activities/post_event_survey/${survey.id}`)}
            className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-orange-600"
        >
            <TbFileText className="text-base" />
            Open
        </button>
    );
}

const buildRows = (surveys = []) =>
    surveys.filter(isEventSurvey).map((survey) => ({
        survey: (
            <div>
                <p className="font-semibold text-gray-900">{survey.title ?? "—"}</p>
                <p className="mt-0.5 text-xs text-gray-400">{`SID-${String(survey.id).padStart(2, "0")}`}</p>
            </div>
        ),
        event: <span className="text-sm text-gray-600">{survey.event?.headline ?? "—"}</span>,
        category: (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[survey.event?.category] ?? "bg-gray-100 text-gray-500"}`}>
                {survey.event?.category ?? "—"}
            </span>
        ),
        published: (
            <span className="text-sm text-gray-600">
                {survey.published_at ? moment(survey.published_at).format("MMM DD, YYYY") : "—"}
            </span>
        ),
        status: (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[survey.status] ?? "bg-gray-100 text-gray-600"}`}>
                {survey.status ?? "—"}
            </span>
        ),
        action: <OpenButton survey={survey} />,
    }));

export default function Page() {
    const dispatch = useDispatch();
    const { surveys = [], surveysLoading = false } = useSelector(
        (state) => state.post_event_surveys,
    );

    useEffect(() => {
        dispatch(get_post_event_surveys_thunk());
    }, [dispatch]);

    return (
        <Layout>
            <ActivitiesLayout>
                <div className="h-full overflow-y-auto pr-1">
                    {surveysLoading ? (
                        <div className="px-2 py-4"><Skeleton lines={5} /></div>
                    ) : surveys.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <ClipboardList size={36} className="text-gray-300" />
                            <p className="text-sm text-gray-400">No post-event surveys available.</p>
                        </div>
                    ) : (
                        <div className="mt-3">
                            <Table columns={columns} data={buildRows(surveys)} />
                        </div>
                    )}
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
