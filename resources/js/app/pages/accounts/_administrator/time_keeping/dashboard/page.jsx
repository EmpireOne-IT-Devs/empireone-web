import React, { useEffect } from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import EmployeeDetailsSection from "./sections/employee-details-section";

export default function Page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <EmployeeDetailsSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
