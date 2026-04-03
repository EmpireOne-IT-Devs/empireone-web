import Button from "@/app/_components/button";
import {
    ArrowUpIcon,
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    DollarSign,
    LocationEditIcon,
    StarIcon,
    StarsIcon,
} from "lucide-react";
import React from "react";

// ── Card Component ────────────────────────────────────────────────────────────
function Card({
    children,
    href,
    onClick,
    variant = "default",
    outlined = false,
    padding = "p-5",
    className = "",
    ...props
}) {
    const variantMap = {
        primary: "bg-blue-500 text-white",
        default: "bg-white text-gray-900",
        danger: "bg-red-500 text-white",
        warning: "bg-orange-400 text-gray-900",
        success: "bg-green-500 text-white",
    };

    const baseClasses = `flex flex-col rounded-lg transition-all hover:shadow-lg lg:col-span-3 cursor-pointer ${padding}`;

    const variantClasses = outlined
        ? (() => {
              switch (variant) {
                  case "danger":
                      return "bg-transparent border border-red-500 text-red-500";
                  case "warning":
                      return "bg-transparent border border-orange-400 text-orange-400";
                  case "success":
                      return "bg-transparent border border-green-500 text-green-500";
                  case "primary":
                      return "bg-transparent border border-blue-500 text-blue-500";
                  default:
                      return "bg-transparent border border-gray-300 text-gray-900";
              }
          })()
        : variantMap[variant] || variantMap.default;

    return (
        <a
            href={href}
            onClick={onClick}
            {...props}
            className={`${baseClasses} ${variantClasses} ${className} shadow-sm border border-1 transition duration-300 ease-in-out`}
        >
            {children}
        </a>
    );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const jobs = [
    {
        id: 1,
        title: "Senior Software Engineer",
        department: "IT",
        location: "Manila",
        salaryMin: 80000,
        salaryMax: 120000,
        description:
            "We are looking for an experienced Senior Software Engineer to join our growing IT team.",
        postedDate: "12/1/2024",
        closesDate: "12/31/2024",
        featured: true,
    },
    {
        id: 2,
        title: "HR Manager",
        department: "Human Resources",
        location: "Quezon City",
        salaryMin: 60000,
        salaryMax: 90000,
        description:
            "Seeking an experienced HR Manager to oversee all HR operations.",
        postedDate: "12/5/2024",
        closesDate: "12/25/2024",
        featured: true,
    },
    {
        id: 3,
        title: "Senior Data Analyst",
        department: "Business Analytics",
        location: "Manila HQ",
        salaryMin: 70000,
        salaryMax: 100000,
        description:
            "Lead data analysis initiatives, develop reporting dashboards, and provide strategic insights to management.",
        postedDate: "2/16/2026",
        closesDate: "4/30/2026",
        featured: true,
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatSalary = (num) => "₱" + num.toLocaleString("en-PH");

function JobCard({ job }) {
    return (
        <Card
            variant="default"
            outlined={false}
            padding="p-5"
            href={undefined}
            onClick={(e) => e.preventDefault()}
            className="border-gray-200 rounded-xl hover:shadow-md"
        >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-base font-semibold text-gray-900">
                    {job.title}
                </h3>
                {job.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        <StarIcon filled className="w-4 h-4 text-yellow-400" />
                        Featured
                    </span>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                    <BriefcaseIcon className="w-4 h-4" />
                    {job.department}
                </span>
                <span className="flex items-center gap-1.5">
                    <LocationEditIcon className="w-4 h-4" />
                    {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    {formatSalary(job.salaryMin)} –{" "}
                    {formatSalary(job.salaryMax)}
                </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {job.description}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-3 mt-auto">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Posted {job.postedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5" />
                        Closes {job.closesDate}
                    </span>
                </div>
                <Button onClick={(e) => e.stopPropagation()}>Apply Now</Button>
            </div>
        </Card>
    );
}

export default function FeatureJobSection() {
    return (
        <div className="bg-gray-50 min-h-10 p-2 flex items-start justify-center border border-gray-200 rounded-lg mt-8">
            <div className="w-full bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <StarsIcon filled className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Featured Job Opportunities
                        </h2>
                    </div>
                    <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        View All <ArrowUpIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
}
