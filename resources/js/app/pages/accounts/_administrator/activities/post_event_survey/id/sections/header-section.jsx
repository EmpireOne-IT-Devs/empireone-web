import React from "react";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import {
    close_post_event_survey_thunk,
    reopen_post_event_survey_thunk,
    get_post_event_survey_thunk,
} from "@/app/redux/post-event-survey-slice";

export default function HeaderSection({ surveyId }) {
    const dispatch = useDispatch();
    const { selectedSurvey, closing, reopening } = useSelector(
        (state) => state.post_event_surveys
    );
    const { data } = useSelector((state) => state.app);

    const canManage = [1, 11].includes(data?.user?.account_employee?.department_id);

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
        <div className="w-full px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <ClipboardList size={20} />
                    Survey Details
                </div>
            </div>

            {selectedSurvey && canManage && (
                <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={isWorking}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
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
            )}
        </div>
    );
}
