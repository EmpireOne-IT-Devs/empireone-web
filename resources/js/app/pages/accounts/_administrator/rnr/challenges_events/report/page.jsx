import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import ExportChallengeSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/report/sections/export-challenge-section";
import HistoricalTrendSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/report/sections/historical-trend-section";

export default function Page() {
  return (
    <Layout>
      <RnrLayout>
        <TabsSection>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mt-6">
            <ExportChallengeSection />
            <HistoricalTrendSection />
          </div>
        </TabsSection>
      </RnrLayout>
    </Layout>
  );
}
