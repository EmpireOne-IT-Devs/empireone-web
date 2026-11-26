import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, RotateCw, Sparkles, Trophy } from "lucide-react";
import Button from "@/app/_components/button";
import Skeleton from "@/app/_components/skeleton";
import { get_engagement_reward_challenge_profile_summary_thunk } from "@/app/redux/engagement-thunk";

const activeStatuses = ["joined", "submitted", "pending_survey"];

function getErrorMessage(error) {
    if (typeof error === "string") return error;

    return error?.message || "Unable to load your engagement summary.";
}

function TrophyIllustration() {
    return (
        <div
            className="pointer-events-none absolute right-2 top-4 z-10 -translate-y-1/2 select-none sm:right-4"
            aria-hidden="true"
        >
            <img
                src="/images/Glossy Golden Trophy with Stars.png"
                alt=""
                className="h-32 w-32 object-contain drop-shadow-sm sm:h-40 sm:w-40"
            />
        </div>
    );
}

export default function EngagementCardSection() {
    const dispatch = useDispatch();

    const {
        challengeProfileSummary,
        challengeProfileSummaryLoading,
        challengeProfileSummaryError,
    } = useSelector((store) => store.engagement);

    const [initialLoading, setInitialLoading] = useState(true);

    const userRole = window.location.pathname.split("/")[2];
    const challengePath =
        userRole === "administrator"
            ? "/accounts/administrator/rnr/challenges_events/join"
            : userRole === "employee"
              ? "/accounts/employee/rnr/challenge_event"
              : null;

    useEffect(() => {
        let isMounted = true;

        dispatch(
            get_engagement_reward_challenge_profile_summary_thunk(),
        ).finally(() => {
            if (isMounted) {
                setInitialLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    const summary = challengeProfileSummary ?? {};

    const history = Array.isArray(summary.challenge_history)
        ? summary.challenge_history
        : [];

    const activeChallenges = history.filter((challenge) =>
        activeStatuses.includes(challenge.status),
    ).length;

    const totalPoints = Number(summary.total_points) || 0;

    const isLoading = initialLoading || challengeProfileSummaryLoading;

    const errorMessage = challengeProfileSummaryError
        ? getErrorMessage(challengeProfileSummaryError)
        : null;

    return (
        <section className="relative isolate overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {/* Subtle top-right warm & lavender ambient tint */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-amber-100/70 blur-2xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-24 top-0 h-28 w-36 rounded-full bg-violet-100/50 blur-2xl"
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between gap-3 px-4 pt-4 pb-2 sm:px-6 sm:pt-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50/90 text-amber-500 ring-1 ring-amber-200/60">
                        <Trophy
                            aria-hidden="true"
                            className="h-5 w-5"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-[15px] font-bold leading-snug text-slate-900">
                                My Engagement
                            </h2>

                            <Sparkles
                                aria-hidden="true"
                                className="h-4 w-4 text-violet-500"
                            />
                        </div>

                        <p className="text-xs text-slate-500">
                            Your activity and challenges
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative px-4 pb-4 pt-2 sm:px-6 sm:pb-5">
                {/* Trophy illustration — hidden during loading/error */}
                {!isLoading && !errorMessage && <TrophyIllustration />}

                {isLoading ? (
                    <div
                        role="status"
                        aria-label="Loading engagement summary"
                        className="space-y-4 py-2"
                    >
                        <Skeleton variant="text" lines={3} />
                    </div>
                ) : errorMessage ? (
                    <div role="alert" className="space-y-3 py-2">
                        <p className="text-sm text-rose-700">
                            {errorMessage}
                        </p>

                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                                dispatch(
                                    get_engagement_reward_challenge_profile_summary_thunk(),
                                )
                            }
                            loading={challengeProfileSummaryLoading}
                            className="gap-2"
                        >
                            <RotateCw
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                            />
                            Try again
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Points */}
                        <div className="relative z-10 max-w-[65%] sm:max-w-[70%]">
                            <p className="text-xs font-medium text-slate-500">
                                Points earned through activities and challenges
                            </p>

                            <p className="mt-1.5 text-3xl font-bold tracking-tight text-violet-700 sm:text-[34px]">
                                {totalPoints.toLocaleString()}

                                <span className="ml-1.5 text-base font-medium text-violet-600 sm:text-lg">
                                    pts
                                </span>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <Sparkles
                                    aria-hidden="true"
                                    className="h-4 w-4 shrink-0 text-violet-600"
                                />

                                <span className="truncate text-xs font-medium text-slate-700">
                                    {activeChallenges} active{" "}
                                    {activeChallenges === 1
                                        ? "challenge"
                                        : "challenges"}
                                </span>
                            </div>

                            {challengePath && (
                                <Link
                                    href={challengePath}
                                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-violet-700 transition-colors hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                                >
                                    View Challenges

                                    <ArrowRight
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5"
                                    />
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}