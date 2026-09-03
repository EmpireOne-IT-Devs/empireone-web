import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Calendar,
    Check,
    ImagePlus,
    ListChecks,
    Sparkles,
    Star,
    Users,
    X,
} from "lucide-react";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import {
    join_engagement_reward_challenge_thunk,
    submit_engagement_reward_challenge_proof_thunk,
} from "@/app/redux/engagement-thunk";

const STEPS = ["Details", "Start", "Submitted", "Approved"];

// Maps the challenge's real participation status to a step index in the journey above.
const STEP_INDEX = {
    details: 0,
    joined: 1,
    declined: 1,
    submitted: 2,
    approved: 3,
};

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function ChallengeFlowSection({ challenge, isOpen, onClose }) {
    const dispatch = useDispatch();
    const { rewardChallengeJoiningId, rewardChallengeSubmittingId } = useSelector(
        (state) => state.engagement,
    );
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    if (!challenge) return null;

    const statusKey = challenge.is_joined ? challenge.participation_status ?? "joined" : "details";
    const currentStep = STEP_INDEX[statusKey] ?? 0;
    const isDeclined = statusKey === "declined";
    const joining = rewardChallengeJoiningId === challenge.id;
    const submitting = rewardChallengeSubmittingId === challenge.id;

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (preview) URL.revokeObjectURL(preview);
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const removePhoto = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPhoto(null);
        setPreview(null);
    };

    const handleClose = () => {
        removePhoto();
        onClose();
    };

    const handleJoin = async () => {
        const result = await dispatch(join_engagement_reward_challenge_thunk(challenge.id));

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

        dispatch(
            setAlert({
                type: "success",
                title: "Challenge joined",
                message: `You're in! Good luck with "${challenge.title}".`,
                open: true,
            }),
        );
    };

    const handleSubmit = async () => {
        if (!photo) return;

        const result = await dispatch(
            submit_engagement_reward_challenge_proof_thunk({ id: challenge.id, photo }),
        );

        if (submit_engagement_reward_challenge_proof_thunk.rejected.match(result)) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to submit proof",
                    message: result.payload?.message || "Please try again.",
                    open: true,
                }),
            );
            return;
        }

        removePhoto();
        dispatch(
            setAlert({
                type: "success",
                title: "Proof submitted",
                message: "Your submission is now pending admin review.",
                open: true,
            }),
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            width="max-w-lg"
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
            <div className="mt-2 flex flex-col gap-4 pb-2">
                {/* Step indicator reflects the challenge's real participation status */}
                <div className="flex items-center">
                    {STEPS.map((step, index) => {
                        const isComplete = index < currentStep;
                        const isActive = index === currentStep;
                        const isBad = isActive && isDeclined;

                        return (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center gap-1">
                                    <span
                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                            isBad
                                                ? "bg-red-600 text-white"
                                                : isComplete
                                                  ? "bg-emerald-500 text-white"
                                                  : isActive
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                                    </span>
                                    <span
                                        className={`text-[11px] font-medium ${
                                            isBad
                                                ? "text-red-600"
                                                : isComplete || isActive
                                                  ? "text-indigo-600"
                                                  : "text-gray-400"
                                        }`}
                                    >
                                        {step}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <span
                                        className={`mx-1 mb-4 h-px flex-1 ${
                                            index < currentStep ? "bg-emerald-300" : "bg-gray-200"
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {currentStep === 0 && (
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
                                    {challenge.participants_count}/{challenge.max_participants ?? "∞"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm text-blue-600">
                            <Calendar className="h-4 w-4" />
                            Ends {formatDate(challenge.deadline)}
                        </div>

                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button type="button" variant="light" outlined onClick={handleClose} className="w-full sm:w-auto">
                                Maybe Later
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                loading={joining}
                                disabled={joining}
                                onClick={handleJoin}
                                className="w-full sm:w-auto"
                            >
                                Join Challenge →
                            </Button>
                        </div>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        {isDeclined && challenge.review_note && (
                            <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
                                <span className="font-semibold">Previous feedback:</span>{" "}
                                {challenge.review_note}
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Proof Photo
                            </label>

                            {preview ? (
                                <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                                    <img
                                        src={preview}
                                        alt="Submission preview"
                                        className="h-48 w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1 shadow transition hover:bg-white"
                                        aria-label="Remove photo"
                                    >
                                        <X className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition hover:border-gray-300 hover:bg-gray-50">
                                    <ImagePlus className="h-6 w-6" />
                                    <span className="text-xs">Upload a photo as proof</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button type="button" variant="light" outlined onClick={handleClose} className="w-full sm:w-auto">
                                Close
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                loading={submitting}
                                disabled={submitting || !photo}
                                onClick={handleSubmit}
                                className="w-full sm:w-auto"
                            >
                                Submit for Review
                            </Button>
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            Your proof was submitted on {formatDate(challenge.submitted_at)} and is
                            waiting for admin review.
                        </div>
                        {challenge.submission_url && (
                            <img
                                src={challenge.submission_url}
                                alt="Submitted proof"
                                className="h-48 w-full rounded-2xl object-cover"
                            />
                        )}
                        <div className="mt-2 flex justify-end">
                            <Button type="button" variant="light" outlined onClick={handleClose} className="w-full sm:w-auto">
                                Close
                            </Button>
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            Approved on {formatDate(challenge.reviewed_at)} — +{challenge.points} pts
                            awarded to your profile.
                        </div>
                        {challenge.submission_url && (
                            <img
                                src={challenge.submission_url}
                                alt="Submitted proof"
                                className="h-48 w-full rounded-2xl object-cover"
                            />
                        )}
                        <div className="mt-2 flex justify-end">
                            <Button type="button" variant="light" outlined onClick={handleClose} className="w-full sm:w-auto">
                                Close
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
