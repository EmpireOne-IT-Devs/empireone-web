import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";
import { TbSearch } from "react-icons/tb";

export default function SearchSection() {
    return (
        <div className="bg-white shadow-md rounded-md p-4 sm:p-5 border-2 flex flex-col sm:flex-row gap-2 my-3">
            <div className="w-full sm:flex-1">
                <Input label="Search job offers..." name="search" />
            </div>
            <div className="w-full sm:w-auto">
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
