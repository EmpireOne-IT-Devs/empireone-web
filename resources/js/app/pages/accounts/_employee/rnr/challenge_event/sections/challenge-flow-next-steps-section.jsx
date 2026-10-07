import React from "react";
import Button from "@/app/_components/button";
import { ArrowLeft } from "lucide-react";
import moment from "moment/moment";

const NEXT_STEPS = (challenge) =>
    challenge.is_daily_challenge
        ? [
              { emoji: "🎯", text: "Complete the daily activity as described" },
              { emoji: "📸", text: "Capture a new photo each day as proof" },
              { emoji: "📅", text: `Submit once per day for ${challenge.required_days ?? challenge.duration_days} day(s) — missed days are simply skipped` },
              { emoji: "📤", text: `Window ends: ${moment(challenge.daily_window_ends_at ?? challenge.deadline).format("MMM D, YYYY")}` },
              { emoji: "⭐", text: `Earn ${challenge.points} points once every required day is approved` },
          ]
        : [
              { emoji: "🎯", text: "Complete the main challenge activity as described" },
              { emoji: "📸", text: "Capture evidence: photo, screenshot, doc, or video link" },
              { emoji: "✍️", text: "Write a short description explaining your submission" },
              { emoji: "📤", text: `Submit before the deadline: ${moment(challenge.deadline).format("MMM D, YYYY")}` },
              { emoji: "⭐", text: `Earn ${challenge.points} points after admin verification` },
          ];

export default function ChallengeFlowNextStepsSection({
    challenge,
    onBack,
    onStart,
}) {
    return (
        <>
            <div>
                <p className="mb-2 text-sm font-semibold text-gray-800">
                    What You Need To Do
                </p>
                <div className="flex flex-col gap-2">
                    {NEXT_STEPS(challenge).map((item) => (
                        <div
                            key={item.text}
                            className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5"
                        >
                            <span className="text-base">{item.emoji}</span>
                            <span className="text-sm text-gray-600">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                <div>
                    <p className="text-xs text-gray-400">Max reward</p>
                    <p className="text-sm font-bold text-indigo-600">
                        +{challenge.points} pts
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Your progress</p>
                    <p className="text-sm font-bold text-gray-800">0%</p>
                </div>
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="light"
                    outlined
                    onClick={onBack}
                    className="w-full sm:w-auto"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={onStart}
                    className="w-full sm:w-auto"
                >
                    ▶ Start Challenge
                </Button>
            </div>
        </>
    );
}
