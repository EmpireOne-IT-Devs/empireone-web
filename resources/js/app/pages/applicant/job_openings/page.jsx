import React from "react";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import JobPostingCardSection from "./sections/job-posting-card-section";
import Layout from "../layout";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <SearchSection />
            <JobPostingCardSection />
        </Layout>
    );
}
