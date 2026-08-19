import React, { useEffect, useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import ActivitiesLayout from "../../layout";
import { useDispatch, useSelector } from "react-redux";
import { get_post_event_survey_thunk } from "@/app/redux/post-event-survey-slice";
import Skeleton from "@/app/_components/skeleton";
import HeaderSection from "./sections/header-section";
import SurveyInfoSection from "./sections/survey-info-section";
import QuestionsSection from "./sections/questions-section";
import ResponsesSection from "./sections/responses-section";
import SurveyFormSection from "./sections/survey-form-section";

export default function Page() {
    const id = window.location.pathname.split("/")[5];
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);

    const { selectedSurvey, selectedSurveyLoading } = useSelector(
        (state) => state.post_event_surveys
    );
    const { data } = useSelector((state) => state.app);

    useEffect(() => {
        dispatch(get_post_event_survey_thunk(id));
    }, [dispatch, id]);

    // Only departments 1 & 11 get full management access (Questions preview + Responses analytics).
    const canManage = [1, 11].includes(data?.user?.account_employee?.department_id);

    const TABS = canManage
        ? ["Questions", "Responses", "Answer Survey"]
        : ["Answer Survey"];

    if (selectedSurveyLoading || !selectedSurvey) {
        return (
            <Layout>
                <ActivitiesLayout>
                    <HeaderSection surveyId={id} />
                    <div className="px-6">
                        <Skeleton variant="text" />
                    </div>
                </ActivitiesLayout>
            </Layout>
        );
    }

    return (
        <Layout>
            <ActivitiesLayout>
                <div className="flex flex-col h-full min-h-0">
                    <HeaderSection surveyId={id} />
                    <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-5">
                        <SurveyInfoSection survey={selectedSurvey} />

                        <div className="flex gap-2">
                            {TABS.map((tab, idx) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(idx)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        activeTab === idx
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {canManage && activeTab === 0 && (
                            <QuestionsSection questions={selectedSurvey.questions} />
                        )}
                        {canManage && activeTab === 1 && (
                            <ResponsesSection surveyId={id} />
                        )}
                        {/* "Answer Survey" tab: index 2 for managers, index 0 for everyone else */}
                        {activeTab === (canManage ? 2 : 0) && (
                            <SurveyFormSection surveyId={id} />
                        )}
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}

