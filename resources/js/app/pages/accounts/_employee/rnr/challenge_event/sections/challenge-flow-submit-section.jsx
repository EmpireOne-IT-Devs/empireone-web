import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiImage as ImagePlus,
    FiX as X,
    FiClock as Clock3,
    FiClipboard as ClipboardList,
} from "react-icons/fi";
import Button from "@/app/_components/button";
import TextArea from "@/app/_components/textarea";
import moment from "moment/moment";
import { setAlert } from "@/app/redux/app-slice";
import {
    submit_engagement_reward_challenge_proof_thunk,
    submit_engagement_reward_challenge_daily_proof_thunk,
} from "@/app/redux/engagement-thunk";
import TeamSubmissionSection from "./team-submission-section";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 1024 * 1024 * 1024;
const IMAGE_LIMIT_NOTICE = "You can upload a maximum of 3 images per submission. Please remove the extra images to continue.";
const VIDEO_MIMES = ["video/mp4", "video/quicktime", "video/webm"];

export default function ChallengeFlowSubmitSection({
    challenge,
    isDeclined,
    isOpen,
    onClose,
    canSubmitTeam,
    individualSubmitted = false,
    onTakeSurvey,
}) {
    const dispatch = useDispatch();
    const { rewardChallengeSubmittingId, rewardChallengeUploadProgress } = useSelector(
        (state) => state.engagement,
    );
    const [media, setMedia] = useState([]);
    const mediaRef = useRef(media);
    mediaRef.current = media;
    const [mediaError, setMediaError] = useState("");
    const [description, setDescription] = useState("");
    const [submissionMode, setSubmissionMode] = useState("individual");
    const submitting = rewardChallengeSubmittingId === challenge.id;
    const isDaily = challenge.is_daily_challenge;
    const allowsVideo = challenge.proof_type === "photo_or_video";
    const surveyGateActive =
        challenge.survey_required &&
        !challenge.survey_completed &&
        challenge.status !== "Upcoming";

    useEffect(() => {
        if (!isOpen) {
            clearMedia();
            setDescription("");
            setSubmissionMode("individual");
        }
    }, [isOpen]);

    useEffect(() => () => {
        mediaRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    }, []);

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
    };

    const handleSubmit = async () => {
        if (submitting || !media.length || media.filter((item) => item.type === "image").length > MAX_IMAGES || !description.trim()) return;

        const thunk = isDaily
            ? submit_engagement_reward_challenge_daily_proof_thunk
            : submit_engagement_reward_challenge_proof_thunk;

        const result = await dispatch(
            thunk({
                id: challenge.id,
                media,
                challengeDescription: description.trim(),
            }),
        );

        if (thunk.rejected.match(result)) {
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

        clearMedia();
        setDescription("");
        dispatch(
            setAlert({
                type: "success",
                title: isDaily ? "Today's proof submitted" : "Proof submitted",
                message: isDaily
                    ? "Nice work! Today's submission is pending review. Come back tomorrow for the next day."
                    : "Your submission is now pending admin review.",
                open: true,
            }),
        );
    };

    if (surveyGateActive) {
        return (
            <>
                <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4">
                    <ClipboardList className="h-5 w-5 shrink-0 text-purple-600" aria-hidden="true" />
                    <div>
                        <p className="text-sm font-semibold text-purple-900">
                            Answer the survey first
                        </p>
                        <p className="mt-0.5 text-sm text-purple-700">
                            This challenge requires the survey before you can submit proof.
                            It only takes a minute and earns bonus points.
                        </p>
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
                        onClick={onTakeSurvey}
                        className="w-full sm:w-auto"
                    >
                        Take the Survey
                    </Button>
                </div>
            </>
        );
    }

    if (challenge.status === "Upcoming") {
        return (
            <>
                <div role="status" className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-600">
                    <Clock3 className="h-4 w-4 shrink-0" />
                    This challenge starts on {moment(challenge.start_date).format("MMM D, YYYY")}.
                    You can submit proof once it starts.
                </div>
                <div className="mt-2 flex justify-end">
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
            </>
        );
    }

    const modeSelector = canSubmitTeam ? (
        <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">
                How would you like to submit?
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                    { value: "individual", label: "Individual submission" },
                    { value: "team", label: "Team submission" },
                ].map((mode) => (
                    <Button
                        key={mode.value}
                        type="button"
                        variant={submissionMode === mode.value ? "primary" : "light"}
                        outlined={submissionMode !== mode.value}
                        aria-pressed={submissionMode === mode.value}
                        onClick={() => setSubmissionMode(mode.value)}
                        className="w-full"
                    >
                        {mode.label}
                    </Button>
                ))}
            </div>
        </fieldset>
    ) : null;

    // A daily challenge already has today's submission in for review — show a
    // waiting state instead of letting the employee submit a second photo.
    if (isDaily && challenge.submitted_today && submissionMode === "individual") {
        return (
            <>
                {modeSelector}
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    <Clock3 className="h-4 w-4 shrink-0" />
                    You already submitted today's proof. It's pending admin review —
                    come back tomorrow to submit the next day.
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-500">
                    Progress: {challenge.completed_days ?? 0} of{" "}
                    {challenge.required_days ?? 1} days completed
                </div>
                <div className="mt-2 flex justify-end">
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
            </>
        );
    }

    if (submissionMode === "team" && canSubmitTeam) {
        return (
            <>
                {modeSelector}
                <TeamSubmissionSection challenge={challenge} onClose={onClose} />
            </>
        );
    }

    if (individualSubmitted) {
        return (
            <>
                {modeSelector}
                <div role="status" className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Your individual proof has already been recorded. Select Team submission to submit proof for your eligible direct reports.
                </div>
            </>
        );
    }

    return (
        <>
            {modeSelector}
            {isDeclined && challenge.review_note && (
                <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    <span className="font-semibold">Previous feedback:</span>{" "}
                    {challenge.review_note}
                </div>
            )}

            {isDaily && (
                <div className="flex w-fit items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    <Clock3 className="h-3.5 w-3.5" />
                    Day {(challenge.completed_days ?? 0) + 1} of {challenge.required_days ?? 1}
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Proof
                </label>

                <p className="mb-2 text-xs text-gray-500">
                    {allowsVideo ? "Photo or video proof is accepted. Choose up to 3 images or one video (MP4, MOV, WebM, max 1 GB)." : "Photo proof only. Choose up to 3 images (JPEG, PNG, WebP, max 5 MB each)."}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {media.map((item, index) => (
                        <div key={item.url} className="relative overflow-hidden rounded-2xl border border-gray-200">
                            {item.type === "video" ? (
                                <video src={item.url} controls className="h-40 w-full bg-black object-contain" aria-label="Video submission preview" />
                            ) : (
                                <img src={item.url} alt={`Submission preview ${index + 1}`} className="h-40 w-full object-cover" />
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
                        <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition hover:border-gray-300 hover:bg-gray-50">
                            <ImagePlus className="h-6 w-6" />
                            <span className="text-xs">
                                {media.length ? "Add proof images" : allowsVideo ? "Upload images or one video" : "Upload proof images"}
                            </span>
                            <input
                                type="file"
                                accept={allowsVideo ? "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" : "image/jpeg,image/png,image/webp"}
                                multiple
                                className="sr-only"
                                onChange={handleMediaChange}
                                aria-label="Upload challenge proof images or video"
                            />
                        </label>
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    {media.filter((item) => item.type === "image").length}/{MAX_IMAGES} images selected
                    {media.some((item) => item.type === "video") && " · 1 video selected"}
                </p>
                {mediaError && <p role="alert" className="mt-1 text-sm text-red-600">{mediaError}</p>}

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
                    disabled={submitting || !media.length || !description.trim()}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto"
                >
                    {isDaily ? "Submit Today's Proof" : "Submit for Review"}
                </Button>
            </div>
            {submitting && (
                <div role="status" className="mt-2 space-y-1">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full bg-purple-600 transition-all" style={{ width: `${rewardChallengeUploadProgress}%` }} />
                    </div>
                    <p className="text-right text-xs text-gray-500">
                        {rewardChallengeUploadProgress >= 100
                            ? "Saving submission…"
                            : `Uploading ${rewardChallengeUploadProgress}%`}
                    </p>
                </div>
            )}
        </>
    );
}
