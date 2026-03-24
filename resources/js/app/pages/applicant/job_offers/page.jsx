import React from "react";
import HeaderSection from "./sections/header-section";
import JobOfferTableSection from "./sections/job-offer-table-section";
import Layout from "../layout";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />

            <JobOfferTableSection />
        </Layout>
    );
}
