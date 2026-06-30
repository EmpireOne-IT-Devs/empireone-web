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
                <div className="flex flex-col  h-full min-h-0">
                    <HeaderSection />
                    <div className="flex-1 overflow-y-auto min-h-0 flex flex-col ">
                        <CardSection />
                        <SearchSection />
                        <TableSection />
                    </div>
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
