import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CheckCircle2, Gift, Lock, Sparkles } from "lucide-react";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { join_engagement_reward_challenge_thunk } from "@/app/redux/engagement-thunk";
import ChallengeFlowProgressSection from "./challenge-flow-progress-section";
import ChallengeGuideSection from "./challenge-guide-section";
import ChallengeFlowDetailsSection from "./challenge-flow-details-section";
import ChallengeFlowRulesSection from "./challenge-flow-rules-section";
import ChallengeFlowNextStepsSection from "./challenge-flow-next-steps-section";
import ChallengeFlowSubmitSection from "./challenge-flow-submit-section";
import ChallengeFlowSubmittedSection from "./challenge-flow-submitted-section";
import ChallengeFlowApprovedSection from "./challenge-flow-approved-section";
import ChallengeSurveySection from "./challenge-survey-section";
import Button from "@/app/_components/button";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

const SURVEY_REWARD_POINTS = 15;

const STEP_INDEX = {
    details: 0,
    joined: 1,
    declined: 1,
    submitted: 2,
    pending_survey: 2,
    approved: 3,
};

export default function ChallengeFlowSection({ challenge, isOpen, onClose }) {
    const dispatch = useDispatch();
    const { isERLeader } = useCurrentEmployee();
    const { rewardChallengeJoiningId } = useSelector(
        (state) => state.engagement,
    );
    const [preJoinStage, setPreJoinStage] = useState("details");
    const [justJoined, setJustJoined] = useState(false);
    const [showSurvey, setShowSurvey] = useState(false);

    if (!challenge) return null;

    const canSubmitTeam = isERLeader && challenge.type === "Team";
    const statusKey = challenge.is_joined
        ? challenge.is_daily_challenge
            ? ["approved", "pending_survey"].includes(challenge.participation_status)
                ? challenge.participation_status
                : "joined"
            : (challenge.participation_status ?? "joined")
        : "details";
    const currentStep = STEP_INDEX[statusKey] ?? 0;
    const isDeclined = statusKey === "declined";
    const joining = rewardChallengeJoiningId === challenge.id;

    const handleClose = () => {
        setPreJoinStage("details");
        setJustJoined(false);
        setShowSurvey(false);
        onClose();
    };

    const handleJoin = async () => {
        const result = await dispatch(
            join_engagement_reward_challenge_thunk(challenge.id),
        );

        if (join_engagement_reward_challenge_thunk.rejected.match(result)) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to join challenge",
                    message: result.payload?.message || "Please try again.",
                    open: true,
                }),
            );
            return;
        }

        setJustJoined(true);
        dispatch(
            setAlert({
                type: "success",
                title: "Challenge joined",
                message: `You're in! Good luck with "${challenge.title}".`,
                open: true,
            }),
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-3xl"
            title={
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: challenge.card_color }}
                    >
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                            {challenge.title}
                        </h2>
                        <p className="text-xs text-gray-400">
                            {challenge.status} · +{challenge.points} pts
                        </p>
                    </div>
                </div>
            }
        >
            {isOpen && <div
                key={showSurvey ? "survey" : "challenge"}
                className="mt-2 flex flex-col gap-4 pb-2 p-2"
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.stopPropagation();
                        handleClose();
                    }
                }}
            >
                {showSurvey ? (
                    <ChallengeSurveySection
                        key={challenge.id}
                        challenge={challenge}
                        onBack={() => setShowSurvey(false)}
                    />
                ) : (
                    <>
                        {challenge.survey_required && challenge.is_joined && challenge.status !== "Upcoming" && (
                            (() => {
                                const isCompleted = challenge.survey_completed;
                                const isReady = !isCompleted && (challenge.can_complete_survey || challenge.participation_status === "pending_survey");
                                const Icon = isCompleted ? CheckCircle2 : isReady ? Gift : Lock;
                                const theme = isCompleted
                                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-800"
                                    : isReady
                                      ? "border-fuchsia-300 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-lg shadow-fuchsia-200"
                                      : "border-amber-200 bg-gradient-to-br from-amber-50 to-purple-50 text-purple-900";
                                const title = isCompleted
                                    ? `+${challenge.survey_points_awarded} survey points earned`
                                    : isReady
                                      ? `Take the survey & earn +${SURVEY_REWARD_POINTS} points!`
                                      : `Unlock +${SURVEY_REWARD_POINTS} bonus points`;
                                const message = isCompleted
                                    ? `Your survey points are recorded.${challenge.participation_status !== "approved" ? " Proof approval is still required to finalize the challenge." : ""}`
                                    : isReady
                                      ? "You're almost finished. It only takes a minute. Proof approval is also required to finalize."
                                      : challenge.is_daily_challenge
                                        ? "The survey unlocks after all required days are approved."
                                        : `Submit your proof to unlock the survey, then earn +${SURVEY_REWARD_POINTS} points.`;

                                return (
                                    <div
                                        role="status"
                                        className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${theme}`}
                                    >
                                        {isReady && (
                                            <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 motion-safe:animate-pulse" />
                                        )}
                                        <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isReady ? "bg-white/20 ring-4 ring-white/20 motion-safe:animate-bounce" : isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-white text-amber-500 shadow-sm"}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-base font-bold leading-snug">{title}</p>
                                                    {!isCompleted && (
                                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isReady ? "bg-yellow-300 text-purple-900" : "bg-purple-100 text-purple-700"}`}>
                                                            +{SURVEY_REWARD_POINTS} pts
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-sm ${isReady ? "text-white/90" : "opacity-80"}`}>{message}</p>
                                            </div>
                                            <Button
                                                variant={isReady ? "light" : "secondary"}
                                                outlined={!isReady && !isCompleted}
                                                onClick={() => setShowSurvey(true)}
                                                className={`w-full gap-2 font-bold md:w-auto ${isReady ? "!text-purple-700 shadow-md" : ""}`}
                                            >
                                                {isCompleted ? "View survey completion" : isReady ? "Complete Survey" : "Check survey availability"}
                                                {isReady && <ArrowRight className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })()
                        )}

                        <ChallengeFlowProgressSection
                            currentStep={currentStep}
                            isDeclined={isDeclined}
                            challenge={challenge}
                        />

                        <ChallengeGuideSection
                            challenge={challenge}
                            defaultExpanded={currentStep === 0}
                        />

                        {currentStep === 0 && preJoinStage === "details" && (
                            <ChallengeFlowDetailsSection
                                challenge={challenge}
                                onClose={handleClose}
                                onJoinClick={() => setPreJoinStage("rules")}
                            />
                        )}

                        {currentStep === 0 && preJoinStage === "rules" && (
                            <ChallengeFlowRulesSection
                                challenge={challenge}
                                joining={joining}
                                onBack={() => setPreJoinStage("details")}
                                onConfirm={handleJoin}
                            />
                        )}

                        {currentStep === 1 && justJoined && (
                            <ChallengeFlowNextStepsSection
                                challenge={challenge}
                                onBack={handleClose}
                                onStart={() => setJustJoined(false)}
                            />
                        )}

                        {currentStep === 1 && !justJoined && (
                            <ChallengeFlowSubmitSection
                                challenge={challenge}
                                isDeclined={isDeclined}
                                isOpen={isOpen}
                                onClose={handleClose}
                                canSubmitTeam={canSubmitTeam}
                            />
                        )}

                        {currentStep === 2 && (
                            <>
                                <ChallengeFlowSubmittedSection
                                    challenge={challenge}
                                    onClose={handleClose}
                                />
                                {canSubmitTeam && (
                                    <ChallengeFlowSubmitSection
                                        challenge={challenge}
                                        isDeclined={isDeclined}
                                        isOpen={isOpen}
                                        onClose={handleClose}
                                        canSubmitTeam
                                        individualSubmitted
                                    />
                                )}
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                <ChallengeFlowApprovedSection
                                    challenge={challenge}
                                    onClose={handleClose}
                                />
                                {canSubmitTeam && (
                                    <ChallengeFlowSubmitSection
                                        challenge={challenge}
                                        isDeclined={isDeclined}
                                        isOpen={isOpen}
                                        onClose={handleClose}
                                        canSubmitTeam
                                        individualSubmitted
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>}
        </Modal>
    );
}
