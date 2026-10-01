import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_engagement_reward_challenges_thunk,
  get_engagement_reward_challenge_submission_stats_thunk,
} from "@/app/redux/engagement-thunk";

// "Completed" challenges are what the app treats as Archived.
const STATUS_ROWS = [
  { label: "Active", key: "Active", barColor: "bg-emerald-500" },
  { label: "Upcoming", key: "Upcoming", barColor: "bg-sky-500" },
  { label: "Archived", key: "Completed", barColor: "bg-slate-300" },
];

export default function HeaderSection() {
  const dispatch = useDispatch();
  const {
    rewardChallenges = [],
    rewardChallengesLoading,
    challengeSubmissionStats = { pending: 0, approved: 0, rejected: 0 },
  } = useSelector((state) => state.engagement);

  useEffect(() => {
    dispatch(get_engagement_reward_challenges_thunk());
    dispatch(get_engagement_reward_challenge_submission_stats_thunk());
  }, [dispatch]);

  const {
    statusCounts,
    totalChallenges,
    totalParticipants,
    completedCount,
    completionRate,
  } = useMemo(() => {
    const counts = { Active: 0, Upcoming: 0, Completed: 0 };
    let participants = 0;

    rewardChallenges.forEach((challenge) => {
      if (counts[challenge.status] !== undefined) counts[challenge.status] += 1;
      participants += challenge.participants_count ?? 0;
    });

    const completed = challengeSubmissionStats.approved ?? 0;
    const rate =
      participants > 0 ? Math.round((completed / participants) * 100) : 0;

    return {
      statusCounts: counts,
      totalChallenges: rewardChallenges.length,
      totalParticipants: participants,
      completedCount: completed,
      completionRate: rate,
    };
  }, [rewardChallenges, challengeSubmissionStats]);

  if (rewardChallengesLoading && rewardChallenges.length === 0) {
    return (
      <div className="mt-2 bg-slate-100 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm h-40 animate-pulse" />
          <div className="bg-white p-6 rounded-2xl shadow-sm h-40 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-slate-100 p-6 rounded-lg font-sans text-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Completion Rate Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Overall Completion Rate
              </h2>
              <span className="text-2xl font-bold text-emerald-500">
                {completionRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-slate-400 font-medium">
            {completedCount} completed out of {totalParticipants} participant
            {totalParticipants === 1 ? "" : "s"}
          </p>
        </div>

        {/* Challenge Status Breakdown Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Challenge Status Breakdown
          </h2>

          <div className="space-y-3">
            {STATUS_ROWS.map(({ label, key, barColor }) => {
              const count = statusCounts[key] ?? 0;
              const width =
                totalChallenges > 0 ? (count / totalChallenges) * 100 : 0;

              return (
                <div
                  key={label}
                  className="flex items-center text-sm font-medium"
                >
                  <span className="w-24 text-slate-400">{label}</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full mx-3 overflow-hidden">
                    <div
                      className={`${barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <span className="w-4 text-right font-bold text-slate-700">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}