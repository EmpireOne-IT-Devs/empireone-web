import React, { useState } from "react";
import Table from "@/app/_components/table";
import { Star, Award, Medal, Gem, Diamond } from "lucide-react";
import SearchSection from "./search-section";

const DEPARTMENTS = [
    "All",
    "Design",
    "Engineering",
    "Finance",
    "HR",
    "Marketing",
    "Operations",
    "Product",
    "Sales",
];
const RANKS = ["All", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];

const employees = [
    {
        name: "Sarah Johnson",
        department: "Marketing",
        role: "Marketing · Senior Designer",
        initials: "SJ",
        avatar: "bg-pink-600",
        topPerformer: false,
        points: 580,
        rank: "Silver",
        badges: 4,
        totalBadges: 8,
        lastActive: "Today",
        status: "Active",
    },
    {
        name: "Michael Chen",
        department: "Engineering",
        role: "Engineering · Lead Engineer",
        initials: "MC",
        avatar: "bg-indigo-900",
        topPerformer: true,
        points: 980,
        rank: "Gold",
        badges: 6,
        totalBadges: 8,
        lastActive: "Yesterday",
        status: "Active",
    },
    {
        name: "Emily Rodriguez",
        department: "Sales",
        role: "Sales · Account Executive",
        initials: "ER",
        avatar: "bg-purple-700",
        topPerformer: true,
        points: 1240,
        rank: "Platinum",
        badges: 7,
        totalBadges: 8,
        lastActive: "Today",
        status: "Active",
    },
    {
        name: "James Williams",
        department: "Finance",
        role: "Finance · Finance Analyst",
        initials: "JW",
        avatar: "bg-orange-600",
        topPerformer: false,
        points: 760,
        rank: "Gold",
        badges: 5,
        totalBadges: 8,
        lastActive: "2 days ago",
        status: "Active",
    },
    {
        name: "Aisha Patel",
        department: "HR",
        role: "HR · HR Specialist",
        initials: "AP",
        avatar: "bg-emerald-700",
        topPerformer: false,
        points: 480,
        rank: "Silver",
        badges: 3,
        totalBadges: 8,
        lastActive: "Today",
        status: "Active",
    },
    {
        name: "Carlos Mendoza",
        department: "Operations",
        role: "Operations · Ops Manager",
        initials: "CM",
        avatar: "bg-amber-600",
        topPerformer: true,
        points: 300,
        rank: "Bronze",
        badges: 2,
        totalBadges: 8,
        lastActive: "3 days ago",
        status: "Active",
    },
];

const RANK_STYLES = {
    Bronze: { icon: Award, className: "bg-orange-50 text-orange-700" },
    Silver: { icon: Medal, className: "bg-gray-100 text-gray-600" },
    Gold: { icon: Medal, className: "bg-yellow-50 text-yellow-700" },
    Platinum: { icon: Gem, className: "bg-indigo-50 text-indigo-600" },
    Diamond: { icon: Diamond, className: "bg-sky-50 text-sky-600" },
};

function EmployeeCell({ initials, avatar, name, role, topPerformer }) {
    return (
        <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${avatar}`}
                >
                    {initials}
                </div>
                {topPerformer && (
                    <Star className="absolute -top-1 -right-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                )}
            </div>
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-900">
                    {name}
                </div>
                <div className="truncate text-xs text-gray-400">{role}</div>
            </div>
        </div>
    );
}

function RankBadge({ rank }) {
    const style = RANK_STYLES[rank] || RANK_STYLES.Silver;
    const Icon = style.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {rank}
        </span>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Active: "bg-green-50 text-green-600",
        Inactive: "bg-gray-100 text-gray-500",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || styles.Inactive}`}
        >
            {status}
        </span>
    );
}

function FilterTabs({ options, active, onChange }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        active === option
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default function TableSection() {
    const [department, setDepartment] = useState("All");
    const [rank, setRank] = useState("All");

    const columns = [
        { header: "EMPLOYEE", accessor: "employee" },
        { header: "POINTS", accessor: "points" },
        { header: "RANK", accessor: "rank" },
        { header: "BADGES", accessor: "badges" },
        { header: "LAST ACTIVE", accessor: "lastActive" },
        { header: "STATUS", accessor: "status" },
    ];

    const filteredEmployees = employees.filter(
        (employee) =>
            (department === "All" || employee.department === department) &&
            (rank === "All" || employee.rank === rank),
    );

    const data = filteredEmployees.map((employee, index) => ({
        id: index,
        employee: (
            <EmployeeCell
                initials={employee.initials}
                avatar={employee.avatar}
                name={employee.name}
                role={employee.role}
                topPerformer={employee.topPerformer}
            />
        ),
        points: (
            <span className="text-sm font-bold text-gray-900">
                {employee.points.toLocaleString()}
            </span>
        ),
        rank: <RankBadge rank={employee.rank} />,
        badges: (
            <span className="text-sm text-gray-600">{`${employee.badges}/${employee.totalBadges}`}</span>
        ),
        lastActive: (
            <span className="text-sm text-gray-500">{employee.lastActive}</span>
        ),
        status: <StatusBadge status={employee.status} />,
    }));

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-4">
            <div className="space-y-2">
                <SearchSection />
                <div className="flex gap-4">
                    <FilterTabs
                        options={DEPARTMENTS}
                        active={department}
                        onChange={setDepartment}
                    />
                    <span className="text-gray-400">|</span>
                    <FilterTabs
                        options={RANKS}
                        active={rank}
                        onChange={setRank}
                    />
                </div>
            </div>

            <Table columns={columns} data={data} />
        </section>
    );
}
