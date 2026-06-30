import React from "react";
import Table from "@/app/_components/table";
import { TbFileText } from "react-icons/tb";

const categoryColors = {
    "Events Calendar": "bg-indigo-100 text-indigo-600",
    "Company Newsfeed": "bg-blue-100 text-blue-600",
    Polls: "bg-purple-200 text-purple-700",
    "Department Showcases": "bg-cyan-100 text-cyan-600",
};

const events = [
    {
        event_id: "EID-01",
        title: "Q3 Townhall Meeting",
        description: "Company-wide quarterly update covering goals and roadmap.",
        category: "Events Calendar",
        date: "Oct 15, 2025",
        status: "Completed",
    },
    {
        event_id: "EID-02",
        title: "New Health Benefits Rollout",
        description: "Announcing expanded medical and wellness coverage for all staff.",
        category: "Company Newsfeed",
        date: "Oct 10, 2025",
        status: "Completed",
    },
    {
        event_id: "EID-03",
        title: "Annual Company Picnic",
        description: "Family-friendly outdoor event with food, games and prizes.",
        category: "Events Calendar",
        date: "Oct 10, 2025",
        status: "Completed",
    },
    {
        event_id: "EID-04",
        title: "Return to Office Preferences",
        description: "Poll gathering employee preferences on hybrid work arrangements.",
        category: "Polls",
        date: "Oct 10, 2025",
        status: "Completed",
    },
    {
        event_id: "EID-05",
        title: "Engineering Team Hackathon",
        description: "48-hour internal hackathon showcasing the engineering department.",
        category: "Department Showcases",
        date: "Oct 10, 2025",
        status: "Completed",
    },
];

const columns = [
    {
        header: "Event ID",
        accessor: "event_id",
    },
    {
        header: "Event",
        accessor: "event",
    },
    {
        header: "Category",
        accessor: "category",
    },
    {
        header: "Date",
        accessor: "date",
    },
    {
        header: "Status",
        accessor: "status",
    },
    {
        header: "Survey",
        accessor: "survey",
    },
];

const data = events.map((e) => ({
    event_id: <span className="text-gray-600 text-sm">{e.event_id}</span>,
    event: (
        <div>
            <p className="font-semibold text-gray-900">{e.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{e.description}</p>
        </div>
    ),
    category: (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[e.category]}`}>
            {e.category}
        </span>
    ),
    date: <span className="text-gray-600 text-sm">{e.date}</span>,
    status: (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
            {e.status}
        </span>
    ),
    survey: (
        <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition">
            <TbFileText className="text-base" />
            Open Survey
        </button>
    ),
}));

export default function TableSection() {
    return (
        <div className="mt-3">
            <Table columns={columns} data={data} />
        </div>
    );
}

