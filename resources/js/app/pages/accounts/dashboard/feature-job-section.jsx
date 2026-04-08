import Button from "@/app/_components/button";
import {
    ArrowUpIcon,
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    DollarSign,
    MapPin, // Switched to MapPin as LocationEditIcon is non-standard in some lucide versions
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
    padding = "p-4 sm:p-5", // Responsive padding
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

    // Removed lg:col-span-3 to allow the parent container to control the width
    const baseClasses = `flex flex-col rounded-lg transition-all hover:shadow-lg cursor-pointer ${padding}`;

    const variantClasses = outlined
        ? (() => {
              switch (variant) {
                  case "danger": return "bg-transparent border border-red-500 text-red-500";
                  case "warning": return "bg-transparent border border-orange-400 text-orange-400";
                  case "success": return "bg-transparent border border-green-500 text-green-500";
                  case "primary": return "bg-transparent border border-blue-500 text-blue-500";
                  default: return "bg-transparent border border-gray-300 text-gray-900";
              }
          })()
        : variantMap[variant] || variantMap.default;

    return (
        <a
            href={href}
            onClick={onClick}
            {...props}
            className={`${baseClasses} ${variantClasses} ${className} shadow-sm border border-gray-200 transition duration-300 ease-in-out`}
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
        description: "We are looking for an experienced Senior Software Engineer to join our growing IT team.",
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
        description: "Seeking an experienced HR Manager to oversee all HR operations.",
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
        description: "Lead data analysis initiatives, develop reporting dashboards, and provide strategic insights.",
        postedDate: "2/16/2026",
        closesDate: "4/30/2026",
        featured: true,
    },
];

const formatSalary = (num) => "₱" + num.toLocaleString("en-PH");

function JobCard({ job }) {
    return (
        <Card
            variant="default"
            outlined={false}
            className="border-gray-200 rounded-xl hover:shadow-md"
        >
            {/* Title and Featured Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {job.title}
                </h3>
                {job.featured && (
                    <span className="inline-flex items-center w-fit gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        Featured
                    </span>
                )}
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                    {job.department}
                </span>
                <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.location}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
                </span>
            </div>

            <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {job.description}
            </p>

            {/* Footer: Dates and Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-50">
                <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Posted {job.postedDate}
                    </span>
                    <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        Closes {job.closesDate}
                    </span>
                </div>
                <Button className="w-full sm:w-auto text-sm" onClick={(e) => e.stopPropagation()}>
                    Apply Now
                </Button>
            </div>
        </Card>
    );
}

export default function FeatureJobSection() {
    return (
        <section className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <StarsIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            Featured Job Opportunities
                        </h2>
                    </div>
                    <button className="flex items-center w-fit gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                        View All <ArrowUpIcon className="w-4 h-4 rotate-45" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>
        </section>
    );
}