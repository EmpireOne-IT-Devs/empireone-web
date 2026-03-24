import Accordion from "@/app/_components/accordion";
import React from "react";
import { TbBuildingCog, TbTags } from "react-icons/tb";
import CreateCategorySection from "./create-category-section";
import EditCategorySection from "./edit-category-section";
import DeleteCategorySection from "./delete-category-section";
import { useSelector } from "react-redux";

const STATIC_DEPARTMENTS = [
    {
        id: 1,
        name: "Information Technology",
        categories: [
            { id: 1, name: "Hardware Issue" },
            { id: 2, name: "Software Issue" },
            { id: 3, name: "Network & Connectivity" },
            { id: 4, name: "Account & Access" },
        ],
    },
    {
        id: 2,
        name: "Human Resources",
        categories: [
            { id: 5, name: "Payroll Concern" },
            { id: 6, name: "Leave & Attendance" },
            { id: 7, name: "Employee Benefits" },
            { id: 8, name: "Recruitment" },
        ],
    },
    {
        id: 3,
        name: "Finance",
        categories: [
            { id: 9, name: "Reimbursement" },
            { id: 10, name: "Budget Request" },
            { id: 11, name: "Invoice & Billing" },
        ],
    },
    {
        id: 4,
        name: "Facilities & Maintenance",
        categories: [
            { id: 12, name: "Electrical" },
            { id: 13, name: "Plumbing" },
            { id: 14, name: "Airconditioning" },
            { id: 15, name: "Cleaning & Sanitation" },
        ],
    },
    {
        id: 5,
        name: "Administration",
        categories: [
            { id: 16, name: "Document Request" },
            { id: 17, name: "Office Supplies" },
            { id: 18, name: "Meeting Room Booking" },
        ],
    },
];

export default function AccordionsSection() {
    const { tables } = useSelector((store) => store.tickets);

    const departments = tables?.departments?.length
        ? tables.departments
        : STATIC_DEPARTMENTS;

    return (
        <div className="flex flex-col gap-3">
            {departments.map((res) => {
                return (
                    <Accordion
                        key={res.id}
                        items={[
                            {
                                title: (
                                    <div className="w-full flex items-center justify-between">
                                        <div className="flex w-full flex-1 gap-1 items-center">
                                            <TbBuildingCog className="text-xl" />{" "}
                                            {res.name}
                                        </div>
                                        <div>
                                            <CreateCategorySection />
                                        </div>
                                    </div>
                                ),
                                content: (
                                    <div className="flex flex-col gap-3">
                                        {res.categories?.map((result, i) => {
                                            return (
                                                <div
                                                    key={result.id ?? i}
                                                    className="flex gap-2 border p-3 rounded-xl"
                                                >
                                                    <div className="p-3 rounded-lg bg-blue-200">
                                                        <TbTags className="text-3xl text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-lg font-black">
                                                            {result.name}
                                                        </div>
                                                        <div>
                                                            {res.name} Concern Category
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-3">
                                                        <EditCategorySection data={result} />
                                                        <DeleteCategorySection data={result} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ),
                            },
                        ]}
                    />
                );
            })}
        </div>
    );
}