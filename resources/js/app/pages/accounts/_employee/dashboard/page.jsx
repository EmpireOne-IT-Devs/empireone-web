import React, { useState } from "react";
import Layout from "../../layout";
import CardSection from "./card-section";
import HeaderSection from "./header-section";
import FeatureJobSection from "./feature-job-section";
import ApplicationStatusSection from "./application-status-section";
import ImportCsv from "./import-csv";

export default function Page() {
    return (
        <Layout>
            {/* Header */}
            <HeaderSection />
            <CardSection />
            <div className="flex gap-6 items-start">
                {/* Left: Featured Jobs — takes ~65% */}
                <div className="flex-1 min-w-0">
                    <FeatureJobSection />
                </div>

                {/* Right: Application Status — fixed ~320px */}
                <div className="w-80 flex-shrink-0">
                    <ApplicationStatusSection />
                </div>
            </div>
        </Layout>
    );
}