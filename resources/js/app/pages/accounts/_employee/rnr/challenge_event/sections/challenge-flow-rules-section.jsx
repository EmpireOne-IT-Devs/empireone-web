import React, { useState } from "react";
import { ArrowLeftIcon,  CheckIcon, Flag } from "lucide-react";
import Button from "@/app/_components/button";
import Checkbox from "@/app/_components/checkbox";
import moment from "moment/moment";

const JOIN_RULES = (challenge) => [
    `Completing this challenge will earn you ${challenge.points} engagement points.`,
    "You must submit valid evidence to be counted as completed.",
    "Leaving a challenge after joining will not remove your progress.",
    "Evidence is reviewed by an admin before points are awarded.",
    `Deadline: ${moment(challenge.deadline).format("MMM D, YYYY")}. Late submissions will not be accepted.`,
];

export default function ChallengeFlowRulesSection({
    challenge,
    joining,
    onBack,
    onConfirm,
}) {
    const [accepted, setAccepted] = useState(false);

    return (
        <>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Challenge
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {challenge.description}
                </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800">
                    <Flag className="h-4 w-4" />
                    Before you join
                </p>
                <ul className="mt-2 flex flex-col gap-1.5">
                    {JOIN_RULES(challenge).map((rule, index) => (
                        <li
                            key={rule}
                            className="flex items-start gap-2 text-sm text-amber-700"
                        >
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700">
                                {index + 1}
                            </span>
                            {rule}
                        </li>
                    ))}
                </ul>
            </div>

            <Checkbox
                name="rules_accepted"
                label="I have read and agree to the challenge rules and requirements."
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
            />

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="light"
                    outlined
                    onClick={onBack}
                    className="w-full sm:w-auto"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    loading={joining}
                    disabled={!accepted || joining}
                    onClick={onConfirm}
                    className="w-full sm:w-auto"
                >
                    Confirm & Join 
                    <CheckIcon className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </>
    );
}
