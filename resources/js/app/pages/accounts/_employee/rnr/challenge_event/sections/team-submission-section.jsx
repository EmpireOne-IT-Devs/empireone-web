import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlus, Users, X } from "lucide-react";
import Button from "@/app/_components/button";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import { submit_engagement_reward_challenge_team_proof_thunk } from "@/app/redux/engagement-thunk";

export default function TeamSubmissionSection({ challenge, onClose }) {
    const dispatch = useDispatch();
    const submittingId = useSelector(
        (state) => state.engagement.rewardChallengeTeamSubmittingId,
    );
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [submittedNow, setSubmittedNow] = useState(false);
    const submitting = submittingId === challenge.id;
    const submissionLocked = Boolean(challenge.team_submission_locked || submittedNow);

    useEffect(() => () => {
        if (preview) URL.revokeObjectURL(preview);
    }, [preview]);

    useEffect(() => {
        setSubmittedNow(false);
    }, [challenge.id]);

    const removePhoto = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPhoto(null);
        setPreview(null);
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        removePhoto();
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
        setErrors((current) => ({ ...current, photo: null }));
        event.target.value = "";
    };

    const handleSubmit = async () => {
        if (!photo || !description.trim() || submitting) return;

        const result = await dispatch(
            submit_engagement_reward_challenge_team_proof_thunk({
                id: challenge.id,
                photo,
                challengeDescription: description.trim(),
            }),
        );

        if (submit_engagement_reward_challenge_team_proof_thunk.rejected.match(result)) {
            const validationErrors = result.payload?.errors ?? {};
            setErrors(validationErrors);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to submit team proof",
                    message:
                        Object.values(validationErrors).flat()[0] ||
                        result.payload?.message ||
                        "Please check your team's eligibility and try again.",
                    open: true,
                }),
            );
            return;
        }

        removePhoto();
        setDescription("");
        setSubmittedNow(true);
        dispatch(
            setAlert({
                type: "success",
                title: "Team proof submitted",
                message: "Your eligible direct reports' proof is pending review.",
                open: true,
            }),
        );
    };

    if (submissionLocked) {
        const statusMessage = challenge.is_daily_challenge
            ? `Your team proof for ${challenge.team_submission_date ?? "today"} has already been submitted${challenge.team_submission_status === "approved" ? " and approved" : challenge.team_submission_status === "declined" ? " and declined" : " and is pending review"}. You can submit the next proof in the next daily window.`
            : `Your team proof has already been submitted${challenge.team_submission_status === "approved" ? " and approved" : " and is pending review"}. You cannot submit another team proof for this challenge.`;

        return (
            <div className="space-y-4">
                <div
                    role="status"
                    className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
                >
                    <Users className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{statusMessage}</p>
                </div>
                {challenge.team_submission_review_note && (
                    <p className="rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                        Review note: {challenge.team_submission_review_note}
                    </p>
                )}
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="light"
                        outlined
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-800">
                <Users className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                    Submit one shared proof for your eligible direct reports.
                    The team will be included in the challenge after review.
                </p>
            </div>
            {challenge.team_submission_status === "declined" &&
                challenge.team_submission_review_note && (
                    <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
                        <span className="font-semibold">Previous team-proof feedback:</span>{" "}
                        {challenge.team_submission_review_note}
                    </p>
                )}

            <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                    Team Proof Photo
                </p>

                {preview ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                        <img
                            src={preview}
                            alt="Team submission preview"
                            className="h-48 w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 shadow transition hover:bg-white"
                            aria-label="Remove team proof photo"
                        >
                            <X className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                ) : (
                    <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition hover:border-gray-300 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-xs">Upload a photo as team proof</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            aria-label="Upload a team proof photo"
                            onChange={handlePhotoChange}
                        />
                    </label>
                )}
                {errors.photo?.[0] && (
                    <p role="alert" className="mt-1 text-sm text-red-600">
                        {errors.photo[0]}
                    </p>
                )}
            </div>

            <TextArea
                name="team_challenge_description"
                label="Description / Explanation *"
                placeholder="Describe how the team completed the challenge."
                value={description}
                onChange={(event) => {
                    setDescription(event.target.value);
                    setErrors((current) => ({
                        ...current,
                        challenge_description: null,
                    }));
                }}
                required
                maxLength={1000}
            />
            {errors.challenge_description?.[0] && (
                <p role="alert" className="text-sm text-red-600">
                    {errors.challenge_description[0]}
                </p>
            )}
            {(errors.team?.[0] || errors.challenge?.[0]) && (
                <p role="alert" className="text-sm text-red-600">
                    {errors.team?.[0] || errors.challenge?.[0]}
                </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="light"
                    outlined
                    onClick={onClose}
                    className="w-full sm:w-auto"
                >
                    Close
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    loading={submitting}
                    disabled={submitting || !photo || !description.trim()}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto"
                >
                    Submit Team Proof
                </Button>
            </div>
        </div>
    );
}
