import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import { Search, Eye, FileText, MoreHorizontal, User } from "lucide-react";
import CardsSection from "./_sections/cards-section";
import HeaderSection from "./_sections/header-section";
import store from "@/app/store/store";
import { get_job_application_by_id_thunk } from "@/app/redux/job-posting-thunk";
import SearchSection from "./_sections/search-section";
import TableSection from "./_sections/table-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_application_by_id_thunk());
    });
    return (
        <Layout>
            <HeaderSection />
            <div className=" flex flex-col gap-5">
                <CardsSection />

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Toolbar */}
                    <SearchSection />

                    {/* Interactive Table */}
                    <TableSection />
                </div>
            </div>
        </Layout>
    );
}
