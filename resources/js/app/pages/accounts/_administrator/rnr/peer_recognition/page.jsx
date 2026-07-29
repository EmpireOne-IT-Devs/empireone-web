import React from "react";
import Layout from "../../../layout";
import RnrLayout from "../layout";
import RewardCardSection from "./sections/reward-card-section";
import RecognizeSomeoneSections from "./sections/recognize-someone-sections";

export default function Page() {
    return (
        <Layout>
            <RnrLayout>
                <RecognizeSomeoneSections />
                <RewardCardSection />
            </RnrLayout>
        </Layout>
    );
}
