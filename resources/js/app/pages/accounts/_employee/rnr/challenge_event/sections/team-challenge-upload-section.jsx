import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Upload } from "lucide-react";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_my_engagement_reward_challenges_thunk,
    submit_engagement_reward_challenge_team_proof_thunk,
} from "@/app/redux/engagement-thunk";

export default function TeamChallengeUploadSection() {
    const dispatch = useDispatch();
    const {
        isChallengeLeader,
        myRewardChallenges,
        myRewardChallengesLoading,
        challengeTeamSubmissionUploading,
    } = useSelector((state) => state.engagement);
    const [isOpen, setIsOpen] = useState(false);
    const [challengeId, setChallengeId] = useState("");
    const [photo, setPhoto] = useState(null);
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [imageKey, setImageKey] = useState(0);

    const challengeOptions = useMemo(
        () => myRewardChallenges
            .filter((challenge) => challenge.type === "Team" && challenge.status === "Active")
            .map((challenge) => ({ value: String(challenge.id), label: challenge.title })),
        [myRewardChallenges],
    );

    if (!isChallengeLeader) return null;

    const closeModal = () => {
        if (challengeTeamSubmissionUploading) return;
        setIsOpen(false);
        setChallengeId("");
        setPhoto(null);
        setDescription("");
        setErrors({});
        setImageKey((key) => key + 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        if (!challengeId || !photo || !description.trim()) {
            setErrors({
                ...(!challengeId ? { challenge_id: "Select an active team challenge." } : {}),
                ...(!photo ? { photo: "Upload a proof image." } : {}),
                ...(!description.trim() ? { challenge_description: "Describe the team proof." } : {}),
            });
            return;
        }

        const result = await dispatch(submit_engagement_reward_challenge_team_proof_thunk({
            id: challengeId,
            photo,
            challengeDescription: description.trim(),
        }));

        if (submit_engagement_reward_challenge_team_proof_thunk.rejected.match(result)) {
            const responseErrors = result.payload?.errors ?? {};
            setErrors(Object.fromEntries(
                Object.entries(responseErrors).map(([key, messages]) => [
                    ["challenge", "team"].includes(key) ? "challenge_id" : key,
                    messages?.[0] ?? "Invalid value.",
                ]),
            ));
            dispatch(setAlert({
                type: "danger",
                title: "Unable to submit team challenge",
                message: result.payload?.message || "Please try again.",
                open: true,
            }));
            return;
        }

        dispatch(setAlert({
            type: "success",
            title: "Team proof submitted",
            message: "The shared proof was submitted for all eligible direct reports. Points are awarded after approval and any required survey.",
            open: true,
        }));
        dispatch(get_my_engagement_reward_challenges_thunk());
        closeModal();
    };

    return (
        <>
            <div className="mb-4 flex justify-end px-4 sm:px-6 lg:px-8">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsOpen(true)}
                    className="gap-2"
                >
                    <Users className="h-4 w-4" />
                    Upload Team Challenge
                </Button>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} title="Upload Team Challenge" width="sm:max-w-xl">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <p className="text-sm text-gray-600">
                        One shared proof is submitted for your direct reports. Each member receives the full challenge points after approval.
                    </p>
                    {challengeOptions.length > 0 ? (
                        <div>
                            <label htmlFor="team-challenge-id" className="mb-1 block text-sm font-medium text-gray-700">
                                Team Challenge
                            </label>
                            <select
                                id="team-challenge-id"
                                name="challenge_id"
                                value={challengeId}
                                onChange={(event) => {
                                    setChallengeId(event.target.value);
                                    setErrors((current) => ({ ...current, challenge_id: null }));
                                }}
                                disabled={myRewardChallengesLoading || challengeTeamSubmissionUploading}
                                required
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select an active team challenge</option>
                                {challengeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            {errors.challenge_id && <p className="mt-1 text-sm text-red-600">{errors.challenge_id}</p>}
                        </div>
                    ) : (
                        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                            There are no active Team challenges available to submit right now.
                        </p>
                    )}
                    <Input
                        key={imageKey}
                        name="photo"
                        type="file"
                        label="Shared proof image"
                        accept="image/jpeg,image/png,image/webp"
                        error={errors.photo}
                        onChange={(event) => {
                            setPhoto(event.target.files?.[0] ?? null);
                            setErrors((current) => ({ ...current, photo: null }));
                        }}
                        disabled={challengeTeamSubmissionUploading}
                        required
                    />
                    {photo && <p className="-mt-4 text-xs text-gray-500">Selected file: {photo.name}</p>}
                    <TextArea
                        name="challenge_description"
                        label="Submission details"
                        rows={4}
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            setErrors((current) => ({ ...current, challenge_description: null }));
                        }}
                        error={errors.challenge_description}
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="light" outlined onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={challengeTeamSubmissionUploading}
                            disabled={!challengeOptions.length}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Submit Team Proof
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
