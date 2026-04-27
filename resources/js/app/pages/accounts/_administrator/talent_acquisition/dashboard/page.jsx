import React from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import RecentActivitySection from "./_sections/recent-activity-section";
import TopPerformingJobSection from "./_sections/top-perfoming-job-section";
import QuickActionsSection from "./_sections/quick-actions-section";

export default function Page() {
    return (
        <Layout>
            <JobPostingLayout>
                <div className="flex flex-col gap-5">
                    {/* <HeaderSection /> */}

                    <CardSection />
                    <QuickActionsSection />
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <RecentActivitySection />
                        </div>
                        <div className="flex-1">
                            <TopPerformingJobSection />
                        </div>
                    </div>
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
