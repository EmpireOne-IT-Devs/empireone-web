import React, { useState } from "react";
import HeaderSection from "./sections/header-section";
import InfoTabsSection from "./sections/info-tabs-section";
import Layout from "./../layout";
import { useSelector } from "react-redux";
import NoSignatureNotification from "./sections/no-signature-notification";

export default function Page() {
    const { data } = useSelector((store) => store.app);
    console.log('datadata', data?.user?.account_employee?.signature)
    return (
        <Layout>
            {
                data?.user?.account_employee?.signature === null ?
                    <NoSignatureNotification />
                    : <div className="max-w-9xl flex-row items-center justify-center  ">
                        <HeaderSection />
                        <div className="mt-4">
                            <InfoTabsSection />
                        </div>
                    </div>
            }
        </Layout>
    );
}
