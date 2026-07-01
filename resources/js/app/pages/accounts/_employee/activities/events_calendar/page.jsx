import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import HeaderSection from "@/app/pages/accounts/_administrator/activities/events_calendar/sections/header-section";
import YearTimelineSection from "@/app/pages/accounts/_administrator/activities/events_calendar/sections/year-timeline-section";
import EventCardSection from "@/app/pages/accounts/_administrator/activities/events_calendar/sections/event-card-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <div className="h-full overflow-hidden flex flex-col gap-5">
                    <HeaderSection />
                    <div className="grid grid-cols-5 gap-5 flex-1 min-h-0">
                        <div className="col-span-3 h-full overflow-y-auto no-scrollbar">
                            <EventCardSection />
                        </div>
                        <div className="col-span-2 h-full overflow-y-auto no-scrollbar pb-5">
                            <YearTimelineSection />
                        </div>
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
