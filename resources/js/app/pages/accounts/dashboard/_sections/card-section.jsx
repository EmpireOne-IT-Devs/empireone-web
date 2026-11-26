import React from "react";
import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    BriefcaseBusiness,
    FileCheck2,
    Mail,
    MessageCircle,
    Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import Card from "@/app/_components/card";

export default function CardSection() {
    const { data } = useSelector((store) => store.app);
    const { job_postings } = useSelector((store) => store.job_postings);

    const userRole = window.location.pathname.split("/")[2];

    const cards = [
        {
            label: "Job Openings",
            value:
                data?.dashboard?.total_job_opening ??
                job_postings?.length ??
                0,
            caption: "Explore current opportunities",
            href: `/accounts/${userRole}/job_openings`,
            icon: BriefcaseBusiness,
            iconStyle: "bg-indigo-100 text-indigo-600",
            gradient: "from-indigo-50 via-white to-indigo-100",
            accent: "text-indigo-700",
            border: "border-indigo-100",
            arrow: "border-indigo-200 text-indigo-600 hover:bg-indigo-100",
        },
        {
            label: "Applications",
            value: data?.dashboard?.total_application_submitted ?? 0,
            caption: "Track your applications",
            href: `/accounts/${userRole}/my_applications`,
            icon: FileCheck2,
            iconStyle: "bg-emerald-100 text-emerald-600",
            gradient: "from-emerald-50 via-white to-emerald-100",
            accent: "text-emerald-700",
            border: "border-emerald-100",
            arrow: "border-emerald-200 text-emerald-600 hover:bg-emerald-100",
        },
        {
            label: "Job Offers",
            value: data?.dashboard?.total_job_offer ?? 0,
            caption: "Review your offer",
            href: `/accounts/${userRole}/job_offers`,
            icon: Mail,
            iconStyle: "bg-orange-100 text-orange-600",
            gradient: "from-orange-50 via-white to-orange-100",
            accent: "text-orange-700",
            border: "border-orange-100",
            arrow: "border-orange-200 text-orange-600 hover:bg-orange-100",
        },
        {
            label: "Unread Messages",
            value: 0,
            caption: "View your messages",
            icon: MessageCircle,
            iconStyle: "bg-pink-100 text-pink-600",
            gradient: "from-pink-50 via-white to-pink-100",
            accent: "text-pink-700",
            border: "border-pink-100",
            arrow: "border-pink-200 text-pink-600 hover:bg-pink-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => {
                const Icon = item.icon;

                const content = (
                    <Card
                        key={item.label}
                        padding="p-0"
                        className={`group relative min-w-0 overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.gradient} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
                    >
                        {/* Decorative bottom-right shapes */}
                        <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute -bottom-10 -right-7 h-24 w-36 rounded-[100%] opacity-50 ${item.iconStyle}`}
                        />

                        <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute -bottom-14 right-12 h-24 w-36 rounded-[100%] opacity-30 ${item.iconStyle}`}
                        />

                        {/* Card content */}
                        <div className="relative flex min-h-[104px] items-center gap-3 px-3.5 py-3 sm:gap-4 sm:px-4">
                            {/* Icon */}
                            <div
                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.iconStyle} sm:h-14 sm:w-14`}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className="h-7 w-7"
                                    strokeWidth={2.2}
                                />
                            </div>

                            {/* Text */}
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate text-xs font-semibold text-slate-800">
                                    {item.label}
                                </h2>

                                <p
                                    className={`mt-0.5 text-2xl font-bold leading-none tracking-tight ${item.accent}`}
                                >
                                    {Number(item.value || 0).toLocaleString()}
                                </p>

                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium sm:text-[11px] ${item.accent} transition-all hover:gap-1.5 hover:underline`}
                                    >
                                        <span className="truncate">
                                            {item.caption}
                                        </span>

                                        <ArrowRight
                                            aria-hidden="true"
                                            className="h-3 w-3 shrink-0"
                                        />
                                    </Link>
                                ) : (
                                    <p
                                        className={`mt-1.5 text-[10px] font-medium sm:text-[11px] ${item.accent}`}
                                    >
                                        {item.caption}
                                    </p>
                                )}
                            </div>

                            {/* Circular arrow */}
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    aria-label={`View ${item.label}`}
                                    className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border bg-white/70 backdrop-blur-sm transition-all duration-200 group-hover:scale-110 ${item.arrow}`}
                                >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            ) : (
                                <div
                                    className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border bg-white/70 ${item.arrow}`}
                                >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </div>
                            )}
                        </div>
                    </Card>
                );

                return item.href ? (
                    <div key={item.label}>{content}</div>
                ) : (
                    <div key={item.label}>{content}</div>
                );
            })}
        </div>
    );
}