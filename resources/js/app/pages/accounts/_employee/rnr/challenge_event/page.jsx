import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import ChallengeEventSection from "./sections/challenge-event-section";
import ManagerViewSection from "./sections/manager-view-section";
import TeamChallengeUploadSection from "./sections/team-challenge-upload-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";
import { get_my_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";

export default function Page() {
    const { isReady, isContentManager } = useCurrentEmployee();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isReady) dispatch(get_my_engagement_reward_challenges_thunk());
    }, [dispatch, isReady]);

    return (
        <Layout>
            <RnrLayout>
                <TeamChallengeUploadSection />
                {!isReady ? (
                    <div className="mt-6 space-y-4 px-4 sm:px-6 lg:px-8">
                        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
                        <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />
                    </div>
                ) : isContentManager ? (
                    <ManagerViewSection />
                ) : (
                    <ChallengeEventSection />
                )}
            </RnrLayout>
        </Layout>
    );
}
