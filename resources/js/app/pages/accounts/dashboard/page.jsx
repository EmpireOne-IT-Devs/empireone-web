import React from "react";
import { router } from "@inertiajs/react";
import Layout from "../layout";
import CardSection from "./_sections/card-section";
import DashboardContentSection from "./_sections/dashboard-content-section";
import HeaderSection from "./_sections/header-section";

export default function Page() {
    const accountRole = window.location.pathname.split("/")[2];
    const activitiesPath = `/accounts/${accountRole}/activities/home`;
    const announcementsPath = `/accounts/${accountRole}/activities/company_newsfeed`;
    const openActivities = () => router.visit(activitiesPath);

    return (
        <Layout>
            <div className="mx-auto mt-2 w-full space-y-4 sm:space-y-5">
                <HeaderSection />
                <CardSection />
                <DashboardContentSection
                    activitiesPath={activitiesPath}
                    announcementsPath={announcementsPath}
                    openActivities={openActivities}
                />
            </div>
        </Layout>
    );
}
