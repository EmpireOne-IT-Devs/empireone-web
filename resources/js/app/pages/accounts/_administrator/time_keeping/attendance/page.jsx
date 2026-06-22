import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import TimekeepingSection from "./sections/timekeeping-section";

export default function Page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <TimekeepingSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
