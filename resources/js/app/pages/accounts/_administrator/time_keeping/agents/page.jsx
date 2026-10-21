import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import AgentsTableSection from "./sections/agents-table-section";

export default function page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <AgentsTableSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
