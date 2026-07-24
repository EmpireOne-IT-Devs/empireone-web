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
                {/* <div className="grid grid-cols-3 gap-6 mt-2 h-full min-h-0">
                    <div className="col-span-2 h-full min-h-0">
                        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-gray-50 shadow-sm">
                            <div className="shrink-0 bg-gray- px-4 pt-4 pb-3 border-b border-gray-100">
                                <CreatePostCardSection />
                            </div>
                            <div className="overflow-y-auto flex-1 min-h-0 p-12 no-scrollbar bg-gray-50/50">
                                <PostCardSection />
                            </div>
                        </div>
                    </div>

                    <div className="h-full min-h-0 overflow-auto">
                     
                        <AnnouncementsSection />
                    </div>
                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-2 h-full min-h-0">
                    {/* Left Column - Posts (Expanded width) */}
                    <div className="lg:col-span-8 xl:col-span-9 h-full min-h-0">
                        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-none sm:rounded-xl border-0 sm:border border-gray-200 bg-gray-100 shadow-none sm:shadow-sm">
                           
                                <div className="shrink-0 bg-gray-50 px-4 pt-4 pb-3 border-b border-gray-100">
                                    <CreatePostCardSection />
                                </div>
                            

                            <div className="overflow-y-auto flex-1 min-h-0 px-3 sm:px-6 pt-4 sm:pt-6 pb-10 no-scrollbar bg-gray-50/50">
                                {/* Removed max-w-4xl constraint so posts span full available width */}
                                <div className="w-full space-y-3 sm:space-y-4">
                                    <PostCardSection />
                                </div>
                            </div>

                            {/* Fade to signal scrollable content */}
                            
                        </div>
                    </div>

                    {/* Right Column - Announcements Sidebar */}
                    <div className="hidden lg:block lg:col-span-4 xl:col-span-3 h-full min-h-0 overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <AnnouncementsSection />
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
