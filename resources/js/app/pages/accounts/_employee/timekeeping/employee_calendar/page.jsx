import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import EmployeeCalendarSection from "../../../_administrator/time_keeping/employee_calendar/sections/employee-calendar-section";

export default function Page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <EmployeeCalendarSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
