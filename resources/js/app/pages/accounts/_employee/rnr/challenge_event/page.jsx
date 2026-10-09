import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import ChallengeEventSection from "./sections/challenge-event-section";
import ManagerViewSection from "./sections/manager-view-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function Page() {
    const { isReady, isContentManager } = useCurrentEmployee();

    return (
        <Layout>
            <RnrLayout>
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
