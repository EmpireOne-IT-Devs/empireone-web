import React, { useState } from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { TbSearch } from "react-icons/tb";

export default function SearchSection() {
    const [status, setStatus] = useState("all");

    return (
        <div className="bg-white p-5 border-2 rounded-2xl flex flex-col sm:flex-row gap-2 my-3">
            <div className="flex-1 w-full">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search poll id, title..."
                    name="search"
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
        </div>
    );
}