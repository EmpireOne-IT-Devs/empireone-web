import React from "react";
import TopParticipantSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/top-participant-section";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import FilterChallengeLeaderboardSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/filter-challenge-leaderboard-section";
import ParticipantTableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/participant-table-section";

export default function Page() {
    return (
        <Layout>
            <RnrLayout>
                <TabsSection>
                    <div className="space-y-2">
                        <FilterChallengeLeaderboardSection />

                        <TopParticipantSection />
                        <ParticipantTableSection />
                    </div>
                </TabsSection>
            </RnrLayout>
        </Layout>
    );
}
