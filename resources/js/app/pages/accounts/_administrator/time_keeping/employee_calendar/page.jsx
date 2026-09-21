import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import EmployeeCalendarSection from "./sections/employee-calendar-section";

export default function page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <EmployeeCalendarSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
