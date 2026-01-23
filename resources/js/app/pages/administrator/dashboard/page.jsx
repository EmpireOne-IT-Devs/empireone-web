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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2">
                    <UrgentAnnouncementSection />
                </div>
                <div className="lg:col-span-1">
                    <UpcomingEventsSection />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
                <div className="lg:col-span-2 -mt-20">
                    <RecentActivityCardSection />
                </div>
                <div className="lg:col-span-1">
                    <TopNewsCardSection />
                </div>
            </div>
        </Layout>
    );
}