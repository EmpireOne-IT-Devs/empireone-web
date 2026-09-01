import React from "react";
import { useSelector } from "react-redux";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import CreatePostCardSection from "./sections/create-post-card-section";
import PostCardSection from "./sections/post-card-section";
import UpcomingEventSection from "./sections/upcoming-event-section";
import AnnouncementsSection from "../company_newsfeed/sections/announcements-section";

export default function Page() {
    const { data } = useSelector((store) => store.app);
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
                            {[1, 11].includes(
                                data?.user?.account_employee?.department_id,
                            ) ? (
                                <div className="shrink-0 bg-gray-50 px-4 pt-4 pb-3 border-b border-gray-100">
                                    <CreatePostCardSection />
                                </div>
                            ) : (
                                <div className="shrink-0 bg-orange-500 px-4 sm:px-6 py-4 border-b border-gray-200">
                                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                        EmpireOne Newsfeed
                                    </h1>
                                    <p className="text-xs sm:text-sm text-white mt-0.5">
                                        Stay up to date with the latest posts,
                                        announcements, and news.
                                    </p>
                                </div>
                            )}

                            <div className="overflow-y-auto flex-1 min-h-0 px-3 sm:px-6 pt-4 sm:pt-6 pb-10 no-scrollbar bg-gray-50/50">
                                {/* Removed max-w-4xl constraint so posts span full available width */}
                                <div className="w-full space-y-3 sm:space-y-4">
                                    <PostCardSection />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 h-full min-h-0 flex-col gap-4 overflow-auto">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <AnnouncementsSection />
                        </div>
                        {[1, 11].includes(
                            data?.user?.account_employee?.department_id,
                        ) && (
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                                <UpcomingEventSection />
                            </div>
                        )}
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
