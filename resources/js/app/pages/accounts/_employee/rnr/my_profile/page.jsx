import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import PointsSummarySection from "./sections/points-summary-section";

export default function Page() {
    return (
        <Layout>
            <RnrLayout>
                <PointsSummarySection />
            </RnrLayout>
        </Layout>
    );
}
