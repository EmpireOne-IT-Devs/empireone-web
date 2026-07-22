import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import AnnouncementsSection from "@/app/pages/accounts/_administrator/activities/company_newsfeed/sections/announcements-section";
import PostCardSection from "../../../_administrator/activities/home/sections/post-card-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 h-full min-h-0">
                    {/* Left Column - Posts (view only) */}
                    <div className="lg:col-span-2 h-full min-h-0">
                        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-orange-500">
                                <span className="h-2 w-2 rounded-full bg-purple-600" />
                                <h2 className="text-white text-lg font-bold">
                                    Employee Activities
                                </h2>
                            </div>
                            <div className="overflow-y-auto flex-1 min-h-0 px-6 pt-6 pb-10 no-scrollbar bg-gray-50/50">
                                <div className="max-w-4xl mx-auto space-y-4">
                                    <PostCardSection />
                                </div>
                            </div>
                            {/* Fade to signal scrollable content, not a hard cutoff */}
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
                        </div>
                    </div>

                    {/* Right Column - Announcements */}
                    <div className="h-full min-h-0 overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <AnnouncementsSection />
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}