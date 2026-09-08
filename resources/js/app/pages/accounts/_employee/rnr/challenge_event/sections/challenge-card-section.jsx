import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    BookOpen,
    Calendar,
    Flame,
    Lightbulb,
    Sparkles,
    TrendingUp,
    Users,
    CheckCircle,
    Clock,
    XCircle,
    Award,
    Users as UsersIcon,
    ArrowRight,
} from "lucide-react";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Skeleton from "@/app/_components/skeleton";
import { setAlert } from "@/app/redux/app-slice";
import { leave_engagement_reward_challenge_thunk } from "@/app/redux/engagement-thunk";
import ChallengeFlowSection from "./challenge-flow-section";

// Enhanced category meta with vibrant, modern colors
const CATEGORY_META = {
    Wellness: {
        icon: Flame,
        gradient: "from-rose-400 to-orange-400",
        badge: "bg-rose-100 text-rose-600",
        light: "bg-rose-50",
        border: "border-rose-200",
    },
    Sales: {
        icon: TrendingUp,
        gradient: "from-blue-400 to-cyan-400",
        badge: "bg-blue-100 text-blue-600",
        light: "bg-blue-50",
        border: "border-blue-200",
    },
    Learning: {
        icon: BookOpen,
        gradient: "from-violet-400 to-purple-400",
        badge: "bg-violet-100 text-violet-600",
        light: "bg-violet-50",
        border: "border-violet-200",
    },
    Teamwork: {
        icon: Users,
        gradient: "from-amber-400 to-yellow-400",
        badge: "bg-amber-100 text-amber-600",
        light: "bg-amber-50",
        border: "border-amber-200",
    },
    Innovation: {
        icon: Lightbulb,
        gradient: "from-indigo-400 to-blue-400",
        badge: "bg-indigo-100 text-indigo-600",
        light: "bg-indigo-50",
        border: "border-indigo-200",
    },
};

const DEFAULT_CATEGORY_META = {
    icon: Sparkles,
    gradient: "from-slate-400 to-gray-400",
    badge: "bg-slate-100 text-slate-600",
    light: "bg-slate-50",
    border: "border-slate-200",
};


