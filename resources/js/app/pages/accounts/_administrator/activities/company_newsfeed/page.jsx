import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import NewsSectionCard from "./sections/news-section-card";
import AnnouncementsSection from "./sections/announcements-section";
import RecentActivitySection from "./sections/recent-activity-section";
import PoolCardSection from "./sections/pool-card-section";
export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="grid h-full grid-cols-5 gap-5 overflow-hidden ">
                    {/* News — 60% (3/5) */}
                    <div className="col-span-3 h-full overflow-y-auto ">
                        <NewsSectionCard />
                    </div>
                    {/* Announcements — 40% (2/5) */}
                    <div className="col-span-2 h-full overflow-y-auto no-scrollbar flex flex-col gap-5 pb-5">
                        <AnnouncementsSection />
                        <RecentActivitySection />
                        <PoolCardSection />
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
