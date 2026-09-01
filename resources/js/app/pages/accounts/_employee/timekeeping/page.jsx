import React from "react";
import Layout from "../../layout";
import TimekeepingSection from "./sections/timekeeping-section";

export default function Page() {
    return (
        <Layout>
            <div className="p-3">
                <TimekeepingSection />
            </div>
        </Layout>
    );
}
