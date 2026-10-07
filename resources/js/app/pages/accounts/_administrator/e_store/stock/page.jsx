import React from "react";
import Layout from "../../../layout";
import StoreAdminLayout from "../layout";
import StockTableSection from "./sections/stock-table-section";
import HeaderSection from "./sections/header-section";
import CardSection from "./sections/card-section";
import PaginationSection from "./sections/pagination-section";

export default function Page() {
    return (
        <Layout>
            <StoreAdminLayout>
                <HeaderSection />
                <div className="space-y-4">
                    <CardSection />
                    <StockTableSection />
                    <PaginationSection />
                </div>
            </StoreAdminLayout>
        </Layout>
    );
}
