import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiCheckCircle as CheckCircle,
    FiClipboard as ClipboardList,
} from "react-icons/fi";
import Button from "@/app/_components/button";
import Radio from "@/app/_components/radio";
import TextArea from "@/app/_components/textarea";
import Skeleton from "@/app/_components/skeleton";
import {
    get_engagement_reward_challenge_survey_thunk,
    get_engagement_reward_challenge_profile_summary_thunk,
    submit_engagement_reward_challenge_survey_thunk,
} from "@/app/redux/engagement-thunk";

export default function ChallengeSurveySection({ challenge, onBack }) {
    const dispatch = useDispatch();
    const entry = useSelector((state) => state.engagement.rewardChallengeSurveys[challenge.id]);
    const profileError = useSelector((state) => state.engagement.challengeProfileSummaryError);
    const profileLoading = useSelector((state) => state.engagement.challengeProfileSummaryLoading);
    const [answers, setAnswers] = useState({});
    const [errors, setErrors] = useState({});
    const completionRef = useRef(null);
    const survey = entry?.data;
    const submitting = Boolean(entry?.submitting);
    const completed = challenge.survey_completed || survey?.user_has_responded;

    const loadSurvey = () => dispatch(get_engagement_reward_challenge_survey_thunk(challenge.id));

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_survey_thunk(challenge.id));
    }, [dispatch, challenge.id]);

    useEffect(() => {
        if (completed && !entry?.loading) completionRef.current?.focus();
    }, [completed, entry?.loading]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await dispatch(submit_engagement_reward_challenge_survey_thunk({
            id: challenge.id,
            answers,
        }));
        if (submit_engagement_reward_challenge_survey_thunk.rejected.match(result)) {
            setErrors(result.payload?.errors || {});
        } else {
            setErrors({});
        }
    };

    return (
        <section className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6" aria-label="Challenge survey">
            <div className="flex items-start gap-3 rounded-xl bg-purple-50 p-4">
                <ClipboardList className="h-5 w-5 shrink-0 text-purple-600" aria-hidden="true" />
                <div>
                    <h2 className="font-bold text-gray-900">Challenge survey</h2>
                    <p className="text-sm text-gray-600">
                        Complete this survey to earn {survey?.reward_points ?? challenge.survey_reward_points} points.
                        Challenge points are awarded separately after proof approval.
                    </p>
                </div>
            </div>

            {entry?.loading || !entry ? (
                <div role="status" className="space-y-4">
                    <span className="sr-only">Loading survey</span>
                    <Skeleton variant="text" lines={4} />
                </div>
            ) : entry.error ? (
                <div role="alert" className="space-y-3 rounded-xl bg-red-50 p-4 text-red-700">
                    <p>{entry.error.message || "Unable to load the survey."}</p>
                    <Button onClick={loadSurvey} variant="secondary" outlined>Retry</Button>
                </div>
            ) : completed ? (
                <div ref={completionRef} tabIndex={-1} role="status" className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700">
                    <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <p>
                        Survey completed. Your survey reward is recorded; you do not need to answer again.
                        {challenge.participation_status !== "approved" && " Your challenge is still waiting for proof approval."}
                    </p>
                </div>
            ) : !survey?.can_submit ? (
                <div role="status" className="space-y-3 rounded-xl bg-amber-50 p-4 text-amber-700">
                    <p>This survey is not available yet. Single-proof challenges require submitted proof; multi-day challenges require all days to be approved. Contact an administrator if it remains unavailable.</p>
                    <Button onClick={loadSurvey} variant="secondary" outlined>Check availability</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6" aria-busy={submitting}>
                    {survey.questions.map((question) => {
                        const name = `answers.${question.id}`;
                        const error = errors[name]?.[0];
                        return (
                            <fieldset key={question.id} disabled={submitting} className="space-y-3">
                                <legend className="mb-3 text-sm font-medium text-gray-900">
                                    {question.question_text}{question.is_required ? " *" : " (optional)"}
                                </legend>
                                {question.question_type === "rating" ? (
                                    <>
                                        <p className="text-xs text-gray-500">1 = Very dissatisfied; 5 = Very satisfied</p>
                                        <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                                            {Array.from({ length: question.rating_max - question.rating_min + 1 }, (_, index) => question.rating_min + index).map((rating) => (
                                                <Radio
                                                    key={rating}
                                                    name={name}
                                                    label={String(rating)}
                                                    value={rating}
                                                    checked={answers[question.id] === rating}
                                                    required={question.is_required}
                                                    aria-invalid={Boolean(error)}
                                                    aria-describedby={error ? `error-${question.id}` : undefined}
                                                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: rating }))}
                                                />
                                            ))}
                                        </div>
                                        {error && <p id={`error-${question.id}`} role="alert" className="text-sm text-red-600">{error}</p>}
                                    </>
                                ) : (
                                    <TextArea
                                        name={`survey-answer-${question.id}`}
                                        label="Your answer"
                                        value={answers[question.id] ?? ""}
                                        required={question.is_required}
                                        maxLength={5000}
                                        error={error}
                                        aria-invalid={Boolean(error)}
                                        onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                                    />
                                )}
                            </fieldset>
                        );
                    })}
                    {entry.submitError && (
                        <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            {entry.submitError.message || "Unable to submit the survey. Your challenge remains incomplete. Please try again."}
                            {errors.answers?.[0] && <p>{errors.answers[0]}</p>}
                        </div>
                    )}
                    <Button type="submit" variant="secondary" loading={submitting} className="w-full sm:w-auto">
                        Submit Survey
                    </Button>
                </form>
            )}

            {completed && profileError && (
                <div role="alert" className="space-y-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                    <p>Your survey is saved, but your points display could not refresh.</p>
                    <Button outlined loading={profileLoading} onClick={() => dispatch(get_engagement_reward_challenge_profile_summary_thunk())}>
                        Refresh points
                    </Button>
                </div>
            )}
            <Button onClick={onBack} disabled={submitting} variant="light" outlined className="w-full sm:w-auto">
                Back to challenge
            </Button>
        </section>
    );
}
