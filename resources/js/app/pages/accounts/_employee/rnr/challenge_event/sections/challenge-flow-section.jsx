import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
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
    const { rewardChallengeJoiningId } = useSelector(
        (state) => state.engagement,
    );
    const [preJoinStage, setPreJoinStage] = useState("details");
    const [justJoined, setJustJoined] = useState(false);
    const [showSurvey, setShowSurvey] = useState(false);

    if (!challenge) return null;

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
                            <div role="status" className="space-y-3 rounded-xl bg-purple-50 p-4 text-sm text-purple-700">
                                <p className="font-bold">
                                    {challenge.survey_completed ? "Survey completed" : challenge.can_complete_survey || challenge.participation_status === "pending_survey" ? "Almost finished" : "Survey requirement"}
                                </p>
                                <p>
                                    {challenge.survey_completed
                                        ? `Your ${challenge.survey_points_awarded} survey points are recorded.${challenge.participation_status !== "approved" ? " Proof approval is still required to finalize the challenge." : ""}`
                                        : challenge.can_complete_survey
                                          ? "Complete the survey to finalize your challenge requirements. Proof approval is also required."
                                          : challenge.is_daily_challenge
                                            ? "The survey unlocks after all required days are approved."
                                            : "Submit your proof to unlock the survey."}
                                </p>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowSurvey(true)}
                                    className="w-full sm:w-auto"
                                >
                                    {challenge.survey_completed ? "View survey completion" : challenge.can_complete_survey || challenge.participation_status === "pending_survey" ? "Complete Survey" : "Check survey availability"}
                                </Button>
                            </div>
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
                            />
                        )}

                        {currentStep === 2 && (
                            <ChallengeFlowSubmittedSection
                                challenge={challenge}
                                onClose={handleClose}
                            />
                        )}

                        {currentStep === 3 && (
                            <ChallengeFlowApprovedSection
                                challenge={challenge}
                                onClose={handleClose}
                            />
                        )}
                    </>
                )}
            </div>}
        </Modal>
    );
}
