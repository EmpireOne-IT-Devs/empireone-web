import React from "react";
import AssetInventory from "../layout";
import Layout from "../../../layout";
import HeaderSection from "./sections/header-section";
import CardSection from "./sections/card-section";

export default function Page() {
    return (
        <Layout>
            <AssetInventory>
                <HeaderSection />
                <CardSection />
            </AssetInventory>
        </Layout>
    );
}
