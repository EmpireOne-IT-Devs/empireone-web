import React, { useState } from "react";
import Layout from "../../../layout";
import RnrLayout from "../layout";
import AwardCategorySection from "./award-category-section";
import RewardCardSection from "./sections/reward-card-section";
import RecognizeSomeoneSections from "./sections/recognize-someone-sections";

export default function Page() {
    const [selectedCategory, setSelectedCategory] = useState("All Awards");

    return (
        <Layout>
            <RnrLayout>
              
                <RecognizeSomeoneSections />
                <RewardCardSection selectedCategory={selectedCategory} />
            </RnrLayout>
        </Layout>
    );
}
