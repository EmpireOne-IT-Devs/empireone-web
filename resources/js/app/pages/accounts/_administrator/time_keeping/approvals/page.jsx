import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import ApprovalsTableSection from "./sections/approvals-table-section";

export default function page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <ApprovalsTableSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
