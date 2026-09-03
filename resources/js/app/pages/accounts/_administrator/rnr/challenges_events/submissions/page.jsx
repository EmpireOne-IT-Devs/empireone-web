import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import CardSection from "./sections/card-section";

export default function Page() {
  return (
    <Layout>
      <RnrLayout>
        <TabsSection>
          <div>
            <CardSection />
          </div>
        </TabsSection>
      </RnrLayout>
    </Layout>
  );
}
