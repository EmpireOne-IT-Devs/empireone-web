import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp, Users, Star, Flame, Lightbulb, Brain, Sprout, BookOpen, Trophy } from "lucide-react";
import { get_engagement_reward_challenge_report_thunk } from "@/app/redux/engagement-thunk";
import Skeleton from "@/app/_components/skeleton";

// Cycled by rank so the top-challenges list always has a themed icon, regardless of category.
const RANK_ICONS = [
    { icon: Flame, iconClass: "text-orange-500" },
    { icon: Lightbulb, iconClass: "text-yellow-400" },
    { icon: Brain, iconClass: "text-pink-400" },
    { icon: Sprout, iconClass: "text-green-600" },
    { icon: BookOpen, iconClass: "text-blue-500" },
];

export default function HistoricalTrendSection() {
    const dispatch = useDispatch();
    const {
        rewardChallengeReport,
        rewardChallengeReportLoading,
    } = useSelector((state) => state.engagement);

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_report_thunk());
    }, [dispatch]);

    const quarters = rewardChallengeReport?.quarters ?? [];
    const topChallenges = rewardChallengeReport?.top_challenges ?? [];

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

            {rewardChallengeReportLoading ? (
                <Skeleton lines={5} />
            ) : (
                <>
                    {/* Quarterly Trends */}
                    <div className="space-y-4">
                        {quarters.length === 0 ? (
                            <p className="py-4 text-center text-xs text-slate-400">
                                No challenge data available yet.
                            </p>
                        ) : (
                            quarters.map((quarter) => (
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
                            ))
                        )}
                    </div>

                    {/* Top Challenges */}
                    <div className="mt-6">
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Top Challenges by Participation
                        </h3>

                        <div className="space-y-3">
                            {topChallenges.length === 0 ? (
                                <p className="py-4 text-center text-xs text-slate-400">
                                    No challenges yet.
                                </p>
                            ) : (
                                topChallenges.map((challenge) => {
                                    const { icon: Icon, iconClass } =
                                        RANK_ICONS[(challenge.rank - 1) % RANK_ICONS.length] ??
                                        { icon: Trophy, iconClass: "text-slate-400" };

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
                                                    className={`h-4 w-4 ${iconClass}`}
                                                />
                                            </div>

                                            {/* Challenge */}
                                            <span className="flex-1 text-xs font-medium text-slate-800">
                                                {challenge.title}
                                            </span>

                                            {/* Participants */}
                                            <span className="text-xs font-semibold text-green-600">
                                                {challenge.participants} participants
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
