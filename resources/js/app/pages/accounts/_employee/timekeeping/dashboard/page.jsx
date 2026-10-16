import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import DashboardSection from "../sections/dashboard-section";

export default function Page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <DashboardSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
