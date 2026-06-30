import React from "react";

import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";

export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <HeaderSection />
                <SearchSection />
            </ActivitiesLayout>
        </Layout>
    );
}
