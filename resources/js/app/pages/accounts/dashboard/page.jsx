import React from "react";
import Layout from "../layout";
import CardSection from "./_sections/card-section";
import HeaderSection from "./_sections/header-section";
import QuickActionSection from "./_sections/quick-action-section";
import AnnouncementCardSection from "./_sections/anncouncement-card-section";
import UpcomingCardSection from "./_sections/upcoming-card-section";
import RecentActivityCardSection from "./_sections/recent-activity-card-section";
import TopNewsCardSection from "./_sections/top-news-card-section";

export default function Page() {
    return (
        <Layout>
            {/* Header and Stats */}
            <HeaderSection />
            <div className="mx-auto w-full mt-4">
                <CardSection />

                {/* <div className="mt-2">
                    <QuickActionSection />
                </div>
                <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
                    <div className="w-full lg:flex-[2] min-w-0">
                        <AnnouncementCardSection />
                    </div>
                    <div className="w-full lg:flex-1 min-w-0">
                        <UpcomingCardSection />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start mt-4">
                    <div className="w-full lg:flex-[2] min-w-0">
                        <RecentActivityCardSection />
                    </div>
                    <div className="w-full lg:flex-1 min-w-0">
                        <TopNewsCardSection />
                    </div>
                </div> */}
            </div>
        </Layout>
    );
}
