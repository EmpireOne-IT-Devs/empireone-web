import React, { useCallback, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import {
    Bell,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    FileText,
    Newspaper,
} from "lucide-react";
import Button from "@/app/_components/button";
import Skeleton from "@/app/_components/skeleton";
import { get_recent_activity_thunk } from "@/app/redux/recent-activity-thunk";

const activityPresentation = {
    post: {
        icon: Newspaper,
        color: "bg-blue-50 text-blue-600",
        sourceColor: "bg-blue-50 text-blue-700",
    },
    event: {
        icon: CalendarDays,
        color: "bg-amber-50 text-amber-600",
        sourceColor: "bg-amber-50 text-amber-700",
    },
    ticket: {
        icon: CheckCircle2,
        color: "bg-rose-50 text-rose-600",
        sourceColor: "bg-rose-50 text-rose-700",
    },
    application: {
        icon: FileText,
        color: "bg-emerald-50 text-emerald-600",
        sourceColor: "bg-emerald-50 text-emerald-700",
    },
};

function formatRelativeTime(timestamp) {
    const seconds = Math.round((timestamp - Date.now()) / 1000);
    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    for (const [unit, secondsPerUnit] of units) {
        if (Math.abs(seconds) >= secondsPerUnit) {
            return formatter.format(Math.round(seconds / secondsPerUnit), unit);
        }
    }

    return formatter.format(seconds, "second");
}

export default function RecentActivityCardSection() {
    const dispatch = useDispatch();
    const { items: activities, loading, error } = useSelector(
        (store) => store.recent_activity,
    );
    const userRole = window.location.pathname.split("/")[2];
    const activitiesPath = `/accounts/${userRole}/activities/home`;
    const loadActivities = useCallback(
        () => dispatch(get_recent_activity_thunk()),
        [dispatch],
    );

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    const errorMessage =
        typeof error === "string"
            ? error
            : error?.message || "Unable to load recent activity.";

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50">
                        <Bell
                            aria-hidden="true"
                            className="h-4 w-4 text-violet-600"
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Recent Activity
                        </h2>
                        <p className="text-xs text-slate-500">
                            Your latest updates
                        </p>
                    </div>
                </div>
                <Link
                    href={activitiesPath}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                    View all
                    <ChevronRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                    />
                </Link>
            </div>

            {loading ? (
                <div
                    role="status"
                    aria-label="Loading recent activity"
                    className="space-y-4 p-4"
                >
                    <Skeleton variant="text" lines={4} />
                </div>
            ) : error ? (
                <div role="alert" className="space-y-3 px-4 py-5">
                    <p className="text-sm text-rose-700">{errorMessage}</p>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={loadActivities}
                        loading={loading}
                        className="gap-2"
                    >
                        Try again
                    </Button>
                </div>
            ) : activities.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-8 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <Bell aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                        No recent activity
                    </h3>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                        New posts, applications, and ticket updates will appear
                        here.
                    </p>
                    <Link
                        href={activitiesPath}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                        Browse activities
                        <ChevronRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                    </Link>
                </div>
            ) : (
                <ul className="space-y-1 p-3">
                    {activities.map((item, index) => {
                        const presentation =
                            activityPresentation[item.type] ||
                            activityPresentation.post;
                        const Icon = presentation.icon;

                        return (
                            <li
                                key={item.id}
                                className="flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-violet-50/60"
                            >
                                <div className="relative flex w-9 shrink-0 justify-center">
                                    {index < activities.length - 1 && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute bottom-[-1.25rem] top-8 w-px bg-violet-100"
                                        />
                                    )}
                                    <span
                                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${presentation.color}`}
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold leading-snug text-slate-800">
                                        {item.title}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                        <span
                                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${presentation.sourceColor}`}
                                        >
                                            {item.source}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            {formatRelativeTime(item.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
