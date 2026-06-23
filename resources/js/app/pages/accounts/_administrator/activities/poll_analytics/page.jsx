import React from "react";
import ActivitiesLayout from "../layout";
import Layout from "../../../layout";
import HeaderSection from "./sections/header-section";
import PollTableSection from "./sections/poll-table-section";
import PollStatsCard from "./sections/poll-stats-card";
import SearchSection from "./sections/search-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div>
                    <HeaderSection />
                    <PollStatsCard />
                    <SearchSection />
                    <PollTableSection />
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
