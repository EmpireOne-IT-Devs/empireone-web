import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import AnnouncementsSection from "@/app/pages/accounts/_administrator/activities/company_newsfeed/sections/announcements-section";
import PostCardSection from "../../../_administrator/activities/home/sections/post-card-section";
import { Newspaper } from "lucide-react";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                {/* 12-column grid gives finer control: 9 cols for posts (75%), 3 cols for sidebar (25%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-2 h-full min-h-0">
                    
                    {/* Left Column - Posts (Expanded width) */}
                    <div className="lg:col-span-8 xl:col-span-9 h-full min-h-0">
                        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-none sm:rounded-xl border-0 sm:border border-gray-200 bg-gray-100 shadow-none sm:shadow-sm">
                           <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500">
    <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <span className="text-lg">

                <Newspaper className="h-5 w-5 text-white" />
            </span>
        </div>

        <div>
            <h2 className="text-white text-lg font-semibold tracking-tight">
                EmpireOne Newsfeed
            </h2>
            <p className="text-orange-100 text-xs">
                Latest company updates and announcements
            </p>
        </div>
    </div>

    <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
        • Live
    </div>
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