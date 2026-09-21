import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlus, X } from "lucide-react";
import Button from "@/app/_components/button";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import { submit_engagement_reward_challenge_proof_thunk } from "@/app/redux/engagement-thunk";

export default function ChallengeFlowSubmitSection({
    challenge,
    isDeclined,
    isOpen,
    onClose,
}) {
    const dispatch = useDispatch();
    const { rewardChallengeSubmittingId } = useSelector(
        (state) => state.engagement,
    );
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState("");
    const submitting = rewardChallengeSubmittingId === challenge.id;

    useEffect(() => {
        if (!isOpen) {
            removePhoto();
            setDescription("");
        }
    }, [isOpen]);

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

    const handleSubmit = async () => {
        if (!photo || !description.trim()) return;

        const result = await dispatch(
            submit_engagement_reward_challenge_proof_thunk({
                id: challenge.id,
                photo,
                challengeDescription: description.trim(),
            }),
        );

        if (
            submit_engagement_reward_challenge_proof_thunk.rejected.match(
                result,
            )
        ) {
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
        setDescription("");
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
        <>
            {isDeclined && challenge.review_note && (
                <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    <span className="font-semibold">Previous feedback:</span>{" "}
                    {challenge.review_note}
                </div>
            )}

            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Challenge
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {challenge.description}
                </p>
            </div>

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
                        <span className="text-xs">
                            Upload a photo as proof
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </label>
                )}

                <div className="mt-4">
                    <TextArea
                        name="challenge_description"
                        label="Description / Explanation *"
                        placeholder="Description / Explanation *"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        minLength={10}
                        maxLength={500}
                    />
                </div>
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
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
                    Submit for Review
                </Button>
            </div>
        </>
    );
}
