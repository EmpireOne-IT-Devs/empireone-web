import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";
import { TbCategory, TbFilter, TbMapPin, TbSearch } from "react-icons/tb";

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
            <div  className="flex-1">
                <Select
                    iconLeft={<TbFilter className="text-xl" />}
                    label="All Status"
                    options={[
                        { value: "all", label: "All Tickets" },
                        { value: "open", label: "Open Tickets" },
                        { value: "pending", label: "Pending Tickets" },
                    ]}
                />
            </div>
            <div  className="flex-1">
                <Select
                    iconLeft={<TbCategory className="text-xl" />}
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
            <div  className="flex-1">
                <Select
                    iconLeft={<TbMapPin className="text-xl" />}
                    label="Location"
                    options={[
                        { value: "Site 1", label: "Site 1" },
                        { value: "Site 2", label: "Site 2" },
                        { value: "Site 3", label: "Site 3" },
                    ]}
                />
            </div>
        </div>
    );
}
