import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import ParticipantsTableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/manage/sections/participants-table-section";

export default function Page() {
    const challengeId = new URLSearchParams(window.location.search).get("id");

    return (
        <Layout>
            <RnrLayout>
                <TabsSection>
                    <div className="mt-6 space-y-4">
                        <ParticipantsTableSection challengeId={challengeId} />
                    </div>
                </TabsSection>
            </RnrLayout>
        </Layout>
    );
}
