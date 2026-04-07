import React, { useEffect } from "react";
import Layout from "./../../../../layout";
import TableSection from "./_sections/table-section";
import HeaderSection from "./_sections/header-section";
import StatsSection from "./_sections/stats-section";
import EmployeeLayout from "./../layout";

export default function Page() {
    return (
        <Layout>
            <EmployeeLayout>
                <div className="flex flex-col gap-3 w-full">
                    <HeaderSection />
                    <StatsSection />
                    <TableSection />
                </div>
            </EmployeeLayout>
        </Layout>
    );
}
