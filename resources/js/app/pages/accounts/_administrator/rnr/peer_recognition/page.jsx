import React, { useState } from "react";
import Layout from "../../../layout";
import RnrLayout from "../layout";
import RewardCardSection from "./sections/reward-card-section";
import RecognizeSomeoneSections from "./sections/recognize-someone-sections";

export default function Page() {
    const [selectedCategory, setSelectedCategory] = useState("All Awards");

    return (
        <Layout>
            <RnrLayout>
                <RecognizeSomeoneSections onCategoryChange={setSelectedCategory} />
                <RewardCardSection selectedCategory={selectedCategory} />
            </RnrLayout>
        </Layout>
    );
}
