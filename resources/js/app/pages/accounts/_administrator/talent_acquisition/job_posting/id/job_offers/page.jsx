import Layout from "@/app/pages/accounts/layout";
import React from "react";
import LayoutActiveJobPostingID from "../layout";
import BackSection from "../_sections/back-section";
import TableSection from "./_sections/table-section";
import HeaderSection from "./_sections/header-section";

export default function Page() {
    return (
        <Layout>
            <BackSection />
            <LayoutActiveJobPostingID>
                <HeaderSection />
                <TableSection />
            </LayoutActiveJobPostingID>
        </Layout>
    );
}
