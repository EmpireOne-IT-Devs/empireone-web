import React, { useState } from "react";
import Layout from "../layout";
import CardSection from "./card-section";
import HeaderSection from "./header-section";
// import ApplicationStatusSection from "./recent-activity-card";
// import ImportCsv from "./import-csv";
import QuickActionSection from "./quick-action-section";
import AnnouncementCardSection from "./anncouncement-card-section";
import UpcomingCardSection from "./upcoming-card-section";
import RecentActivityCardSection from "./recent-activity-card-section";
import TopNewsCardSection from "./top-news-card-section";

export default function Page() {
    return (
        <Layout>
            {/* Header and Stats */}
            <HeaderSection />
            <div className=" mx-auto w-full mt-4">
                <CardSection />

                <div className="mt-2">
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

                <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
                    <div className="w-full lg:flex-[2] min-w-0">
                        <RecentActivityCardSection />
                    </div>
                    <div className="w-full lg:flex-1 min-w-0">
                        <TopNewsCardSection />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
