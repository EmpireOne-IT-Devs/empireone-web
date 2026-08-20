import React from "react";
import { router } from "@inertiajs/react";
import Layout from "../layout";
import CardSection from "./_sections/card-section";
import HeaderSection from "./_sections/header-section";
import EventCardSection from "../_administrator/activities/events_calendar/sections/event-card-section";
import AnnouncementsSection from "../_administrator/activities/company_newsfeed/sections/announcements-section";
import NewsSection from "../_administrator/activities/company_newsfeed/sections/news-section-card";

export default function Page() {
    const accountRole = window.location.pathname.split("/")[2];
    const activitiesPath = `/accounts/${accountRole}/activities/home`;
    const announcementsPath = `/accounts/${accountRole}/activities/company_newsfeed`;
    const openActivities = () => router.visit(activitiesPath);

    return (
        <Layout>
            {/* Header and Stats */}
            <HeaderSection />

            <div className="mx-auto w-full mt-6 space-y-8">
                <CardSection />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Latest Company Activities
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Recent and upcoming events across the company
                                    </p>
                                </div>
                                <a
                                    href={activitiesPath}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                                >
                                    View all
                                </a>
                            </div>
                            <div className="p-6">
                                <EventCardSection />
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-900">
                                    Company News
                                </h2>
                                <a
                                    href={announcementsPath}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                                >
                                    View all
                                </a>
                            </div>
                            <div className="p-6">
                                <NewsSection />
                            </div>
                        </section>
                    </div>

                    {/* Announcements — 1/3 width, sticky sidebar */}
                    <section className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm lg:sticky lg:top-6">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">

                            <h2 className="text-base font-semibold text-gray-900">
                                Announcements
                            </h2>
                            <a
                                href={announcementsPath}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                            >
                                View all
                            </a>
                        </div>
                        <div className="p-6">
                            <AnnouncementsSection onCardClick={openActivities} />
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}