import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    RotateCw,
} from "lucide-react";
import Button from "@/app/_components/button";
import Skeleton from "@/app/_components/skeleton";
import { get_job_application_by_user_thunk } from "@/app/redux/applicant-thunk";

function getErrorMessage(error) {
    if (typeof error === "string") return error;
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load your recent applications."
    );
}

function formatAppliedDate(value) {
    if (!value) return "Date unavailable";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusStyle(status) {
    const normalized = String(status || "").toLowerCase();
    if (
        ["passed", "accepted job offer", "hired", "interview"].some((value) =>
            normalized.includes(value),
        )
    ) {
        return "bg-emerald-50 text-emerald-700";
    }
    if (
        ["failed", "declined", "rejected", "withdrawn"].some((value) =>
            normalized.includes(value),
        )
    ) {
        return "bg-rose-50 text-rose-700";
    }
    if (["scheduled"].some((value) => normalized.includes(value))) {
        return "bg-blue-50 text-blue-700";
    }
    return "bg-amber-50 text-amber-700";
}

export default function RecentApplicationsCardSection() {
    const dispatch = useDispatch();
    const { applications } = useSelector((store) => store.applicants);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);
    const userRole = window.location.pathname.split("/")[2];

    const loadApplications = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await dispatch(get_job_application_by_user_thunk());
        } catch (requestError) {
            if (mountedRef.current) {
                setError(getErrorMessage(requestError));
            }
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [dispatch]);

    useEffect(() => {
        mountedRef.current = true;
        loadApplications();

        return () => {
            mountedRef.current = false;
        };
    }, [loadApplications]);

    const recentApplications = useMemo(() => {
        if (!Array.isArray(applications)) return [];

        return [...applications]
            .sort((first, second) => {
                const firstDate = new Date(first?.created_at).getTime() || 0;
                const secondDate = new Date(second?.created_at).getTime() || 0;
                return secondDate - firstDate;
            })
            .slice(0, 3);
    }, [applications]);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50">
                        <BriefcaseBusiness
                            aria-hidden="true"
                            className="h-4 w-4 text-violet-600"
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            My Recent Applications
                        </h2>
                        <p className="text-xs text-slate-500">
                            Track the status of your applications.
                        </p>
                    </div>
                </div>
                <Link
                    href={`/accounts/${userRole}/my_applications`}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                    View all
                    <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                    />
                </Link>
            </div>

            {isLoading ? (
                <div
                    role="status"
                    aria-label="Loading recent applications"
                    className="space-y-4 px-4 py-5"
                >
                    <Skeleton variant="avatar" />
                    <Skeleton variant="avatar" />
                    <Skeleton variant="avatar" />
                </div>
            ) : error ? (
                <div
                    role="alert"
                    className="flex flex-col items-start gap-3 px-5 py-6"
                >
                    <p className="text-sm text-rose-700">{error}</p>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={loadApplications}
                        className="gap-2"
                    >
                        <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
                        Try again
                    </Button>
                </div>
            ) : recentApplications.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-8 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <BriefcaseBusiness
                            aria-hidden="true"
                            className="h-5 w-5"
                        />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                        No applications yet
                    </h3>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                        Find an opportunity that matches your goals.
                    </p>
                    <Link
                        href={`/accounts/${userRole}/job_openings`}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                        Explore job openings
                        <ArrowRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                        />
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-slate-100 px-4">
                    {recentApplications.map((application, index) => {
                        const title =
                            application?.job_posting?.job_requisition?.title ||
                            application?.job_posting?.title ||
                            "Job application";
                        const status =
                            application?.final_status ||
                            application?.interview_status ||
                            application?.screening_status ||
                            "Submitted";
                        const key =
                            application?.id ??
                            application?.job_application_id ??
                            `${title}-${index}`;

                        return (
                            <li
                                key={key}
                                className="flex min-w-0 items-center gap-3 py-3"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <BriefcaseBusiness
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-800">
                                        {title}
                                    </p>
                                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                        <CalendarDays
                                            aria-hidden="true"
                                            className="h-3 w-3 shrink-0"
                                        />
                                        <span>
                                            Applied{" "}
                                            {formatAppliedDate(
                                                application?.created_at,
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusStyle(status)}`}
                                >
                                    {status}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
