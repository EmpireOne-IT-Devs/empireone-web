import React, { useState } from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { TbSearch } from "react-icons/tb";
import CreateSurveySection from "./create-survey-section";

export default function SearchSection() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const handleStatusChange = (e) => setStatus(e.target.value);

    return (
        <div className="bg-white p-5 border-2 rounded-2xl flex flex-col sm:flex-row gap-2 my-3">
            <div className="flex-1 w-full">
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search event title..."
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
            </div>

            <div className="w-full sm:w-auto">
                <Select
                    label="All Status"
                    name="status"
                    value={status}
                    onChange={handleStatusChange}
                    options={[
                        { value: "all", label: "All Status" },
                        { value: "active", label: "Active" },
                        { value: "closed", label: "Closed" },
                    ]}
                />
            </div>
            <CreateSurveySection />
        </div>
    );
}