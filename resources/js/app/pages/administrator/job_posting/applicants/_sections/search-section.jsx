import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React from "react";
import { FaDownload, FaFileDownload } from "react-icons/fa";
import { TbCategory, TbFilter, TbSearch } from "react-icons/tb";

export default function SearchSection() {
    return (
        <div className="bg-white shadow-sm p-5 border-2 rounded-2xl flex gap-2 my-3">
            <div className="flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search applicants..."
                    name="search"
                />
            </div>
            <div>
                <Select
                    iconLeft={<TbCategory className="text-xl" />}
                    label="All Jobs"
                    options={[
                        { value: "all_jobs", label: "All Jobs" },
                        { value: "senior_software_engineer", label: "Senior Software Engineer" },
                        { value: "hr_manager", label: "HR Manager" },
                         { value: "marketing_specialist", label: "Marketing Specialist" },
                          { value: "accountant", label: "Accountant" },
                    ]}
                />
            </div>
            <div>
                <Select
                    iconLeft={<TbFilter className="text-xl" />}
                    label="All Status"
                    options={[
                        { value: "all_status", label: "All Status" },
                        { value: "new", label: "New" },
                        { value: "reviewing", label: "Reviewing" },
                        { value: "shortlisted", label: "Shortlisted" },
                        { value: "interview", label: "Interview" },
                        { value: "rejected", label: "Rejected" },
                        { value: "hired", label: "Hired" },
                    ]}
                />
            </div>
             <div>
                <Button
                variant="secondary"
                outlined
                >
                    <FaDownload className="text-lg mr-2" />
                    Export

                </Button>
            </div>
        </div>
    );
}
