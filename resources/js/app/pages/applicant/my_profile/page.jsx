import React, { useState } from "react";
import HeaderSection from "./sections/header-section";
import InfoTabsSection from "./sections/info-tabs-section";
import Layout from "../layout";

export default function Page() {

    return (
        <Layout>
            <div className="flex items-center justify-center w-full">
                <div className="max-w-7xl flex-row items-center justify-center  ">
                    <HeaderSection  />
                    <div className="mt-4">
                        <InfoTabsSection />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
