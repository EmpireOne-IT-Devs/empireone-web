import React, { useEffect } from "react";
import Layout from "../../layout";
import MyTeamLayout from "../layout";
import CardSection from "./_sections/card-section";
import CardEvaluationSection from "./_sections/card-evaluation-section";
import PendingEvaluationSection from "./_sections/pending-evaluation-section";

export default function Page() {
    return (
        <Layout>
            <MyTeamLayout>
                <div className="flex flex-col gap-6">
                    <CardSection />
                    <CardEvaluationSection />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PendingEvaluationSection />
                    </div>
                </div>
            </MyTeamLayout>
        </Layout>
    );
}
