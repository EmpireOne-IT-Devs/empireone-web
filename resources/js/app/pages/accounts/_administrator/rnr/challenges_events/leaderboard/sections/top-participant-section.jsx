import React from "react";
import { Flame, Medal } from "lucide-react";

export default function TopParticipantSection() {
    const participants = [
        {
            rank: 2,
            name: "Grace",
            initials: "GO",
            points: 300,
            color: "bg-blue-500",
            position: "left",
        },
        {
            rank: 1,
            name: "Carlos",
            initials: "CM",
            points: 300,
            color: "bg-orange-500",
            position: "center",
        },
        {
            rank: 3,
            name: "Michael",
            initials: "MC",
            points: 300,
            color: "bg-blue-800",
            position: "right",
        },
    ];

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
                            30-Day Wellness Streak
                        </h2>

                        <p className="text-sm text-gray-500">
                            Individual · Wellness · Deadline: June 30, 2025
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                        5
                    </div>
                    <div className="text-xs text-gray-400">
                        participants
                    </div>
                </div>
            </div>

            {/* Podium */}
            <div className="relative flex min-h-[300px] items-end justify-center gap-4 px-6 pt-16">
                {participants.map((participant) => {
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
                                className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-white ${participant.color}`}
                            >
                                {participant.initials}
                            </div>

                            {/* Name */}
                            <h3 className="text-sm font-semibold text-gray-900">
                                {participant.name}
                            </h3>

                            {/* Points */}
                            <p className="mt-1 text-sm font-semibold text-green-600">
                                {participant.points} pts
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
        </section>
    );
}