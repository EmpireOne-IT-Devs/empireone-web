import React, { useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "@/app/pages/accounts/_administrator/rnr/layout";
import TabsSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/tabs-section";
import CardSection from "./sections/card-section";
import TableSection from "./sections/table-section";
import SearchSection from "./sections/search-section";

export default function Page() {
  const [submissionType, setSubmissionType] = useState("individual");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    challenge_id: "",
    location_id: "",
  });

  return (
    <Layout>
      <RnrLayout>
        <TabsSection>
          <div>
            <CardSection />
            <SearchSection
              filters={filters}
              setFilters={setFilters}
              submissionType={submissionType}
            />
            <TableSection
              filters={filters}
              submissionType={submissionType}
              setSubmissionType={setSubmissionType}
            />
          </div>
        </TabsSection>
      </RnrLayout>
    </Layout>
  );
}
