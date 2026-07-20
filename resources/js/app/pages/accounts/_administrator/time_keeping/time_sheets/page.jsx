import React from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import TimeSheetSection from "./sections/time-sheet-section";

export default function Page() {
    return (
        <Layout>
            <TimeKeepingLayout>
                <TimeSheetSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
