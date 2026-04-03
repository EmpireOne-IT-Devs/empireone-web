import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";
import { TbSearch } from "react-icons/tb";

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
                    label="All Status"
                    options={[
                        { value: "all", label: "All Status" },
                        { value: "active", label: "Active" },
                        { value: "closed", label: "Closed" },
                        { value: "draft", label: "Draft" },
                    ]}
                />
            </div>
        </div>
    );
}
