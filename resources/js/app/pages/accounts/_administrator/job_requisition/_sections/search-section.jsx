import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaDownload, FaFileDownload } from "react-icons/fa";
import { TbCategory, TbFilter, TbSearch } from "react-icons/tb";
import CreateJobRequisition from "./create-requisition-section";
import { router } from "@inertiajs/react";

export default function SearchSection() {
    const [search, setSearch] = useState("");

    const params = new URLSearchParams(window.location.search);
    const search_value = params.get("search");

    useEffect(() => {
        setSearch(search_value);
    }, []);

    async function search_input(e) {
        e.preventDefault();
        router.visit(`?search=${search}`);
    }
    return (
        <div className="bg-white shadow-sm p-5 border-2 rounded-2xl flex gap-2 my-3">
            <div className="flex-1">
                <form onSubmit={search_input}>
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search by position, requisition #..."
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            <div>
                <Select
                    label="All Status"
                    options={[
                        { value: "all_status", label: "All Status" },
                        { value: "pending", label: "Pending" },
                        { value: "under_review", label: "Under Review" },
                        { value: "approved", label: "Approved" },
                        { value: "rejected", label: "Rejected" },
                        {
                            value: "partially_filled",
                            label: "Partially Filled",
                        },
                        { value: "filled", label: "Filled" },
                    ]}
                />
            </div>
            <CreateJobRequisition />
        </div>
    );
}
