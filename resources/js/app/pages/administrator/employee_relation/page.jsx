import React from "react";
import Layout from "../layout";
import HeaderSection from "./section/header-section";
import SearchSection from "./section/search-section";
import TableSection from "./section/table-section";

export default function Page() {
    return (
        <Layout>
            <HeaderSection />
            <SearchSection />   
            <TableSection />
        </Layout>
    );
}
