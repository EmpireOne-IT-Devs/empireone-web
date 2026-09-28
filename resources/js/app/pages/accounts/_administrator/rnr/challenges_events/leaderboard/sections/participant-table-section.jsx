import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";
import Skeleton from "@/app/_components/skeleton";
import { CheckCircle2, Medal, Trophy, Circle } from "lucide-react";

import { get_engagement_reward_challenge_participants_thunk } from "@/app/redux/engagement-thunk";

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

function formatDuration(ms) {
    if (!Number.isFinite(ms) || ms < 0) return "—";

    const minutes = Math.round(ms / 60000);
    if (minutes < 60) return `${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m`;

    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
}

/**
 * Ranks approved participants by how fast they finished (submitted_at - joined_at),
 * fastest first. Participants who haven't completed yet are appended afterwards,
 * most recently active first.
 */
function rankParticipants(participants) {
    const withDuration = participants.map((participant) => {
        const joinedAt = participant.joined_at
            ? new Date(participant.joined_at)
            : null;
        const submittedAt = participant.submitted_at
            ? new Date(participant.submitted_at)
            : null;
        const durationMs =
            participant.status === "approved" && joinedAt && submittedAt
                ? submittedAt.getTime() - joinedAt.getTime()
                : null;

        return { ...participant, durationMs };
    });

    const completed = withDuration
        .filter((p) => p.durationMs !== null)
        .sort((a, b) => a.durationMs - b.durationMs);

    const inProgress = withDuration
        .filter((p) => p.durationMs === null)
        .sort((a, b) => {
            const aTime = new Date(
                a.submitted_at ?? a.joined_at ?? 0,
            ).getTime();
            const bTime = new Date(
                b.submitted_at ?? b.joined_at ?? 0,
            ).getTime();
            return bTime - aTime;
        });

    return [...completed, ...inProgress].map((participant, index) => ({
        ...participant,
        rank: index + 1,
    }));
}

function RankCell({ rank }) {
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

function ParticipantCell({ name, email }) {
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

export default function ParticipantTableSection({ challengeId, limit = 10 }) {
    const dispatch = useDispatch();
    const {
        rewardChallengeParticipants = [],
        rewardChallengeParticipantsChallenge: challenge,
        rewardChallengeParticipantsLoading,
        rewardChallengeParticipantsError,
    } = useSelector((state) => state.engagement);

    useEffect(() => {
        if (!challengeId) return;
        dispatch(
            get_engagement_reward_challenge_participants_thunk(challengeId),
        );
    }, [dispatch, challengeId]);

    const ranked = useMemo(
        () => rankParticipants(rewardChallengeParticipants).slice(0, limit),
        [rewardChallengeParticipants, limit],
    );

    const columns = [
        { header: "RANK", accessor: "rank" },
        { header: "PARTICIPANT", accessor: "participant" },
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
        const points =
            participant.points_awarded ??
            (isApproved ? (challenge?.points ?? 0) : 0);
        const progress = isApproved ? 100 : isSubmitted ? 90 : 0;
        const badge =
            participant.rank <= 3 && isApproved
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
                />
            ),
            department: (
                <span className="text-sm text-gray-600">
                    {participant.department ?? "—"}
                </span>
            ),
            points: (
                <span className="text-sm font-semibold text-green-600">
                    {points}
                </span>
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
                          : "In Progress"}
                </span>
            ),
            duration: (
                <span className="text-sm text-gray-600">
                    {isApproved
                        ? formatDuration(participant.durationMs)
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
                            Challenge Leaderboard
                        </h2>
                        <p className="text-sm text-gray-500">
                            Participants ranked by fastest completion time
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
                    No participants have joined this challenge yet.
                </div>
            ) : (
                <Table columns={columns} data={data} />
            )}
        </section>
    );
}
