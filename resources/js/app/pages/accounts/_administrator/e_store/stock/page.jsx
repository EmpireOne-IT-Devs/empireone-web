import React, { useState } from "react";
import Layout from "../../../layout";
import StoreAdminLayout from "../layout";
import StockTableSection from "./sections/stock-table-section";
import HeaderSection from "./sections/header-section";
import CardSection from "./sections/card-section";
import PaginationSection from "./sections/pagination-section";

export default function Page() {
    const [page, setPage] = useState(1);

    return (
        <Layout>
            <StoreAdminLayout>
                <HeaderSection />
                <div className="space-y-4">
                    <CardSection />
                    <StockTableSection page={page} onPageChange={setPage} />
                    <PaginationSection onPageChange={setPage} />
                </div>
            </StoreAdminLayout>
        </Layout>
    );
}
