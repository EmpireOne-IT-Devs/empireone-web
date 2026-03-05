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
    const [searchTerm, setSearchTerm] = useState("");

    const applicants = [
        {
            id: 1,
            name: "Mark Harvey Leduna",
            email: "mark@email.com",
            phone: "+639959822419",
            date: "2/7/2026",
            status: "Interview",
            score: 4.5,
            match: 90,
        },
        {
            id: 2,
            name: "Kyle Calabaed",
            email: "kyleread@gmail.com",
            phone: "097865454645",
            date: "2/13/2026",
            status: "Initial Interview",
            score: 4.2,
            match: 85,
        },
        {
            id: 3,
            name: "Wakin Wakin",
            email: "wakin@empire.com",
            phone: "+639123456789",
            date: "2/15/2026",
            status: "Screening",
            score: 4.8,
            match: 95,
        },
    ];

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
