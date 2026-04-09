import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";
import { TbFilter, TbSearch } from "react-icons/tb";

export default function SearchSection() {
    return (
        <div className="flex gap-2 my-3 mb-6">
            <div className="flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search by name or email..."
                    name="search"
                />
            </div>
            <div>
                <Select
                    iconLeft={<TbFilter className="text-xl" />}
                    label="All Departments"
                    options={[
                        { value: "all departments", label: "All Departments" },
                        { value: "it support", label: "IT Support" },
                        { value: "network team", label: "Network Team" },
                        { value: "hardware team", label: "Hardware Team" },
                        { value: "software team", label: "Software Team" },
                    ]}
                />
            </div>
        </div>
    );
}
