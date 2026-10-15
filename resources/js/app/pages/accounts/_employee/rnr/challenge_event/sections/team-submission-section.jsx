import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlus, Users, X } from "lucide-react";
import Button from "@/app/_components/button";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import { submit_engagement_reward_challenge_team_proof_thunk } from "@/app/redux/engagement-thunk";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 1024 * 1024 * 1024;
const IMAGE_LIMIT_NOTICE = "You can upload a maximum of 3 images per submission. Please remove the extra images to continue.";
const VIDEO_MIMES = ["video/mp4", "video/quicktime", "video/webm"];

export default function TeamSubmissionSection({ challenge, onClose }) {
    const dispatch = useDispatch();
    const submittingId = useSelector(
        (state) => state.engagement.rewardChallengeTeamSubmittingId,
    );
    const [media, setMedia] = useState([]);
    const mediaRef = useRef(media);
    mediaRef.current = media;
    const [mediaError, setMediaError] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [submittedNow, setSubmittedNow] = useState(false);
    const submitting = submittingId === challenge.id;
    const submissionLocked = Boolean(challenge.team_submission_locked || submittedNow);
    const allowsVideo = challenge.proof_type === "photo_or_video";
    const uploadProgress = useSelector((state) => state.engagement.rewardChallengeUploadProgress);

    useEffect(() => () => {
        mediaRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    }, []);

    useEffect(() => {
        setSubmittedNow(false);
    }, [challenge.id]);

    const clearMedia = () => {
        mediaRef.current.forEach((item) => URL.revokeObjectURL(item.url));
        mediaRef.current = [];
        setMedia([]);
        setMediaError("");
    };

    const removeMedia = (url) => {
        const removed = mediaRef.current.find((item) => item.url === url);
        if (removed) URL.revokeObjectURL(removed.url);
        const updated = mediaRef.current.filter((item) => item.url !== url);
        mediaRef.current = updated;
        setMedia(updated);
        setMediaError("");
    };

    const handleMediaChange = (event) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";
        if (!files.length) return;

        const selectingVideo = files.some((file) => file.type.startsWith("video/"));
        if (selectingVideo && (!allowsVideo || files.length !== 1 || mediaRef.current.length > 0)) {
            setMediaError(allowsVideo
                ? "Upload either images or one video per submission."
                : "This challenge only accepts photo proof.");
            return;
        }
        if (!selectingVideo && mediaRef.current.some((item) => item.type === "video")) {
            setMediaError("Remove the selected video before choosing images.");
            return;
        }

        const imageCount = mediaRef.current.filter((item) => item.type === "image").length;
        if (!selectingVideo && imageCount + files.length > MAX_IMAGES) {
            setMediaError(IMAGE_LIMIT_NOTICE);
            return;
        }

        const invalidFile = files.find((file) => {
            if (file.type.startsWith("image/")) {
                return !["image/jpeg", "image/png", "image/webp"].includes(file.type)
                    || file.size > MAX_IMAGE_SIZE;
            }
            return !allowsVideo || !VIDEO_MIMES.includes(file.type) || file.size > MAX_VIDEO_SIZE;
        });
        if (invalidFile) {
            setMediaError(invalidFile.type.startsWith("video/")
                ? "Videos must be MP4, MOV, or WebM files no larger than 1 GB."
                : "Images must be JPEG, PNG, or WebP files no larger than 5 MB.");
            return;
        }

        const added = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" : "image",
        }));
        const updated = [...mediaRef.current, ...added];
        mediaRef.current = updated;
        setMedia(updated);
        setMediaError("");
        setErrors((current) => ({ ...current, photos: null, video: null }));
    };

    const handleSubmit = async () => {
        if (!media.length || media.filter((item) => item.type === "image").length > MAX_IMAGES || !description.trim() || submitting) return;

        const result = await dispatch(
            submit_engagement_reward_challenge_team_proof_thunk({
                id: challenge.id,
                media,
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

        clearMedia();
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
                <p className="mb-1 text-sm font-medium text-gray-700">Team Proof</p>
                <p className="mb-2 text-xs text-gray-500">
                    {allowsVideo ? "Photo or video proof is accepted. Choose up to 3 images or one video (MP4, MOV, WebM, max 1 GB)." : "Photo proof only. Choose up to 3 images (JPEG, PNG, WebP, max 5 MB each)."}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {media.map((item, index) => (
                        <div key={item.url} className="relative overflow-hidden rounded-2xl border border-gray-200">
                            {item.type === "video" ? (
                                <video src={item.url} controls className="h-40 w-full bg-black object-contain" aria-label="Team video submission preview" />
                            ) : (
                                <img src={item.url} alt={`Team proof preview ${index + 1}`} className="h-40 w-full object-cover" />
                            )}
                            <button
                                type="button"
                                onClick={() => removeMedia(item.url)}
                                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 shadow transition hover:bg-white"
                                aria-label={`Remove ${item.type === "video" ? "video" : `image ${index + 1}`}`}
                            >
                                <X className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                    ))}
                    {!media.some((item) => item.type === "video") && (
                        <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition hover:border-gray-300 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                            <ImagePlus className="h-6 w-6" />
                            <span className="text-xs">{media.length ? "Add proof images" : allowsVideo ? "Upload images or one video" : "Upload proof images"}</span>
                            <input
                                type="file"
                                accept={allowsVideo ? "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" : "image/jpeg,image/png,image/webp"}
                                multiple
                                className="sr-only"
                                aria-label="Upload team challenge proof images or video"
                                onChange={handleMediaChange}
                            />
                        </label>
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    {media.filter((item) => item.type === "image").length}/{MAX_IMAGES} images selected
                    {media.some((item) => item.type === "video") && " · 1 video selected"}
                </p>
                {mediaError && <p role="alert" className="mt-1 text-sm text-red-600">{mediaError}</p>}
                {(errors.photos?.[0] || errors["photos.0"]?.[0] || errors.video?.[0] || errors.photo?.[0]) && (
                    <p role="alert" className="mt-1 text-sm text-red-600">
                        {errors.photos?.[0] || errors["photos.0"]?.[0] || errors.video?.[0] || errors.photo?.[0]}
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
                    disabled={submitting || !media.length || !description.trim()}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto"
                >
                    Submit Team Proof
                </Button>
            </div>
            {submitting && (
                <div role="status" className="mt-2 space-y-1">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full bg-purple-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-right text-xs text-gray-500">
                        {uploadProgress >= 100 ? "Saving submission…" : `Uploading ${uploadProgress}%`}
                    </p>
                </div>
            )}
        </div>
    );
}
