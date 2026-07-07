import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import HeaderSection from "./sections/header-section";
import UpcomingBirthdaySection from "./sections/upcoming-birthday-section";
import WorkAnniversarySection from "./sections/work-anniversary-section";
import RecentActivitySection from "../company_newsfeed/sections/recent-activity-section";
export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <HeaderSection />
                <div className="flex h-full min-h-0 flex-col overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 p-2">
                    <UpcomingBirthdaySection />
                    <div className="flex flex-col gap-3">
                        {/* <WorkAnniversarySection /> */}
                        <RecentActivitySection/>
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
