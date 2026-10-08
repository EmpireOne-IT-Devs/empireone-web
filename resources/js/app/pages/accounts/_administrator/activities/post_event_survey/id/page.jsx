import React, { useEffect, useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import ActivitiesLayout from "../../layout";
import { useDispatch, useSelector } from "react-redux";
import {
    get_post_event_survey_thunk,
    get_survey_responses_thunk,
} from "@/app/redux/post-event-survey-slice";
import Skeleton from "@/app/_components/skeleton";
import HeaderSection from "./sections/header-section";
import SurveyInfoSection from "./sections/survey-info-section";
import QuestionsSection from "./sections/questions-section";
import ResponsesSection from "./sections/responses-section";
import SurveyFormSection from "./sections/survey-form-section";
import SummaryCardSection from "./sections/summary-card-section";
import SentimentOverviewSection from "./sections/sentiment-overview-section";
import ProgressBarSection from "./sections/progress-bar-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function Page() {
    const id = window.location.pathname.split("/")[5];
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedSite, setSelectedSite] = useState(
        new URLSearchParams(window.location.search).get("site") || "",
    );
    const [currentPage, setCurrentPage] = useState(
        Number(new URLSearchParams(window.location.search).get("page") || 1),
    );

    const {
        selectedSurvey,
        selectedSurveyLoading,
        responses,
        responsesLoading,
    } = useSelector((state) => state.post_event_surveys);
    const { isReady, isContentManager: canManage } = useCurrentEmployee();

    useEffect(() => {
        dispatch(get_post_event_survey_thunk(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (!canManage || activeTab !== 1) {
            return;
        }

        dispatch(
            get_survey_responses_thunk({
                id,
                page: currentPage,
                site: selectedSite || undefined,
            }),
        );
    }, [activeTab, canManage, currentPage, dispatch, id, selectedSite]);

    const updateQueryParams = (updates) => {
        const params = new URLSearchParams(window.location.search);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        const query = params.toString();
        const url = query
            ? `${window.location.pathname}?${query}`
            : window.location.pathname;
        window.history.replaceState({}, "", url);
    };

    // Only departments 1 & 11 get full management access (Questions preview + Responses analytics).
    const TABS = canManage
        ? ["Questions", "Responses", "Answer Survey"]
        : ["Answer Survey"];

    // Wait for the user data too, so the tab set doesn't flicker between roles.
    if (selectedSurveyLoading || !selectedSurvey || !isReady) {
        return (
            <Layout>
                <ActivitiesLayout>
                    <HeaderSection surveyId={id} />
                    <div className="px-6 space-y-6">
                        <Skeleton variant="text" lines={3} />
                        <div className="grid grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} variant="card" />
                            ))}
                        </div>
                        <Skeleton variant="table" lines={5} />
                    </div>
                </ActivitiesLayout>
            </Layout>
        );
    }

    return (
        <Layout>
            <ActivitiesLayout>
                <div className="flex flex-col h-full min-h-0">
                    <div className="sticky top-0 z-10">
                           <HeaderSection surveyId={id} />
                    </div>
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
                            <QuestionsSection
                                questions={selectedSurvey.questions}
                            />
                        )}
                        {canManage && activeTab === 1 && (
                            <>
                                <SummaryCardSection
                                    totalEmployees={
                                        responses?.total_employees ?? 0
                                    }
                                    totalResponses={
                                        responses?.total_responses ?? 0
                                    }
                                    participationRate={
                                        responses?.participation_rate ?? 0
                                    }
                                />
                                <SentimentOverviewSection
                                    sentimentStats={
                                        responses?.sentiment_overview
                                    }
                                />
                                <ProgressBarSection
                                    totalEmployees={
                                        responses?.total_employees ?? 0
                                    }
                                    totalResponses={
                                        responses?.total_responses ?? 0
                                    }
                                    participationRate={
                                        responses?.participation_rate ?? 0
                                    }
                                />
                                <ResponsesSection
                                    surveyId={id}
                                    responses={responses}
                                    responsesLoading={responsesLoading}
                                    selectedSite={selectedSite}
                                    setSelectedSite={setSelectedSite}
                                    setCurrentPage={setCurrentPage}
                                    updateQueryParams={updateQueryParams}
                                />
                            </>
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
