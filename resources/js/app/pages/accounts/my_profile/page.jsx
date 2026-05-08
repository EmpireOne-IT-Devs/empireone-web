import React from "react";
import HeaderSection from "./sections/header-section";
import InfoTabsSection from "./sections/info-tabs-section";
import Layout from "./../layout";
import { useSelector } from "react-redux";
import NoSignatureNotification from "./sections/no-signature-notification";

export default function Page() {
    const { data } = useSelector((store) => store.app);

    // Check if the user's role is either 1 or 2
    const hasRequiredRole = [1, 2].includes(data?.user?.role);
    const hasNoSignature = data?.user?.account_employee?.signature === null;

    return (
        <Layout>
            {hasNoSignature && hasRequiredRole ? (
                <NoSignatureNotification />
            ) : (
                <div className="max-w-9xl flex-row items-center justify-center">
                    <HeaderSection />
                    <div className="mt-4">
                        <InfoTabsSection />
                    </div>
                </div>
            )}
        </Layout>
    );
}