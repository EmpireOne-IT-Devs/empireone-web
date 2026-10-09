import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";
import CardSection from "@/app/pages/accounts/_administrator/rnr/employee_profiles/sections/card-secrtion";
import TableSection from "@/app/pages/accounts/_administrator/rnr/employee_profiles/sections/table-section";
import { get_engagement_reward_challenge_employee_profiles_thunk } from "@/app/redux/engagement-thunk";

export default function Page() {
    const dispatch = useDispatch();
    const { isReady, isContentManager } = useCurrentEmployee();

    useEffect(() => {
        if (isContentManager) {
            dispatch(get_engagement_reward_challenge_employee_profiles_thunk());
        }
    }, [dispatch, isContentManager]);

    useEffect(() => {
        if (!isReady || isContentManager) {
            return;
        }
        const fallbackPath = "/accounts/employee/rnr/peer_recognition";
        if (window.location.pathname !== fallbackPath) {
            window.location.replace(fallbackPath);
        }
    }, [isReady, isContentManager]);

    return (
        <Layout>
            <RnrLayout>
                {!isReady ? (
                    <div className="h-20 w-full animate-pulse rounded-lg bg-gray-200" />
                ) : isContentManager ? (
                    <div className="space-y-4">
                        <CardSection />
                        <TableSection />
                    </div>
                ) : null}
            </RnrLayout>
        </Layout>
    );
}