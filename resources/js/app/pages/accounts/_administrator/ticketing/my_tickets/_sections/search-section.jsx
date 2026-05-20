import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";
import { TbCategory, TbFilter, TbSearch } from "react-icons/tb";

export default function SearchSection() {
    return (
        <div className="bg-white shadow-xl p-5 border-2 rounded-2xl flex gap-2 my-3">
            <div className="flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search by ticket,number,title or category..."
                    name="search"
                />
            </div>
            <div>
                <Select
                    label="All Status"
                    options={[
                        { value: "all", label: "All Tickets" },
                        { value: "open", label: "Open Tickets" },   
                        { value: "pending", label: "Pending Tickets" },
                    ]}
                />
            </div>
            <div>
                <Select
                    label="Priorities"
                    options={[
                        { value: "all", label: "All Priorities" },
                        { value: "critical", label: "Critical" },
                        { value: "high", label: "High" },
                        { value: "medium", label: "Medium" },
                        { value: "low", label: "Low" },
                    ]}
                />
            </div>
        </div>
    );
}
