import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import CreatePostCardSection from "./sections/create-post-card-section";
import PostCardSection from "./sections/post-card-section";
import UpcomingEventSection from "./sections/upcoming-event-section";
import AnnouncementsSection from "../company_newsfeed/sections/announcements-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="grid grid-cols-3 gap-6 mt-2 h-full min-h-0">
                    {/* Left Column - Posts */}
                    <div className="col-span-2 h-full min-h-0">
                        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
                            <div className="shrink-0 bg-white px-4 pt-4 pb-3 border-b border-gray-100">
                                <CreatePostCardSection />
                            </div>
                            <div className="overflow-y-auto flex-1 min-h-0 px-4 pt-4 pb-4 no-scrollbar">
                                <PostCardSection />
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Upcoming Events */}
                    <div className="h-full min-h-0 overflow-auto">
                        <UpcomingEventSection />
                        <AnnouncementsSection />
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
