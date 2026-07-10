import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import AnnouncementsSection from "@/app/pages/accounts/_administrator/activities/company_newsfeed/sections/announcements-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="grid grid-cols-3 gap-6 mt-2 h-full min-h-0">
                    {/* Left Column - Posts (view only) */}
                    <div className="col-span-2 h-full min-h-0">
                        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
                            <div className="overflow-y-auto flex-1 min-h-0 px-4 pt-4 pb-4 no-scrollbar">
                                {/* <PostCardSection /> */}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Announcements */}
                    <div className="h-full min-h-0 overflow-auto">
                        <AnnouncementsSection />
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
