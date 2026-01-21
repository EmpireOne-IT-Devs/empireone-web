import React from "react";
import Layout from "../../layout";
import HrCentralLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import RecentHrActivitySection from "./_sections/recent-hr-activity-section";

export default function Page() {
    return (
        <Layout>
            <HrCentralLayout>
                <HeaderSection />
                <div>
                    <CardSection />
                    <div className="mt-6">
                       <RecentHrActivitySection />
                    </div>
                   
                </div>
            </HrCentralLayout>
        </Layout>
    );
}
