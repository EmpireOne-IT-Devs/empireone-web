import React from "react";
import HeaderSection from "./sections/header-section";
import Layout from "../layout";
import ApplicationCardSection from "./sections/application-card-section";

export default function Page() {
    return (
        <Layout>
            <div className="mb-4">
                <HeaderSection />
            </div>
            <ApplicationCardSection />
        </Layout>
    );
}
