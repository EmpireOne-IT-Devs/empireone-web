import React, { useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import RewardCardSection from "@/app/pages/accounts/_administrator/rnr/peer_recognition/sections/reward-card-section";
import RecognizeSomeoneSections from "@/app/pages/accounts/_administrator/rnr/peer_recognition/sections/recognize-someone-sections";


export default function Page() {
    const [selectedCategory] = useState("All Awards");
    
    return (
        <Layout>
            <RnrLayout>
                <div className="mt-4 space-y-4">
                    <RecognizeSomeoneSections />
                    <RewardCardSection selectedCategory={selectedCategory} />
                </div>
            </RnrLayout>
        </Layout>
    );
}