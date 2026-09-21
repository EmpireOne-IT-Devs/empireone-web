import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, ChevronDown, Eye, X } from "lucide-react";
import Button from "@/app/_components/button";
import Badge from "@/app/_components/badge";
import Skeleton from "@/app/_components/skeleton";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_engagement_reward_challenge_submissions_thunk,
    get_engagement_reward_challenge_submission_stats_thunk,
    approve_engagement_reward_challenge_submission_thunk,
} from "@/app/redux/engagement-thunk";
import moment from "moment/moment";
import ProofSection from "./proof-section";
import DeclineSection from "./decline-section";

const STATUS_BADGE = {
    submitted: { label: "Pending Review", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    declined: { label: "Rejected", variant: "danger" },
};

export default function TableSection() {
    const dispatch = useDispatch();
    const {
        challengeSubmissions,
        challengeSubmissionsLoading,
        challengeSubmissionApprovingId,
    } = useSelector((state) => state.engagement);
    const [declineTarget, setDeclineTarget] = useState(null);
    const [proofTarget, setProofTarget] = useState(null);
    const [selectedChallengeId, setSelectedChallengeId] = useState(null);
    const [isChallengeFilterOpen, setIsChallengeFilterOpen] = useState(false);
    const challengeFilterRef = useRef(null);

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_submissions_thunk());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!challengeFilterRef.current?.contains(event.target)) {
                setIsChallengeFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const challengeOptions = useMemo(() => {
        const seen = new Map();
        challengeSubmissions.forEach((submission) => {
            const challenge = submission.challenge;
            if (challenge?.id && !seen.has(challenge.id)) {
                seen.set(challenge.id, challenge);
            }
        });
        return Array.from(seen.values());
    }, [challengeSubmissions]);

    const filteredSubmissions = useMemo(() => {
        if (!selectedChallengeId) return challengeSubmissions;
        return challengeSubmissions.filter(
            (submission) => submission.challenge?.id === selectedChallengeId,
        );
    }, [challengeSubmissions, selectedChallengeId]);

    const selectedChallenge = useMemo(
        () =>
            challengeOptions.find(
                (challenge) => challenge.id === selectedChallengeId,
            ) ?? null,
        [challengeOptions, selectedChallengeId],
    );

    const handleSelectChallenge = (challengeId) => {
        setSelectedChallengeId(challengeId);
        setIsChallengeFilterOpen(false);
    };

    const handleApprove = async (submission) => {
        const result = await dispatch(
            approve_engagement_reward_challenge_submission_thunk(submission.id),
        );

        if (
            approve_engagement_reward_challenge_submission_thunk.rejected.match(
                result,
            )
        ) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to approve submission",
                    message: result.payload?.message || "Please try again.",
                    open: true,
                }),
            );
            return;
        }

        dispatch(get_engagement_reward_challenge_submission_stats_thunk());
        dispatch(
            setAlert({
                type: "success",
                title: "Submission approved",
                message: `+${submission.challenge.points} pts awarded to ${submission.employee.name}.`,
                open: true,
            }),
        );
    };

    const handleDeclineClose = () => {
        setDeclineTarget(null);
        dispatch(get_engagement_reward_challenge_submission_stats_thunk());
    };

    if (challengeSubmissionsLoading) {
        return (
            <div className="mt-6 overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
                <Skeleton variant="table" lines={5} />
            </div>
        );
    }

    if (challengeSubmissions.length === 0) {
        return (
            <p className="mt-6 rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                No challenge submissions yet.
            </p>
        );
    }

    return (
        <div className="mt-6 overflow-visible rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <tr>
                        <th className="px-4 py-3">Employee</th>
                        <th
                            className="relative px-4 py-3"
                            ref={challengeFilterRef}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setIsChallengeFilterOpen((value) => !value)
                                }
                                className={`flex items-center gap-1 uppercase tracking-wide transition-colors ${
                                    selectedChallenge
                                        ? "text-orange-600"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <span className="max-w-[140px] truncate">
                                    {selectedChallenge?.title ?? "Challenge"}
                                </span>
                                <ChevronDown
                                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                                        isChallengeFilterOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {isChallengeFilterOpen && (
                                <div className="absolute left-0 top-full z-20 mt-1 max-h-72 w-56 overflow-auto rounded-xl border border-gray-100 bg-white text-left normal-case text-gray-700 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSelectChallenge(null)
                                        }
                                        className={`block w-full px-4 py-2 text-left text-sm ${
                                            !selectedChallengeId
                                                ? "bg-orange-50 font-medium text-orange-700"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        All Challenges
                                    </button>
                                    {challengeOptions.length === 0 ? (
                                        <div className="px-4 py-2 text-sm text-gray-400">
                                            No challenges available.
                                        </div>
                                    ) : (
                                        challengeOptions.map((challenge) => {
                                            const isActive =
                                                challenge.id ===
                                                selectedChallengeId;

                                            return (
                                                <button
                                                    key={challenge.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectChallenge(
                                                            challenge.id,
                                                        )
                                                    }
                                                    className={`block w-full truncate px-4 py-2 text-left text-sm ${
                                                        isActive
                                                            ? "bg-orange-50 font-medium text-orange-700"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {challenge.title}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </th>

                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Status</th>

                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredSubmissions.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-6 text-center text-sm text-gray-500"
                            >
                                No submissions found for{" "}
                                {selectedChallenge?.title ?? "this challenge"}.
                            </td>
                        </tr>
                    )}
                    {filteredSubmissions.map((submission) => {
                        const badge =
                            STATUS_BADGE[submission.status] ??
                            STATUS_BADGE.submitted;
                        const approving =
                            challengeSubmissionApprovingId === submission.id;

                        return (
                            <tr key={submission.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">
                                        {submission.employee.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {submission.employee.email}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">
                                        {submission.challenge.title}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        +{submission.challenge.points} pts
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                    {moment(submission.submitted_at).format(
                                        "MMM D, YYYY, h:mm A",
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge
                                        label={badge.label}
                                        variant={badge.variant}
                                    />
                                    {submission.status === "declined" &&
                                        submission.review_note && (
                                            <p className="mt-1 text-xs text-gray-400">
                                                {submission.review_note}
                                            </p>
                                        )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="light"
                                            outlined
                                            size="sm"
                                            onClick={() =>
                                                setProofTarget(submission)
                                            }
                                        >
                                            <Eye className="mr-1 h-3.5 w-3.5" />{" "}
                                            View
                                        </Button>
                                        {submission.status === "submitted" && (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    outlined
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeclineTarget(
                                                            submission,
                                                        )
                                                    }
                                                >
                                                    <X className="mr-1 h-3.5 w-3.5" />{" "}
                                                    Decline
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="success"
                                                    size="sm"
                                                    loading={approving}
                                                    disabled={approving}
                                                    onClick={() =>
                                                        handleApprove(
                                                            submission,
                                                        )
                                                    }
                                                >
                                                    <Check className="mr-1 h-3.5 w-3.5" />{" "}
                                                    Approve
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <DeclineSection
                submission={declineTarget}
                onClose={handleDeclineClose}
            />
            <ProofSection
                submission={proofTarget}
                onClose={() => setProofTarget(null)}
                onApprove={handleApprove}
                onDecline={(submission) => {
                    setProofTarget(null);
                    setDeclineTarget(submission);
                }}
                approvingId={challengeSubmissionApprovingId}
            />
        </div>
    );
}
