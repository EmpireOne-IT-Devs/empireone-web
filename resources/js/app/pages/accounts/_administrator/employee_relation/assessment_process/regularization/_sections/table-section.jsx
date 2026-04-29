import Table from "@/app/_components/table";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchSection from "./search-section";

export default function TableSection() {
    const { probationaries } = useSelector((store) => store.employee_relations);
    const role = window.location.pathname.split("/")[2];

    // 1. Add state to hold the search query
    const [searchQuery, setSearchQuery] = useState("");

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Account", accessor: "account" },
        { header: "Hired Date", accessor: "started_at" },
        { header: "Location", accessor: "location" },
        { header: "Status", accessor: "status" },
    ];

    // 2. Filter the probationaries based on the search query
    const filteredProbationaries = probationaries?.filter((res) => {
        const query = searchQuery.toLowerCase();
        const fullName =
            `${res?.personal_information?.first_name || ""} ${res?.personal_information?.middle_name || ""} ${res?.personal_information?.last_name || ""}`.toLowerCase();

        return (
            fullName.includes(query) ||
            res?.employee_id?.toLowerCase().includes(query) ||
            res?.position?.toLowerCase().includes(query) ||
            res?.department?.name?.toLowerCase().includes(query) ||
            res?.account?.name?.toLowerCase().includes(query) ||
            res?.site?.location?.name?.toLowerCase().includes(query) ||
            res?.status?.toLowerCase().includes(query)
        );
    });
    return (
        <div>
            {/* 3. Add the search input field */}
            <div className="mb-4 flex justify-end">
                <SearchSection
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                />
            </div>

            <Table
                columns={columns}
                data={
                    // 4. Map over the filtered data instead of the raw data
                    filteredProbationaries?.map((res) => ({
                        ...res,
                        employee_id: (
                            <Link
                                target="_blank"
                                className="underline text-blue-500 hover:text-blue-600"
                                href={`/accounts/${role}/employee_relation/assessment_process/regularization/${res.user_id}`}
                            >
                                {res?.employee_id}
                            </Link>
                        ),
                        name: `${res?.personal_information?.first_name} ${res?.personal_information?.middle_name ? res?.personal_information?.middle_name : " "} ${res?.personal_information?.last_name}`,
                        department: res?.department?.name,
                        account: res?.account?.name,
                        contact: res?.personal_information?.contact,
                        location: res?.site?.location?.name,
                        status: res?.status,
                    })) ?? []
                }
            />
        </div>
    );
}
