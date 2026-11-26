import React from "react";
import { Link } from "@inertiajs/react";
import AnnouncementsSection from "../../_administrator/activities/company_newsfeed/sections/announcements-section";
import NewsSection from "../../_administrator/activities/company_newsfeed/sections/news-section-card";
import EventCardSection from "../../_administrator/activities/events_calendar/sections/event-card-section";
import EngagementCardSection from "./engagement-card-section";
import QuickActionSection from "./quick-action-section";
import RecentActivityCardSection from "./recent-activity-card-section";
import RecentApplicationsCardSection from "./recent-applications-card-section";

export default function DashboardContentSection({
    activitiesPath,
    announcementsPath,
    openActivities,
}) {
    return (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-5">
            <div className="min-w-0 space-y-4 lg:col-span-2 lg:space-y-5">
                <div className="space-y-3 rounded-2xl border border-violet-100 bg-white p-2 shadow-sm sm:p-3 lg:p-4">
                    <QuickActionSection />

                    <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
                        <RecentApplicationsCardSection />

                        <AnnouncementsSection
                            onCardClick={openActivities}
                            limit={3}
                        />
                    </div>
                </div>

                <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Latest Company Activities
                            </h2>
                            <p className="text-xs text-slate-500">
                                Recent and upcoming events across the company
                            </p>
                        </div>
                        <Link
                            href={activitiesPath}
                            className="shrink-0 text-xs font-semibold text-violet-700 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="p-3 sm:p-4">
                        <EventCardSection limit={6} />
                    </div>
                </section>

                <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Company News
                            </h2>
                            <p className="text-xs text-slate-500">
                                Updates and stories from across the company
                            </p>
                        </div>
                        <Link
                            href={announcementsPath}
                            className="shrink-0 text-xs font-semibold text-violet-700 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="p-3 sm:p-4">
                        <NewsSection limit={6} />
                    </div>
                </section>
            </div>

            <aside className="min-w-0 space-y-4 lg:col-span-1 lg:sticky lg:top-4">
                <EngagementCardSection />
                <RecentActivityCardSection />
            </aside>
        </div>
    );
}
