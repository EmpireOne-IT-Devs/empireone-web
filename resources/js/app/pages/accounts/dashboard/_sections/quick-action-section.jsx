import React from "react";
import { Link } from "@inertiajs/react";
import { useSelector } from "react-redux";
import {
    BriefcaseBusiness,
    ClipboardList,
    FolderOpen,
    UserRound,
    Zap,
    ArrowRight,
} from "lucide-react";

export default function QuickActionSection() {
    const { data } = useSelector((store) => store.app);
    const userRole = window.location.pathname.split("/")[2];

    const requisitionAction = Number(data?.user?.role) === 1;

    const actions = [
        {
            label: "Apply for a Job",
            description: "Browse opportunities",
            href: `/accounts/${userRole}/job_openings`,
            icon: BriefcaseBusiness,
            iconColor: "text-violet-600",
            iconBg: "bg-violet-100",
            cardBg: "from-violet-50 to-white",
            border: "border-violet-100",
            hover: "hover:border-violet-200 hover:shadow-violet-100/70",
        },
        {
            label: requisitionAction
                ? "My Job Requisition"
                : "My Applications",
            description: requisitionAction
                ? "Submit or track a request"
                : "Track your applications",
            href: requisitionAction
                ? `/accounts/${userRole}/my_requisition`
                : `/accounts/${userRole}/my_applications`,
            icon: ClipboardList,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
            cardBg: "from-blue-50 to-white",
            border: "border-blue-100",
            hover: "hover:border-blue-200 hover:shadow-blue-100/70",
        },
        {
            label: "My Documents",
            description: "Access your files",
            href: `/accounts/${userRole}/my_documents`,
            icon: FolderOpen,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-100",
            cardBg: "from-emerald-50 to-white",
            border: "border-emerald-100",
            hover: "hover:border-emerald-200 hover:shadow-emerald-100/70",
        },
        {
            label: "Update My Profile",
            description: "Manage your info",
            href: `/accounts/${userRole}/my_profile/personal`,
            icon: UserRound,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-100",
            cardBg: "from-orange-50 to-white",
            border: "border-orange-100",
            hover: "hover:border-orange-200 hover:shadow-orange-100/70",
        },
    ];

    return (
        <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm sm:p-3">
            {/* Header */}
            <div className="mb-2 flex items-center justify-between gap-3 px-2 py-1 sm:px-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        <Zap
                            aria-hidden="true"
                            className="h-7 w-7 fill-violet-600 text-violet-600"
                            strokeWidth={2.5}
                        />
                    </div>

                    <div>
                        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                            Quick Actions
                        </h2>

                        <p className="text-[11px] text-slate-500 sm:text-xs">
                            Get things done, faster.
                        </p>
                    </div>
                </div>

                <Link
                    href={`/accounts/${userRole}/job_openings`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 transition-all hover:gap-1.5 hover:text-violet-900 sm:text-xs"
                >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.label}
                            href={action.href}
                            className={`group relative flex min-h-[94px] flex-col items-center justify-center overflow-hidden rounded-xl border ${action.border} bg-gradient-to-br ${action.cardBg} px-2.5 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${action.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:min-h-[96px]`}
                        >
                            {/* Decorative glow */}
                            <div
                                aria-hidden="true"
                                className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full ${action.iconBg} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`}
                            />

                            {/* Icon */}
                            <div className="relative mb-2 flex h-8 w-8 items-center justify-center">
                                <Icon
                                    aria-hidden="true"
                                    className={`h-6 w-6 ${action.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5`}
                                    strokeWidth={2.5}
                                />
                            </div>

                            {/* Title */}
                            <h3 className="relative text-[11px] font-bold leading-tight text-slate-800 sm:text-xs">
                                {action.label}
                            </h3>

                            {/* Subtitle */}
                            <p className="relative mt-1 text-[10px] leading-tight text-slate-500 sm:text-[11px]">
                                {action.description}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}