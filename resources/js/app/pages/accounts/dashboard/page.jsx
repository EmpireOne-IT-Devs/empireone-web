import React, { useState } from "react";
import Layout from "../layout";
import CardSection from "./card-section";
import HeaderSection from "./header-section";
import FeatureJobSection from "./feature-job-section";
import ApplicationStatusSection from "./application-status-section";
import ImportCsv from "./import-csv";

export default function Page() {
    return (
        <Layout>
            {/* Header and Stats */}
            <HeaderSection />
            <div className=" mx-auto w-full">
                <CardSection />
                
                {/* <ImportCsv /> */}

                <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
                    <div className="w-full lg:flex-1 min-w-0">
                        <FeatureJobSection />
                    </div>

                    <div className="w-full lg:w-80 lg:flex-shrink-0">
                        <ApplicationStatusSection />
                    </div>
                </div>
            </div>
        </Layout>
    );
}