import React from "react";
import HeaderSection from "./sections/header-section";
import ChangePasswordSection from "./sections/change-password-section";
import Layout from "../layout";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <ChangePasswordSection />
        </Layout>
    );
}
