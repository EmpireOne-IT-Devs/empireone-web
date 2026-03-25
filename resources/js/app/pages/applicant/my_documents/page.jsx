import React from "react";
import Layout from "../layout";
import TableSection from "./_sections/table-section";
import HeaderSection from "./_sections/header-section";
import SearchSection from "./_sections/search-section";
import StatsSection from "./_sections/stats-section";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <SearchSection />
            <StatsSection />
            <TableSection />
        </Layout>
    );
}
