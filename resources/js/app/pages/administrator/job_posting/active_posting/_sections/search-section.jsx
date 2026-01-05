import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { TbCategory, TbFilter, TbSearch } from "react-icons/tb";
import CreateJobSection from "./create-job-section";

export default function SearchSection() {
    return (
        <div className="bg-white shadow-xl p-5 border-2 rounded-2xl flex gap-2 my-3">
            <div className="flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search job postings..."
                    name="search"
                />
            </div>
            <div>
                <Select
                    iconLeft={<TbFilter className="text-xl" />}
                    label="All Status"
                    options={[
                        { value: "all", label: "All Status" },
                        { value: "active", label: "Active" },
                        { value: "closed", label: "Closed" },
                        { value: "draft", label: "Draft" },
                    ]}
                />
            </div>
            <div>
                <CreateJobSection/>
            </div>
        </div>
    );
}
