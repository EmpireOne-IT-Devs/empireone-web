import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
    FaFire as Flame,
    FaMedal as Medal,
    FaTrophy as Trophy,
} from "react-icons/fa";
import Badge from "@/app/_components/badge";

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

function formatOrdinal(rank) {
    if (rank % 100 >= 11 && rank % 100 <= 13) {
        return `${rank}th`;
    }

    const suffix = { 1: "st", 2: "nd", 3: "rd" }[rank % 10] ?? "th";
    return `${rank}${suffix}`;
}

export default function TopParticipantSection({ submissionType = "individual" }) {
    const {
        rewardChallengeIndividualParticipants = [],
        rewardChallengeTeamSubmissions = [],
        rewardChallengeParticipantsChallenge: challenge,
    } = useSelector((state) => state.engagement);

    const participants =
        submissionType === "team"
            ? rewardChallengeTeamSubmissions
            : rewardChallengeIndividualParticipants;

    const winners = useMemo(
        () => participants
            .filter((participant) => participant.is_winner)
            .sort((first, second) => (first.rank ?? Infinity) - (second.rank ?? Infinity))
            .slice(0, 3),
        [participants],
    );

    if (!challenge) return null;

    return (
        <section className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-green-50/70 to-white px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100">
                        <Flame className="h-6 w-6 text-orange-500" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {challenge.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {challenge.type} · {challenge.category} ·
                            Deadline:{" "}
                            {challenge.deadline
                                ? new Date(
                                      challenge.deadline,
                                  ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  })
                                : "—"}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                        {participants.length}
                    </div>
                    <div className="text-xs text-gray-400">
                        {submissionType === "team" ? "teams" : "participants"}
                    </div>
                </div>
            </div>

            {winners.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                    {submissionType === "team"
                        ? "No team has earned approved challenge points yet."
                        : "No participant has earned approved challenge points yet."}
                </div>
            ) : (
                <div className="flex min-h-64 items-end justify-center gap-3 bg-gradient-to-b from-slate-50/70 to-white px-4 pb-6 pt-10 sm:gap-6">
                    {winners.map((participant) => {
                        const rank = participant.rank;
                        const rankStyle =
                            rank === 1
                                ? {
                                      avatar: "h-14 w-14 text-base",
                                      podium: "h-24",
                                      medal: "text-amber-500",
                                      order: "order-2",
                                  }
                                : rank === 2
                                  ? {
                                        avatar: "h-12 w-12 text-sm",
                                        podium: "h-16",
                                        medal: "text-slate-400",
                                        order: "order-1",
                                    }
                                  : {
                                        avatar: "h-12 w-12 text-sm",
                                        podium: "h-12",
                                        medal: "text-orange-500",
                                        order: "order-3",
                                    };

                        return (
                            <article
                                key={participant.id}
                                className={`flex w-28 flex-col items-center text-center sm:w-36 ${rankStyle.order}`}
                            >
                                <Medal className={`mb-2 h-5 w-5 ${rankStyle.medal}`} />
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    {formatOrdinal(rank)} Place
                                </p>
                                <div
                                    className={`mb-2 flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-4 ring-white shadow-sm ${rankStyle.avatar} ${getAvatarColor(participant.name)}`}
                                >
                                    {getInitials(participant.name)}
                                </div>
                                <h3 className="max-w-full truncate text-xs font-semibold text-gray-900 sm:text-sm">
                                    {participant.name}
                                </h3>
                                <p className="mt-1 text-xs font-semibold text-green-700 sm:text-sm">
                                    {Number(participant.points_awarded) || 0} pts
                                </p>
                                <Badge
                                    label={
                                        participant.winner_count > 1
                                            ? "Co-winner"
                                            : "Winner"
                                    }
                                    variant="warning"
                                    outlined
                                    className="mt-1"
                                />
                                <div
                                    className={`mt-2 flex w-full items-end justify-center rounded-t-2xl bg-green-100/90 pb-2 text-sm font-bold text-gray-700 ${rankStyle.podium}`}
                                    aria-label={`Rank ${rank}`}
                                >
                                    #{rank}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
