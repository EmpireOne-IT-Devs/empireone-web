import React, { useState } from "react";
import { TbSearch } from "react-icons/tb";

import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import CreateSurveySection from "./create-survey-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function SearchSection({ createSurveyRef }) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const { isReady, isContentManager: canCreateSurvey } =
        useCurrentEmployee();

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

            {!isReady ? (
                <div className="w-full shrink-0 sm:w-40">
                    <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
                </div>
            ) : (
                canCreateSurvey && (
                    <div className="w-full shrink-0 sm:w-auto">
                        <CreateSurveySection ref={createSurveyRef} />
                    </div>
                )
            )}
        </div>
    );
}