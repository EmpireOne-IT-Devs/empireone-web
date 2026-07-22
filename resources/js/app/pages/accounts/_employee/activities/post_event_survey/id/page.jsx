import React, { useEffect } from "react";
import Layout from "@/app/pages/accounts/layout";
import { useDispatch, useSelector } from "react-redux";
import { get_post_event_survey_thunk } from "@/app/redux/post-event-survey-slice";
import Skeleton from "@/app/_components/skeleton";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { router } from "@inertiajs/react";
import SurveyInfoSection from "./sections/survey-info-section";
import SurveyFormSection from "./sections/survey-form-section";

export default function Page() {
    const id = window.location.pathname.split("/")[5];
    const dispatch = useDispatch();

    const { selectedSurvey, selectedSurveyLoading } = useSelector(
        (state) => state.post_event_surveys
    );

    useEffect(() => {
        dispatch(get_post_event_survey_thunk(id));
    }, [dispatch, id]);

    const handleBack = () => {
        router.visit("/accounts/employee/activities");
    };

    if (selectedSurveyLoading || !selectedSurvey) {
        return (
            <Layout>
                <div className="flex flex-col h-full min-h-0">
                    <div className="w-full px-6 pt-6 pb-4 flex items-center gap-3">
                        <button type="button" onClick={handleBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
                            <ArrowLeft size={16} /> Back
                        </button>
                    </div>
                    <div className="px-6"><Skeleton lines={8} /></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col h-full min-h-0">
                {/* Header */}
                <div className="w-full px-6 pt-6 pb-4 flex items-center gap-3 flex-wrap">
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
                        {selectedSurvey.title}
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-8 flex flex-col gap-5">
                    
                    <SurveyInfoSection survey={selectedSurvey} />
                    <SurveyFormSection
                        surveyId={id}
                        questions={selectedSurvey.questions}
                        hasResponded={selectedSurvey.user_has_responded}
                        isClosed={selectedSurvey.status === "closed"}
                    />
                </div>
            </div>
        </Layout>
    );
}
