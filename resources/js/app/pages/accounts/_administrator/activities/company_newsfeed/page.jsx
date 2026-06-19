import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import NewsSectionCard from "./sections/news-section-card";
import AnnouncementsSection from "./sections/announcements-section";
import RecentActivitySection from "./sections/recent-activity-section";
import PoolCardSection from "./sections/pool-card-section";
import CompanyFeaturesSection from "./sections/company-features-section";
export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="h-full overflow-y-auto pr-1">
                    <div className="mb-5">
                        <CompanyFeaturesSection />
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                        {/* News — 60% (3/5) */}
                        <div className="xl:col-span-3">
                            <NewsSectionCard />
                        </div>
                        {/* Announcements — 40% (2/5) */}
                        <div className="flex flex-col gap-5 pb-5 xl:col-span-2">
                            <AnnouncementsSection />
                            <RecentActivitySection />
                            <PoolCardSection />
                        </div>
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
