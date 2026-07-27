import React from "react";
import SetAttendanceSection from "./sections/set-attendance-section";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";

export default function page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <SetAttendanceSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
