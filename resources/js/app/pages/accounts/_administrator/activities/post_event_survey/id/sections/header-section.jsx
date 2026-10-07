import React from "react";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import {
    close_post_event_survey_thunk,
    reopen_post_event_survey_thunk,
    get_post_event_survey_thunk,
} from "@/app/redux/post-event-survey-slice";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function HeaderSection({ surveyId }) {
    const dispatch = useDispatch();
    const { selectedSurvey, closing, reopening } = useSelector(
        (state) => state.post_event_surveys
    );
    const { isReady, isContentManager: canManage } = useCurrentEmployee();

    const handleBack = () => {
        const account_role = window.location.pathname.split("/")[2];
        router.visit(`/accounts/${account_role}/activities/post_event_survey`);
    };

    const handleToggleStatus = async () => {
        if (!selectedSurvey) return;
        if (selectedSurvey.status === "closed") {
            await dispatch(reopen_post_event_survey_thunk(surveyId));
        } else {
            await dispatch(close_post_event_survey_thunk(surveyId));
        }
        dispatch(get_post_event_survey_thunk(surveyId));
    };

    const isClosed = selectedSurvey?.status === "closed";
    const isWorking = closing || reopening;

    return (
        <div className="w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition shrink-0 py-1 -ml-1 pr-1"
                    aria-label="Go back"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
                <span className="text-gray-300 shrink-0">|</span>
                <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-800 min-w-0">
                    <ClipboardList size={20} className="shrink-0" />
                    <span className="truncate">Survey Details</span>
                </div>
            </div>

            {selectedSurvey &&
                (!isReady ? (
                    <div className="h-10 sm:h-9 w-full sm:w-32 animate-pulse rounded-lg bg-gray-200" />
                ) : (
                    canManage && (
                        <button
                            type="button"
                            onClick={handleToggleStatus}
                            disabled={isWorking}
                            className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
                                isClosed
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                        >
                            {isWorking
                                ? "Updating…"
                                : isClosed
                                ? "Reopen Survey"
                                : "Close Survey"}
                        </button>
                    )
                ))}
        </div>
    );
}