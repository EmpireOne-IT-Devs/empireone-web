import React from "react";
import {
    ArrowRight,
    Calendar,
    Check,
    ListChecks,
    Star,
    Users,
} from "lucide-react";
import Button from "@/app/_components/button";
import moment from "moment/moment";

export default function ChallengeFlowDetailsSection({
    challenge,
    onClose,
    onJoinClick,
}) {
    return (
        <>
            <p className="text-sm leading-relaxed text-gray-600">
                {challenge.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <ListChecks className="h-3.5 w-3.5" /> Category
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                        {challenge.category}
                    </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Users className="h-3.5 w-3.5" /> Type
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                        {challenge.type}
                    </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Star className="h-3.5 w-3.5" /> Points
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                        +{challenge.points}
                    </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Check className="h-3.5 w-3.5" /> Slots
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                        {challenge.participants_count}/
                        {challenge.max_participants ?? "∞"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm text-blue-600">
                <Calendar className="h-4 w-4" />
                Ends {moment(challenge.deadline).format("MMM D, YYYY")}
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="light"
                    outlined
                    onClick={onClose}
                    className="w-full sm:w-auto"
                >
                    Maybe Later
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={onJoinClick}
                    className="w-full sm:w-auto"
                >
                    Join Challenge  <ArrowRight className="h-4 w-4 ml-1 mr-1 " />
                </Button>
            </div>
        </>
    );
}
