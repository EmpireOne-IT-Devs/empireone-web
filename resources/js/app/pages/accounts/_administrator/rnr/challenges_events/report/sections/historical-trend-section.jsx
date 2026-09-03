import React from "react";
import { TrendingUp, Users, Star, Flame, Lightbulb, Brain, Sprout, BookOpen } from "lucide-react";

export default function HistoricalTrendSection() {
    const quarters = [
        {
            title: "Q1 2025 — 4 Challenges",
            completion: 72,
            participants: "89 participants",
            points: "3,200 pts awarded",
        },
        {
            title: "Q2 2025 — 5 Challenges",
            completion: 81,
            participants: "112 participants",
            points: "4,850 pts awarded",
        },
        {
            title: "Q3 2025 (YTD)",
            completion: 68,
            participants: "47 participants",
            points: "2,100 pts awarded",
        },
    ];

    const topChallenges = [
        {
            rank: 1,
            icon: Flame,
            title: "30-Day Wellness Streak",
            participants: 5,
            iconClass: "text-orange-500",
        },
        {
            rank: 2,
            icon: Lightbulb,
            title: "Innovation Pitch Competition",
            participants: 3,
            iconClass: "text-yellow-400",
        },
        {
            rank: 3,
            icon: Brain,
            title: "Department Trivia Championship",
            participants: 2,
            iconClass: "text-pink-400",
        },
        {
            rank: 4,
            icon: Sprout,
            title: "Sustainability Hero Challenge",
            participants: 2,
            iconClass: "text-green-600",
        },
        {
            rank: 5,
            icon: BookOpen,
            title: "Reading Challenge: 3 Books",
            participants: 0,
            iconClass: "text-blue-500",
        },
    ];

    return (
        <section className="w-full rounded-[20px] bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Historical Trends
                    </h2>

                    <p className="text-xs text-slate-400">
                        Challenge performance over time
                    </p>
                </div>
            </div>

            {/* Quarterly Trends */}
            <div className="space-y-4">
                {quarters.map((quarter) => (
                    <div
                        key={quarter.title}
                        className="rounded-2xl bg-slate-50 px-3 py-3"
                    >
                        {/* Title + Completion */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-900">
                                {quarter.title}
                            </h3>

                            <span className="text-xs font-semibold text-green-600">
                                {quarter.completion}% complete
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{
                                    width: `${quarter.completion}%`,
                                }}
                            />
                        </div>

                        {/* Stats */}
                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-purple-600" />
                                {quarter.participants}
                            </span>

                            <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                {quarter.points}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Challenges */}
            <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Top Challenges by Participation
                </h3>

                <div className="space-y-3">
                    {topChallenges.map((challenge) => {
                        const Icon = challenge.icon;

                        return (
                            <div
                                key={challenge.rank}
                                className="flex items-center"
                            >
                                {/* Rank */}
                                <span className="w-7 text-sm font-semibold text-slate-400">
                                    {challenge.rank}
                                </span>

                                {/* Icon */}
                                <div className="mr-3 flex w-7 items-center justify-center">
                                    <Icon
                                        className={`h-4 w-4 ${challenge.iconClass}`}
                                    />
                                </div>

                                {/* Challenge */}
                                <span className="flex-1 text-xs font-medium text-slate-800">
                                    {challenge.title}
                                </span>

                                {/* Participants */}
                                <span className="text-xs font-semibold text-green-600">
                                    {challenge.participants}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}