import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flame,
  Lightbulb,
  Brain,
  Sprout,
  BookOpen,
  Users,
  Star,
  Calendar,
} from "lucide-react";
import { get_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";
import Card from "@/app/_components/card";
import EditChallengeSection from "./edit-challenge-section";
import DeleteChallengeSection from "./delete-challenge-section";

const CATEGORY_META = {
  Wellness: {
    icon: Flame,
    iconBg: "bg-emerald-50 text-orange-500",
    topBorderColor: "border-t-emerald-600",
    progressBg: "bg-emerald-500",
  },
  Innovation: {
    icon: Lightbulb,
    iconBg: "bg-slate-100 text-yellow-500",
    topBorderColor: "border-t-indigo-600",
    progressBg: "bg-indigo-600",
  },
  Learning: {
    icon: BookOpen,
    iconBg: "bg-purple-50 text-purple-600",
    topBorderColor: "border-t-purple-600",
    progressBg: "bg-purple-600",
  },
  Teamwork: {
    icon: Brain,
    iconBg: "bg-red-50 text-pink-400",
    topBorderColor: "border-t-amber-500",
    progressBg: "bg-amber-500",
  },
  Sales: {
    icon: Sprout,
    iconBg: "bg-teal-50 text-teal-600",
    topBorderColor: "border-t-teal-600",
    progressBg: "bg-teal-600",
  },
};

const DEFAULT_CATEGORY_META = {
  icon: Star,
  iconBg: "bg-slate-100 text-slate-500",
  topBorderColor: "border-t-slate-400",
  progressBg: "bg-slate-500",
};

const STATUS_META = {
  Active: "bg-emerald-100 text-emerald-600",
  Completed: "bg-slate-100 text-slate-500",
  Upcoming: "bg-blue-100 text-blue-600",
};

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AllChallengesSection() {
  const dispatch = useDispatch();
  const { rewardChallenges, rewardChallengesLoading } = useSelector(
    (state) => state.engagement,
  );

  useEffect(() => {
    dispatch(get_engagement_reward_challenges_thunk());
  }, [dispatch]);

  return (
    <div className="bg-slate-100 p-6 rounded-lg font-sans text-slate-800">
      <h2 className="text-md font-bold mb-4 text-slate-900">All Challenges</h2>

      {rewardChallengesLoading && (
        <p className="text-sm text-slate-500">Loading challenges...</p>
      )}

      {!rewardChallengesLoading && rewardChallenges.length === 0 && (
        <p className="text-sm text-slate-500">No challenges published yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewardChallenges.map((challenge) => {
          const meta = CATEGORY_META[challenge.category] ?? DEFAULT_CATEGORY_META;
          const Icon = meta.icon;
          const statusBg = STATUS_META[challenge.status] ?? STATUS_META.Active;
          const participantsCount = challenge.participants_count ?? 0;
          const capacity = challenge.max_participants;
          const progress = capacity
            ? Math.min(100, Math.round((participantsCount / capacity) * 100))
            : 0;

          return (
            <Card
              key={challenge.id}
              padding="p-0"
              className={`overflow-hidden rounded-2xl border-t-4 ${meta.topBorderColor} flex flex-col`}
            >
              {challenge.banner_url && (
                <img
                  src={challenge.banner_url}
                  alt={challenge.title}
                  className="h-32 w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                {/* Header: Icon, Badge, Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-full ${meta.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBg}`}
                    >
                      {challenge.status}
                    </span>
                    <EditChallengeSection challenge={challenge} />
                    <DeleteChallengeSection challenge={challenge} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-500 min-h-[32px] mb-4">
                  {challenge.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {participantsCount}/{capacity ?? "∞"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{challenge.points} pts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(challenge.deadline)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full ${meta.progressBg}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {progress}% capacity filled
                </span>
              </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}