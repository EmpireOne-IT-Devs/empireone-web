import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Flame, Lightbulb, Brain, Sprout, BookOpen, Users } from "lucide-react";

import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Skeleton from "@/app/_components/skeleton";
import { get_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";
import EditChallengeSection from "../../dashboard/sections/edit-challenge-section";
import DeleteChallengeSection from "../../dashboard/sections/delete-challenge-section";
import moment from "moment";

const CATEGORY_META = {
    Wellness: { icon: Flame, iconBg: "bg-emerald-50 text-orange-500" },
    Innovation: { icon: Lightbulb, iconBg: "bg-slate-100 text-yellow-500" },
    Learning: { icon: BookOpen, iconBg: "bg-purple-50 text-purple-600" },
    Teamwork: { icon: Brain, iconBg: "bg-red-50 text-pink-400" },
    Sales: { icon: Sprout, iconBg: "bg-teal-50 text-teal-600" },
};

const DEFAULT_META = {
    icon: Flame,
    iconBg: "bg-slate-100 text-slate-500",
};

const STATUS_VARIANT = {
    Active: "success",
    Completed: "secondary",
    Upcoming: "primary",
};

const TYPE_VARIANT = {
    Individual: "primary",
    Team: "purple",
};

const ChallengeCell = ({ challenge }) => {
    const meta = CATEGORY_META[challenge.category] ?? DEFAULT_META;
    const Icon = meta.icon;

    return (
        <div className="flex items-start gap-3 min-w-0">
            <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.iconBg}`}
            >
                <Icon size={17} />
            </div>
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-950">
                    {challenge.title}
                </div>
                <div className="truncate text-xs text-slate-400">
                    {challenge.category ?? "General"}
                </div>
            </div>
        </div>
    );
};

export default function ChallengeTableSection() {
    const dispatch = useDispatch();
    const { rewardChallenges = [], rewardChallengesLoading } = useSelector(
        (state) => state.engagement,
    );

    useEffect(() => {
        dispatch(get_engagement_reward_challenges_thunk());
    }, [dispatch]);

    const columns = [
        {
            header: "CHALLENGE",
            accessor: "challenge",
            width: "min-w-[320px]",
        },
        { header: "TYPE", accessor: "type" },
        { header: "STATUS", accessor: "status" },
        { header: "PARTICIPANTS", accessor: "participants" },
        { header: "Points", accessor: "points" },
        { header: "DEADLINE", accessor: "deadline" },
        { header: "ACTIONS", accessor: "actions" },
    ];

    const data = rewardChallenges.map((challenge) => {
        const participantsCount = challenge.participants_count ?? 0;
        const maxParticipants = challenge.max_participants ?? "∞";

        return {
            id: challenge.id,
            challenge: <ChallengeCell challenge={challenge} />,
            type: (
                <Badge
                    label={challenge.type ?? "Individual"}
                    variant={TYPE_VARIANT[challenge.type] ?? "primary"}
                    outlined
                    className="rounded-full px-3 py-1 text-xs font-medium"
                />
            ),
            status: (
                <Badge
                    label={challenge.status ?? "Active"}
                    variant={STATUS_VARIANT[challenge.status] ?? "primary"}
                    outlined
                    className="rounded-full px-3 py-1 text-xs font-medium"
                />
            ),
            participants: (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {participantsCount}/{maxParticipants}
                </span>
            ),
            points: (
                <span className="text-sm font-bold text-yellow-500">
                    +{challenge.points ?? 0}
                </span>
            ),
            deadline: (
                <span className="text-sm text-slate-500">
                    {moment(challenge.deadline).format("MMM DD, YYYY")}
                </span>
            ),
            actions: (
                <div className="flex flex-wrap items-center gap-2">
                    <EditChallengeSection challenge={challenge} />
                    <DeleteChallengeSection challenge={challenge} />
                </div>
            ),
        };
    });

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            {rewardChallengesLoading ? (
                <div className="p-6">
                    <Skeleton variant="table" />
                </div>
            ) : (
                <Table columns={columns} data={data} />
            )}
        </div>
    );
}
