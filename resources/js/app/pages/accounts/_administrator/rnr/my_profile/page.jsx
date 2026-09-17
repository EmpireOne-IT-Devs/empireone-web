import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import PointsSummarySection from "@/app/pages/accounts/_employee/rnr/my_profile/sections/points-summary-section";

export default function Page() {
    return (
        <Layout>
            <RnrLayout>
                <PointsSummarySection />
            </RnrLayout>
        </Layout>
    );
}
