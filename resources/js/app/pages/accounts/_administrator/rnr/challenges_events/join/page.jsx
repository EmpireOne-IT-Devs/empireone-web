import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import ChallengeEventSection from "@/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-event-section";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { get_my_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";

export default function Page() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(get_my_engagement_reward_challenges_thunk());
    }, [dispatch]);

    return (
        <Layout>
            <RnrLayout>
                <TabsSection>
                    <div className="mt-2"> <ChallengeEventSection /></div>
                   
                </TabsSection>
            </RnrLayout>
        </Layout>
    );
}
