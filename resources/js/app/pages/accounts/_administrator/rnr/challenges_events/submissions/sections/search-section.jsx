import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";
import { FaDownload} from "react-icons/fa";
import { TbSearch } from "react-icons/tb";

export default function SearchSection() {
    return (
        <div className="bg-white shadow-sm p-5 border-2 rounded-2xl flex gap-2 my-3">
            <div className="flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search employees..."
                    name="search"
                />
            </div>
       
            <div>
                <Select
                    label="All Status"
                    options={[
                        { value: "all_status", label: "All Status" },
                        { value: "pending", label: "Pending" },
                        { value: "approved", label: "Approved" },
                        { value: "declined", label: "Declined" },
                    ]}
                />
            </div>
            <div>
                <Button variant="engagement" outlined>
                    <FaDownload className="text-lg mr-2" />
                    Export
                </Button>
            </div>
        </div>
    );
}