const STATUS_CONFIG = {
    approved: {
        label: "Approved",
        icon: CheckCircle,
        variant: "success",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    submitted: {
        label: "Pending Review",
        icon: Clock,
        variant: "warning",
        className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    declined: {
        label: "Declined",
        icon: XCircle,
        variant: "danger",
        className: "bg-rose-50 text-rose-700 border-rose-200",
    },
};

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getTimeRemaining(deadline) {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
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

    const statusInfo = STATUS_CONFIG[challenge.participation_status] || null;
    const timeRemaining = getTimeRemaining(challenge.deadline);
    const isUrgent = timeRemaining && timeRemaining.includes("d") && parseInt(timeRemaining) <= 2;

    const handleLeave = async () => {
        const result = await dispatch(leave_engagement_reward_challenge_thunk(challenge.id));

        if (leave_engagement_reward_challenge_thunk.rejected.match(result)) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to leave challenge",
                    message: result.payload?.message || "Please try again.",
                    open: true,
                })
            );
        }
    };

    const renderActionButton = () => {
        const status = challenge.participation_status;

        // Approved state
        if (status === "approved") {
            return (
                <Button
                    type="button"
                    variant="success"
                    className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
                    onClick={() => setIsFlowModalOpen(true)}
                >
                    <Award className="h-4 w-4" />
                    Approved · +{challenge.points} pts
                </Button>
            );
        }

        // Submitted state
        if (status === "submitted") {
            return (
                <Button
                    type="button"
                    variant="warning"
                    className="w-full gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200 hover:shadow-amber-300"
                    onClick={() => setIsFlowModalOpen(true)}
                >
                    <Clock className="h-4 w-4" />
                    Pending Review
                </Button>
            );
        }

        // Declined state
        if (status === "declined") {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="warning"
                        className="flex-1 gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200 hover:shadow-amber-300"
                        onClick={() => setIsFlowModalOpen(true)}
                    >
                        <ArrowRight className="h-4 w-4" />
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
                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                        Leave
                    </Button>
                </div>
            );
        }

        // Joined state
        if (challenge.is_joined) {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="primary"
                        className="flex-1 gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                        onClick={() => setIsFlowModalOpen(true)}
                    >
                        <ArrowRight className="h-4 w-4" />
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
                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                        Leave
                    </Button>
                </div>
            );
        }

        // Completed
        if (isCompleted) {
            return (
                <Button
                    type="button"
                    variant="light"
                    disabled
                    className="w-full rounded-xl bg-gradient-to-r from-slate-100 to-gray-100 text-slate-500"
                >
                    Challenge Ended
                </Button>
            );
        }

        // Full
        if (isFull) {
            return (
                <Button
                    type="button"
                    variant="light"
                    disabled
                    className="w-full rounded-xl bg-gradient-to-r from-slate-100 to-gray-100 text-slate-500"
                >
                    Challenge Full
                </Button>
            );
        }

        // Default: Join
        return (
            <Button
                type="button"
                variant="primary"
                className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                onClick={() => setIsFlowModalOpen(true)}
            >
                <UsersIcon className="h-4 w-4" />
                Join Challenge
            </Button>
        );
    };

    return (
        <>
            <Card
                padding="p-0"
                className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border ${meta.border} bg-white shadow-lg shadow-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
                {/* Banner with gradient overlay */}
                <div className="relative">
                    {challenge.banner_url ? (
                        <img
                            src={challenge.banner_url}
                            alt={challenge.title}
                            className="h-36 w-full object-cover"
                        />
                    ) : (
                        <div className={`h-36 w-full bg-gradient-to-r ${meta.gradient}`} />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Points badge - floating */}
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-gray-900 backdrop-blur-sm shadow-lg">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        +{challenge.points} pts
                    </div>

                    {/* Category icon badge - floating */}
                    <div className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg ${meta.badge}`}>
                        <Icon className="h-5 w-5" />
                    </div>

                    {/* Time remaining - bottom of banner */}
                    {timeRemaining && !isCompleted && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <Calendar className="h-3.5 w-3.5" />
                            {timeRemaining}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                    {/* Title & badges */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                            {challenge.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            <Badge
                                label={challenge.type}
                                variant="secondary"
                                outlined
                                className="text-xs font-medium"
                            />
                            <Badge
                                label={challenge.category}
                                variant="secondary"
                                outlined
                                className="text-xs font-medium"
                            />
                            {isUrgent && !isCompleted && (
                                <Badge
                                    label="Urgent"
                                    variant="danger"
                                    className="text-xs font-medium bg-rose-100 text-rose-600 border-rose-200"
                                />
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                        {challenge.description}
                    </p>

                    {/* Participants & Progress */}
                    <div className="mt-1">
                        {challenge.max_participants ? (
                            <>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <UsersIcon className="h-3.5 w-3.5" />
                                        {challenge.participants_count} joined
                                    </span>
                                    <span className="font-medium text-gray-600">
                                        {capacityProgress}%
                                    </span>
                                </div>
                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
                                        style={{ width: `${capacityProgress}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <UsersIcon className="h-3.5 w-3.5" />
                                {challenge.participants_count} joined
                            </div>
                        )}
                    </div>

                    {/* Status badge */}
                    {statusInfo && (
                        <Badge
                            label={statusInfo.label}
                            variant={statusInfo.variant}
                            icon={statusInfo.icon}
                            outlined
                            className="mt-0.5 w-fit rounded-full"
                        />
                    )}

                    {/* Action Button */}
                    <div className="mt-auto pt-2">{renderActionButton()}</div>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} variant="card" className="h-[420px] bg-white rounded-2xl" />
                ))}
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-lg shadow-slate-100">
                <Sparkles className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-sm font-medium text-gray-500">
                    No challenges available right now.
                </p>
                <p className="text-xs text-gray-400 mt-1">Check back later for new opportunities.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </div>
    );
}