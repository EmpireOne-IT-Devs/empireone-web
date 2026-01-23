import React from "react";
import Layout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import QuickAccessSection from "./_sections/quick-access-section";
import UrgentAnnouncementSection from "./_sections/urgent-accouncement-section";
import UpcomingEventsSection from "./_sections/upcoming-events-card-section";
import RecentActivityCardSection from "./_sections/recent-activity-card-section";
import TopNewsCardSection from "./_sections/top-news-card-section";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <CardSection />
            <div className="mt-6">
                <QuickAccessSection />
            </div>

            <div className="flex gap-3">
                <div className="flex-[1.5]">
                    <UrgentAnnouncementSection />
                </div>
                <div className="flex-1">
                    <UpcomingEventsSection />
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex-[1.5] mt-4">
                    <RecentActivityCardSection />
                </div>
                <div className="flex-1 mt-4">
                    <TopNewsCardSection />
                </div>
            </div>
        </Layout>
    );
}
