import React, { useMemo } from "react";
import Table from "@/app/_components/table";
import SearchSection from "./search-section";
import Badge from "@/app/_components/badge";

const JOB_OFFERS = [
    {
        id: "JO-001",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        postedDate: "Mar 10, 2026",
        applicants: 42,
        status: "Open",
    },
    {
        id: "JO-002",
        title: "Product Designer",
        department: "Design",
        location: "New York, NY",
        postedDate: "Mar 12, 2026",
        applicants: 28,
        status: "Open",
    },
    {
        id: "JO-003",
        title: "Backend Engineer (Node.js)",
        department: "Engineering",
        location: "San Francisco",
        postedDate: "Feb 28, 2026",
        applicants: 61,
        status: "Closed",
    },
    {
        id: "JO-004",
        title: "Marketing Manager",
        department: "Marketing",
        location: "London, UK",
        postedDate: "Mar 18, 2026",
        applicants: 15,
        status: "Pending",
    },
    {
        id: "JO-005",
        title: "Data Analyst",
        department: "Analytics",
        location: "Remote",
        postedDate: "Mar 01, 2026",
        applicants: 33,
        status: "Open",
    },
    {
        id: "JO-006",
        title: "DevOps Engineer",
        department: "Engineering",
        location: "Austin, TX",
        postedDate: "Mar 20, 2026",
        applicants: 0,
        status: "Draft",
    },
];

const COLUMNS = [
    { header: "Job ID", accessor: "id" },
    { header: "Job Title", accessor: "title" },
    { header: "Department", accessor: "department" },
    { header: "Location", accessor: "location" },
    { header: "Posted Date", accessor: "postedDate" },
    { header: "Applicants", accessor: "applicants" },
    { header: "Status", accessor: "statusBadge" },
    { header: "Actions", accessor: "actions" },
];

export default function JobOfferTableSection() {
    const filtered = JOB_OFFERS;

    const statusVariant = {
        Open: "success",
        Closed: "danger",
        Pending: "warning",
        Draft: "secondary",
    };

    const tableData = useMemo(() => {
        return filtered.map((job) => ({
            ...job,
            statusBadge: (
                <Badge
                    label={job.status}
                    variant={statusVariant[job.status] || "secondary"}
                    outlined={false}
                />
            ),
            actions: (
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                        View
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-500 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                        Edit
                    </button>
                </div>
            ),
        }));
    }, [filtered]);

    return (
        <div className="p-6">
            <SearchSection />

            {tableData.length > 0 ? (
                <Table columns={COLUMNS} data={tableData} />
            ) : (
                <div className="text-center py-16 text-gray-400 text-sm">
                    No job offers match your search or filter.
                </div>
            )}
        </div>
    );
}
