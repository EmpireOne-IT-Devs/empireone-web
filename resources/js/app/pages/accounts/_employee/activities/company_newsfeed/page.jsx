import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import NewsSectionCard from "@/app/pages/accounts/_administrator/activities/company_newsfeed/sections/news-section-card";
import RecentActivitySection from "@/app/pages/accounts/_administrator/activities/company_newsfeed/sections/recent-activity-section";
import CompanyFeaturesSection from "@/app/pages/accounts/_administrator/activities/company_newsfeed/sections/company-features-section";
import PoolCardSection from "@/app/pages/accounts/_administrator/activities/poll_analytics/sections/pool-card-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="h-full overflow-y-auto pr-1">
                    <div className="mb-5">
                        <CompanyFeaturesSection />
                    </div>
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                        <div className="xl:col-span-3">
                            <NewsSectionCard />
                        </div>
                        <div className="flex flex-col gap-5 pb-5 xl:col-span-2">
                            <RecentActivitySection />
                            <PoolCardSection />
                        </div>
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
