import React from "react";
import CardSection from "./sections/card-secrtion";
import TableSection from "./sections/table-section";
import Layout from "../../../layout";
import RnrLayout from "../layout";
import SearchSection from "./sections/search-section";

export default function Page() {
    return (
        <Layout>  
            <RnrLayout>
                <div className="space-y-4">
                    <CardSection />
                    <TableSection />
                </div>
            </RnrLayout>
        </Layout>
    );
}
