import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Calendar, Flame, Lightbulb, Sparkles, TrendingUp, Users } from "lucide-react";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Skeleton from "@/app/_components/skeleton";
import { setAlert } from "@/app/redux/app-slice";
import { leave_engagement_reward_challenge_thunk } from "@/app/redux/engagement-thunk";
import ChallengeFlowSection from "./challenge-flow-section";

const CATEGORY_META = {
    Wellness: { icon: Flame, badge: "bg-emerald-100 text-emerald-600" },
    Sales: { icon: TrendingUp, badge: "bg-sky-100 text-sky-600" },
    Learning: { icon: BookOpen, badge: "bg-purple-100 text-purple-600" },
    Teamwork: { icon: Users, badge: "bg-amber-100 text-amber-600" },
    Innovation: { icon: Lightbulb, badge: "bg-indigo-100 text-indigo-600" },
};
const DEFAULT_CATEGORY_META = { icon: Sparkles, badge: "bg-slate-100 text-slate-600" };

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function ChallengeCard({ challenge }) {
    const dispatch = useDispatch();
    const { rewardChallengeLeavingId } = useSelector((state) => state.engagement);
    const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);

    const meta = CATEGORY_META[challenge.category] ?? DEFAULT_CATEGORY_META;
    const Icon = meta.icon;
    const isCompleted = challenge.status === "Completed";
    const isFull =
        Boolean(challenge.max_participants) &&
        challenge.participants_count >= challenge.max_participants;
    const capacityProgress = challenge.max_participants
        ? Math.min(100, Math.round((challenge.participants_count / challenge.max_participants) * 100))
        : 0;
    const leaving = rewardChallengeLeavingId === challenge.id;
    const canLeave = challenge.is_joined && ["joined", "declined"].includes(challenge.participation_status);

    const handleLeave = async () => {
        const result = await dispatch(leave_engagement_reward_challenge_thunk(challenge.id));

        if (leave_engagement_reward_challenge_thunk.rejected.match(result)) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to leave challenge",
                    message: result.payload?.message || "Please try again.",
                    open: true,
                }),
            );
        }
    };

    return (
        <>
            <Card className="flex h-full w-full flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.badge}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
                        +{challenge.points}
                    </span>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-900">{challenge.title}</h3>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge label={challenge.type} variant="secondary" outlined />
                        <Badge label={challenge.category} variant="secondary" outlined />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        {challenge.description}
                    </p>
                </div>

                {challenge.max_participants ? (
                    <div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${capacityProgress}%` }}
                            />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" /> Ends {formatDate(challenge.deadline)}
                            </span>
                            <span>
                                {challenge.participants_count}/{challenge.max_participants}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3.5 w-3.5" /> Ends {formatDate(challenge.deadline)}
                    </div>
                )}

                <div className="mt-auto">
                    {challenge.participation_status === "approved" ? (
                        <Button
                            type="button"
                            variant="success"
                            outlined
                            className="w-full"
                            onClick={() => setIsFlowModalOpen(true)}
                        >
                            Approved · +{challenge.points} pts
                        </Button>
                    ) : challenge.participation_status === "submitted" ? (
                        <Button
                            type="button"
                            variant="warning"
                            outlined
                            className="w-full"
                            onClick={() => setIsFlowModalOpen(true)}
                        >
                            Pending Review
                        </Button>
                    ) : challenge.participation_status === "declined" ? (
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="warning"
                                className="flex-1"
                                onClick={() => setIsFlowModalOpen(true)}
                            >
                                Resubmit Proof
                            </Button>
                            <Button
                                type="button"
                                variant="danger"
                                outlined
                                size="sm"
                                loading={leaving}
                                disabled={leaving}
                                onClick={handleLeave}
                            >
                                Leave
                            </Button>
                        </div>
                    ) : challenge.is_joined ? (
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="primary"
                                className="flex-1"
                                onClick={() => setIsFlowModalOpen(true)}
                            >
                                Submit Proof
                            </Button>
                            <Button
                                type="button"
                                variant="danger"
                                outlined
                                size="sm"
                                loading={leaving}
                                disabled={leaving || !canLeave}
                                onClick={handleLeave}
                            >
                                Leave
                            </Button>
                        </div>
                    ) : isCompleted ? (
                        <div className="w-full rounded-full bg-gray-100 py-2 text-center text-sm font-semibold text-gray-400">
                            Challenge Ended
                        </div>
                    ) : isFull ? (
                        <div className="w-full rounded-full bg-gray-100 py-2 text-center text-sm font-semibold text-gray-400">
                            Challenge Full
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="primary"
                            className="w-full"
                            onClick={() => setIsFlowModalOpen(true)}
                        >
                            Join Challenge
                        </Button>
                    )}
                </div>
            </Card>

            <ChallengeFlowSection
                challenge={challenge}
                isOpen={isFlowModalOpen}
                onClose={() => setIsFlowModalOpen(false)}
            />
        </>
    );
}

export default function ChallengeCardSection({ challenges = [], loading = false }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} variant="card" className="bg-white" />
                ))}
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                No challenges available right now.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </div>
    );
}
