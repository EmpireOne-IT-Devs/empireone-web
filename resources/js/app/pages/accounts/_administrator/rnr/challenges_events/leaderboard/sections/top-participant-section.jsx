import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Flame, Medal } from "lucide-react";
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
        () => participants.filter((participant) => participant.is_winner),
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

            {/* Podium */}
            {winners.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                    {submissionType === "team"
                        ? "No team has earned approved challenge points yet."
                        : "No participant has earned approved challenge points yet."}
                </div>
            ) : (
                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    {winners.map((participant) => (
                        <article
                            key={participant.id}
                            className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4"
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-white ${getAvatarColor(participant.name)}`}
                            >
                                {getInitials(participant.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-semibold text-gray-900">
                                    {participant.name}
                                </h3>
                                <p className="text-sm font-semibold text-green-700">
                                    {participant.points_awarded} pts
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Medal className="h-6 w-6 text-amber-500" />
                                <Badge
                                    label={
                                        participant.winner_count > 1
                                            ? "Co-winner"
                                            : "Winner"
                                    }
                                    variant="warning"
                                    outlined
                                />
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
