import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";
import Skeleton from "@/app/_components/skeleton";
import Badge from "@/app/_components/badge";
import { CheckCircle2, Medal, Trophy, Circle } from "lucide-react";


const AVATAR_COLORS = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-indigo-700",
    "bg-indigo-500",
    "bg-pink-600",
    "bg-emerald-600",
    "bg-purple-600",
];

function getInitials(name = "") {
    return (
        name
            .trim()
            .split(/\s+/)
            .map((part) => part[0]?.toUpperCase())
            .slice(0, 2)
            .join("") || "?"
    );
}

function getAvatarColor(seed = "") {
    const index = seed
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function formatDuration(joinedAt, submittedAt) {
    if (!joinedAt || !submittedAt) return "—";
    const ms = new Date(submittedAt).getTime() - new Date(joinedAt).getTime();
    if (!Number.isFinite(ms) || ms < 0) return "—";

    const minutes = Math.round(ms / 60000);
    if (minutes < 60) return `${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m`;

    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
}

function RankCell({ rank }) {
    if (!rank) return <span className="text-sm text-gray-400">—</span>;

    if (rank <= 3) {
        const medalColor =
            rank === 1
                ? "text-amber-500"
                : rank === 2
                  ? "text-sky-500"
                  : "text-orange-500";

        return (
            <div className="flex flex-col items-center justify-center gap-0.5">
                <Medal className={`h-5 w-5 ${medalColor}`} />
                <span className="text-xs font-bold text-gray-500">
                    {rank}
                </span>
            </div>
        );
    }

    return <span className="text-lg font-bold text-black">#{rank}</span>;
}

function ParticipantCell({ name, email, isWinner, winnerCount }) {
    return (
        <div className="flex items-center gap-3 min-w-0">
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(name)}`}
            >
                {getInitials(name)}
            </div>
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-900">
                    {name}
                </div>
                <div className="truncate text-xs text-gray-400">{email}</div>
                {isWinner && (
                    <Badge
                        label={winnerCount > 1 ? "Co-winner" : "Winner"}
                        variant="warning"
                        outlined
                        className="mt-1"
                    />
                )}
            </div>
        </div>
    );
}

function ProgressCell({ progress }) {
    return (
        <div className="flex items-center gap-3 min-w-[140px]">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span className="text-sm font-medium text-gray-600">
                {progress}%
            </span>
        </div>
    );
}

function PrizeCell({ eligible }) {
    if (eligible) {
        return (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                ✓ Eligible
            </span>
        );
    }

    return <span className="text-gray-400">—</span>;
}

function VerifiedCell({ verified }) {
    return verified ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
        <Circle className="h-5 w-5 text-gray-300" />
    );
}

export default function ParticipantTableSection({
    submissionType = "individual",
    limit = 10,
}) {
    const {
        rewardChallengeIndividualParticipants = [],
        rewardChallengeTeamSubmissions = [],
        rewardChallengeParticipantsLoading,
        rewardChallengeParticipantsError,
    } = useSelector((state) => state.engagement);

    const participants =
        submissionType === "team"
            ? rewardChallengeTeamSubmissions
            : rewardChallengeIndividualParticipants;

    const ranked = useMemo(
        () => participants.slice(0, limit),
        [participants, limit],
    );

    const columns = [
        { header: "RANK", accessor: "rank" },
        {
            header: submissionType === "team" ? "TEAM" : "PARTICIPANT",
            accessor: "participant",
        },
        { header: "DEPARTMENT", accessor: "department" },
        { header: "POINTS", accessor: "points" },
        { header: "COMPLETED", accessor: "completed" },
        { header: "DURATION", accessor: "duration" },
        { header: "% DONE", accessor: "progress" },
        { header: "BADGE", accessor: "badge" },
        { header: "PRIZE", accessor: "prize" },
        { header: "VERIFIED", accessor: "verified" },
    ];

    const data = ranked.map((participant) => {
        const isApproved = participant.status === "approved";
        const isSubmitted = participant.status === "submitted";
        const isDeclined = participant.status === "declined";
        const points = isApproved ? Number(participant.points_awarded) || 0 : 0;
        const progress = isApproved ? 100 : isSubmitted ? 90 : 0;
        const badge =
            participant.rank && participant.rank <= 3 && isApproved
                ? "🏅"
                : isApproved
                  ? "💪"
                  : "—";

        return {
            id: participant.participant_id,
            rank: <RankCell rank={participant.rank} />,
            participant: (
                <ParticipantCell
                    name={participant.name}
                    email={participant.email}
                    isWinner={participant.is_winner}
                    winnerCount={participant.winner_count}
                />
            ),
            department: (
                <span className="text-sm text-gray-600">
                    {participant.department ?? "—"}
                </span>
            ),
            points: (
                <div>
                    <span className="text-sm font-semibold text-green-600">
                        {points}
                    </span>
                    {isApproved && (
                        <p className="text-xs text-gray-400">
                            {participant.challenge_points_awarded ?? points} base
                            {" + "}
                            {participant.bonus_points_awarded ?? 0} bonus
                        </p>
                    )}
                </div>
            ),
            completed: (
                <span
                    className={`text-sm ${isApproved ? "text-gray-600" : "text-orange-500"}`}
                >
                    {isApproved
                        ? moment(participant.submitted_at).format(
                              "MMM D h:mm A",
                          )
                        : isSubmitted
                          ? "Pending Review"
                          : isDeclined
                            ? "Declined"
                            : "In Progress"}
                </span>
            ),
            duration: (
                <span className="text-sm text-gray-600">
                    {isApproved
                        ? formatDuration(
                              participant.joined_at,
                              participant.submitted_at,
                          )
                        : "—"}
                </span>
            ),
            progress: <ProgressCell progress={progress} />,
            badge: (
                <span className="text-lg leading-none" aria-label="badge">
                    {badge}
                </span>
            ),
            prize: <PrizeCell eligible={isApproved} />,
            verified: <VerifiedCell verified={isApproved} />,
        };
    });

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            {submissionType === "team"
                                ? "Team Submission Leaderboard"
                                : "Individual Submission Leaderboard"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {submissionType === "team"
                                ? "Teams ranked by approved challenge points, including bonuses"
                                : "Participants ranked by approved challenge points, including bonuses"}
                        </p>
                    </div>
                </div>
            </div>

            {rewardChallengeParticipantsLoading ? (
                <div className="p-5">
                    <Skeleton variant="table" />
                </div>
            ) : rewardChallengeParticipantsError ? (
                <div className="p-5 text-sm text-red-500">
                    Failed to load leaderboard participants.
                </div>
            ) : ranked.length === 0 ? (
                <div className="p-5 text-sm text-gray-500">
                    {submissionType === "team"
                        ? "No team submissions have been recorded for this challenge."
                        : "No individual participants have joined this challenge."}
                </div>
            ) : (
                <Table columns={columns} data={data} />
            )}
        </section>
    );
}
