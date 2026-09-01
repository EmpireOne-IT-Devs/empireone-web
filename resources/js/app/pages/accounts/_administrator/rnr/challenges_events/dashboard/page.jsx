import React from "react";
import HeaderSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/header-section";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import AllChallengesSection from "./sections/all-challenges-section";

export default function Page() {
    return (
        <Layout>
            <RnrLayout>
                <TabsSection>
                    <div>
                     <HeaderSection />
                     <AllChallengesSection />
                    </div>
                </TabsSection>
            </RnrLayout>
        </Layout>
    );
}
