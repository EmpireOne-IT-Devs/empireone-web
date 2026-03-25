import React, { useState } from "react";
import Layout from "../layout";
import CardSection from "./card-section";
import HeaderSection from "./header-section";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <CardSection />
        </Layout>
    );
}
