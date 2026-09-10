import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import CalendarSection from "./sections.jsx/calendar-section";
export default function Page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <CalendarSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
