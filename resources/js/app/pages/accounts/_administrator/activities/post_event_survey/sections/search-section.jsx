import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TbSearch } from "react-icons/tb";

import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import CreateSurveySection from "./create-survey-section";

export default function SearchSection() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const { data } = useSelector((store) => store.app);

    const canCreateSurvey = [1, 11].includes(
        data?.user?.account_employee?.department_id,
    );

    return (
        <div className="my-3 flex flex-col gap-3 rounded-2xl border-2 bg-white p-5 sm:flex-row sm:items-end">
            <div className="w-full flex-1">
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
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { value: "all", label: "All Status" },
                        { value: "active", label: "Active" },
                        { value: "closed", label: "Closed" },
                    ]}
                />
            </div>

            {canCreateSurvey && (
                <div className="w-full shrink-0 sm:w-auto">
                    <CreateSurveySection />
                </div>
            )}
        </div>
    );
}