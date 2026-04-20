import React, { useEffect, useState } from "react";
import Layout from "../../../../../layout";
import HeaderSection from "./_sections/header-section";
import SearchSection from "./_sections/search-section";
import TableSection from "./_sections/table-section";
import LayoutActiveJobPostingID from "../layout";
import BackSection from "../_sections/back-section";

export default function Page() {

    return (
        <Layout>
            <BackSection />
            <LayoutActiveJobPostingID>
                <HeaderSection />
                <div className=" flex flex-col gap-5">
                    {/* Table Container */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Toolbar */}
                        <SearchSection />
                        <TableSection />
                    </div>
                </div>
            </LayoutActiveJobPostingID>
        </Layout>
    );
}
