import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Flame, Medal } from "lucide-react";

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

/**
 * Ranks approved participants by fastest completion time (submitted_at - joined_at).
 */
function fastestCompleted(participants) {
    return participants
        .filter((p) => p.status === "approved" && p.joined_at && p.submitted_at)
        .map((p) => ({
            ...p,
            durationMs:
                new Date(p.submitted_at).getTime() -
                new Date(p.joined_at).getTime(),
        }))
        .sort((a, b) => a.durationMs - b.durationMs);
}

export default function TopParticipantSection({ challengeId }) {
    const dispatch = useDispatch();
    const {
        rewardChallengeParticipants = [],
        rewardChallengeParticipantsChallenge: challenge,
    } = useSelector((state) => state.engagement);

    useEffect(() => {
        if (!challengeId) return;
        dispatch(
            get_engagement_reward_challenge_participants_thunk(challengeId),
        );
    }, [dispatch, challengeId]);

    const topThree = useMemo(
        () => fastestCompleted(rewardChallengeParticipants).slice(0, 3),
        [rewardChallengeParticipants],
    );

    const podium = useMemo(() => {
        const [first, second, third] = topThree;
        return [
            second && { ...second, rank: 2, position: "left" },
            first && { ...first, rank: 1, position: "center" },
            third && { ...third, rank: 3, position: "right" },
        ].filter(Boolean);
    }, [topThree]);

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
                        {challenge.participants_count ?? 0}
                    </div>
                    <div className="text-xs text-gray-400">participants</div>
                </div>
            </div>

            {/* Podium */}
            {podium.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                    No participants have completed this challenge yet.
                </div>
            ) : (
                <div className="relative flex min-h-[300px] items-end justify-center gap-4 px-6 pt-16">
                    {podium.map((participant) => {
                        const isFirst = participant.rank === 1;

                        return (
                            <div
                                key={participant.rank}
                                className={`flex w-28 flex-col items-center ${
                                    isFirst ? "z-10" : ""
                                }`}
                            >
                                {/* Medal */}
                                <div className="mb-2 flex h-8 items-center justify-center">
                                    <Medal
                                        className={`h-7 w-7 ${
                                            participant.rank === 1
                                                ? "text-yellow-500"
                                                : participant.rank === 2
                                                  ? "text-gray-400"
                                                  : "text-orange-400"
                                        }`}
                                    />
                                </div>

                                {/* Avatar */}
                                <div
                                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-white ${getAvatarColor(participant.name)}`}
                                >
                                    {getInitials(participant.name)}
                                </div>

                                {/* Name */}
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {participant.name}
                                </h3>

                                {/* Points */}
                                <p className="mt-1 text-sm font-semibold text-green-600">
                                    {(participant.points_awarded ??
                                        challenge.points ??
                                        0)}{" "}
                                    pts
                                </p>

                                {/* Podium */}
                                <div
                                    className={`mt-2 flex w-full items-end justify-center rounded-t-xl bg-green-100/80 ${
                                        isFirst ? "h-28" : "h-20"
                                    }`}
                                >
                                    <span className="mb-3 text-sm font-bold text-gray-700">
                                        #{participant.rank}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
