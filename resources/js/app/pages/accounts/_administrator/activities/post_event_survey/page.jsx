import React from "react";
import ActivitiesLayout from "../layout";
import Layout from "../../../layout";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import CardSection from "./sections/card-section";
import TableSection from "./sections/table-section";
export default function Page() {
    return (
        <Layout>
            <ActivitiesLayout>
                <HeaderSection/>
                <CardSection/>
                <SearchSection/>
                <TableSection/>
            </ActivitiesLayout>
        </Layout>
    );
}
