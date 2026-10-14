import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Trophy,
    Sparkles,
    Users,
    Target,
    ClipboardCheck,
    ArrowUpRight,
    History,
    Medal,
} from "lucide-react";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import { get_engagement_reward_challenge_profile_summary_thunk } from "@/app/redux/engagement-thunk";

const STATUS_BADGE = {
    joined: { label: "In Progress", variant: "info" },
    submitted: { label: "Pending Review", variant: "warning" },
    pending_survey: { label: "Survey Required", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    declined: { label: "Declined", variant: "danger" },
};

const PAGE_SIZE = 10;

function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatPoints(value) {
    return (Number(value) || 0).toLocaleString();
}

function getChallengePoints(item, isTeamSubmission) {
    if (isTeamSubmission) return 0;
    if (item.challenge_points_awarded != null) {
        return Number(item.challenge_points_awarded) || 0;
    }
    return Math.max(
        0,
        (Number(item.total_points_awarded) || 0) -
            (Number(item.survey_points_awarded) || 0)
    );
}

function PointsBreakdown({ item }) {
    const isTeamSubmission = item.submission_type === "team";

    const bonusPoints = Number(item.bonus_points_awarded ?? 0);
    const teamPoints = isTeamSubmission
        ? Number(
              item.challenge_points_awarded ??
                  Math.max(0, (Number(item.team_points_awarded) || 0) - bonusPoints)
          )
        : 0;

    const challengePoints = getChallengePoints(item, isTeamSubmission);
    const surveyPoints = Number(item.survey_points_awarded ?? 0);

    const breakdown = [
        { label: "Team", points: teamPoints, icon: Users, color: "text-blue-700 bg-blue-50" },
        { label: "Challenge", points: challengePoints, icon: Target, color: "text-emerald-700 bg-emerald-50" },
        { label: "Bonus", points: bonusPoints, icon: Sparkles, color: "text-amber-700 bg-amber-50" },
        { label: "Survey", points: surveyPoints, icon: ClipboardCheck, color: "text-purple-700 bg-purple-50" },
    ].filter((item) => item.points > 0);

    if (!breakdown.length) {
        return <span className="text-xs text-gray-400">No points awarded yet</span>;
    }

    return (
        <div className="flex flex-wrap items-center justify-end gap-1.5">
            {breakdown.map(({ label, points, icon: Icon, color }) => (
                <Badge
                    key={label}
                    label={`+${formatPoints(points)} ${label} pts`}
                    variant={
                        label === "Team"
                            ? "primary"
                            : label === "Survey"
                              ? "purple"
                              : "success"
                    }
                    outlined
                    icon={Icon}
                    className={color}
                >
                </Badge>
            ))}
        </div>
    );
}

function StatCard({ icon: Icon, label, value, description }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <Icon size={18} className="text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatPoints(value)}
            </p>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
    );
}

export default function PointsSummarySection() {
    const dispatch = useDispatch();

    const {
        challengeProfileSummary,
        challengeProfileSummaryLoading,
        challengeProfileSummaryError,
    } = useSelector((state) => state.engagement);

    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_profile_summary_thunk());
    }, [dispatch]);

    const summary = challengeProfileSummary ?? {};
    const history = Array.isArray(summary.challenge_history)
        ? summary.challenge_history
        : [];

    const totalPoints = Number(summary.total_points) || 0;
    const totalChallenges = history.length;
    const approvedChallenges = history.filter(
        (item) => item.status === "approved"
    ).length;

    const lastPage = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
    const currentPage = Math.min(page, lastPage);

    const visibleHistory = history.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const historyColumns = [
        {
            header: "Challenge",
            accessor: "challenge_title",
            width: "w-[34%]",
            render: (item) => (
                <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                        {item.challenge_title || "Untitled Challenge"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {item.category || "General"}
                    </p>
                </div>
            ),
        },
        {
            header: "Participation",
            width: "w-[20%]",
            render: (item) =>
                item.submission_type === "team"
                    ? "Team Submission"
                    : formatDate(item.joined_at)
                      ? `Joined ${formatDate(item.joined_at)}`
                      : "Individual",
        },
        {
            header: "Status",
            width: "w-[18%]",
            render: (item) => {
                const status = STATUS_BADGE[item.status] ?? STATUS_BADGE.joined;
                return <Badge label={status.label} variant={status.variant} />;
            },
        },
        {
            header: "Points",
            width: "w-[28%]",
            render: (item) => <PointsBreakdown item={item} />,
        },
    ];

    const challengeUrl = `/accounts/${window.location.pathname.split("/")[2]}/rnr/challenge_event`;

    return (
        <div className="space-y-6">
            {challengeProfileSummaryError && (
                <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="text-sm text-red-700">
                        {challengeProfileSummaryError.message ||
                            "Unable to refresh your points and challenge history."}
                    </p>
                    <Button
                        outlined
                        loading={challengeProfileSummaryLoading}
                        onClick={() =>
                            dispatch(
                                get_engagement_reward_challenge_profile_summary_thunk()
                            )
                        }
                    >
                        Retry
                    </Button>
                </div>
            )}

            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Sparkles size={14} />
                            Reward & Recognition
                        </div>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Your Points Summary
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Track your participation, history, and earned rewards.
                        </p>
                        <div className="mt-4">
                            <Link
                                href={challengeUrl}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                            >
                                Explore Challenges <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Total Points Earned</p>
                            {challengeProfileSummaryLoading && !challengeProfileSummary ? (
                                <div className="mt-1 h-7 w-24 animate-pulse rounded bg-gray-200" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatPoints(totalPoints)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    icon={Trophy}
                    label="Total Points"
                    value={totalPoints}
                    description="Points accumulated"
                />
                <StatCard
                    icon={Target}
                    label="Challenges Joined"
                    value={totalChallenges}
                    description="Total challenge history"
                />
                <StatCard
                    icon={Medal}
                    label="Approved"
                    value={approvedChallenges}
                    description="Successfully approved"
                />
            </section>

            {/* Challenge history */}
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <History size={18} className="text-gray-500" />
                        <h3 className="text-base font-semibold text-gray-900">
                            Challenge History
                        </h3>
                    </div>
                    <span className="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {totalChallenges} {totalChallenges === 1 ? "challenge" : "challenges"}
                    </span>
                </div>

                {challengeProfileSummaryLoading && history.length === 0 ? (
                    <div className="p-4">
                        <Table columns={historyColumns} data={[]} isloading skeletonRows={3} />
                    </div>
                ) : history.length === 0 && challengeProfileSummaryError ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-gray-700">
                            Challenge history could not be loaded
                        </p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-gray-700">No challenge history found</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Participate in a challenge to start earning points.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="p-2 sm:p-4">
                            <Table columns={historyColumns} data={visibleHistory} />
                        </div>

                        {lastPage > 1 && (
                            <div className="flex justify-center border-t border-gray-200 p-4">
                                <Pagination
                                    data={{
                                        current_page: currentPage,
                                        last_page: lastPage,
                                    }}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}