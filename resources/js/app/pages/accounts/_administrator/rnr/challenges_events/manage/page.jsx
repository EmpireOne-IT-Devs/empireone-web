import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import ChallengeTableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/manage/sections/challenge-table-section";

export default function Page() {
  return (
    <Layout>
      <RnrLayout>
        <TabsSection>
          <div>
            <div className="mt-6 space-y-4">
              <ChallengeTableSection />
            </div>
          </div>
        </TabsSection>
      </RnrLayout>
    </Layout>
  );
}
