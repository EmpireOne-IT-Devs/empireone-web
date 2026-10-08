import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Eye, Users } from "lucide-react";
import moment from "moment";
import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import Skeleton from "@/app/_components/skeleton";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_engagement_reward_challenge_participants_thunk,
    approve_engagement_reward_challenge_submission_thunk,
} from "@/app/redux/engagement-thunk";
import ProofSection from "../../submissions/sections/proof-section";
import DeclineSection from "../../submissions/sections/decline-section";

const STATUS_VARIANT = {
    joined: "primary",
    submitted: "warning",
    approved: "success",
    declined: "danger",
};

const STATUS_LABEL = {
    joined: "Joined",
    submitted: "Pending Review",
    approved: "Approved",
    declined: "Declined",
};

export default function ParticipantsTableSection({ challengeId, onBack }) {
    const dispatch = useDispatch();
    const {
        rewardChallengeParticipants = [],
        rewardChallengeParticipantsChallenge: challenge,
        rewardChallengeParticipantsLoading,
        challengeSubmissionApprovingId,
    } = useSelector((state) => state.engagement);
    const [proofTarget, setProofTarget] = useState(null);
    const [declineTarget, setDeclineTarget] = useState(null);

    const fetchParticipants = () => {
        if (challengeId) {
            dispatch(
                get_engagement_reward_challenge_participants_thunk(challengeId),
            );
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [dispatch, challengeId]);

    // Shape a participant row into the submission shape ProofSection expects.
    const toSubmission = (participant) => ({
        id: participant.participant_id,
        status: participant.status,
        submission_url: participant.submission_url,
        submitted_at: participant.submitted_at,
        challenge_description: participant.challenge_description,
        employee: { name: participant.name, email: participant.email },
        challenge: challenge
            ? {
                  id: challenge.id,
                  title: challenge.title,
                  points: challenge.points,
              }
            : null,
    });

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

        fetchParticipants();
        dispatch(
            setAlert({
                type: "success",
                title: "Submission approved",
                message: `+${submission.challenge?.points ?? 0} pts awarded to ${submission.employee.name}.`,
                open: true,
            }),
        );
    };

    const handleDeclineClose = () => {
        setDeclineTarget(null);
        fetchParticipants();
    };

    const columns = [
        { header: "EMPLOYEE", accessor: "employee", width: "min-w-[260px]" },
        { header: "STATUS", accessor: "status" },
        { header: "JOINED", accessor: "joined_at" },
        { header: "SUBMITTED", accessor: "submitted_at" },
        { header: "PROOF", accessor: "proof" },
    ];

    const data = rewardChallengeParticipants.map((participant) => ({
        id: participant.id,
        employee: (
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-950">
                    {participant.name}
                </div>
                <div className="truncate text-xs text-slate-400">
                    {participant.email}
                </div>
            </div>
        ),
        status: (
            <Badge
                label={STATUS_LABEL[participant.status] ?? participant.status}
                variant={STATUS_VARIANT[participant.status] ?? "primary"}
                outlined
                className="rounded-full px-3 py-1 text-xs font-medium"
            />
        ),
        joined_at: (
            <span className="text-sm text-slate-500">
                {participant.joined_at
                    ? moment(participant.joined_at).format(
                          "MMM DD, YYYY, h:mm A",
                      )
                    : "—"}
            </span>
        ),
        submitted_at: (
            <span className="text-sm text-slate-500">
                {participant.submitted_at
                    ? moment(participant.submitted_at).format(
                          "MMM DD, YYYY h:mm A",
                      )
                    : "—"}
            </span>
        ),
        proof: participant.submission_url ? (
            <button
                type="button"
                onClick={() => setProofTarget(toSubmission(participant))}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
            >
                <Eye className="h-3.5 w-3.5" />
                View
            </button>
        ) : (
            <span className="text-sm text-slate-400">—</span>
        ),
    }));

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-black"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    ) : (
                        <Link
                            href="/accounts/administrator/rnr/challenges_events/manage"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-black"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                    )}
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            {challenge?.title ?? "Challenge Participants"}
                        </h2>
                        <p className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Users className="h-3.5 w-3.5" />
                            {rewardChallengeParticipants.length}/
                            {challenge?.max_participants ?? "∞"} participants
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                {rewardChallengeParticipantsLoading ? (
                    <div className="p-6">
                        <Skeleton variant="table" />
                    </div>
                ) : rewardChallengeParticipants.length === 0 ? (
                    <p className="p-6 text-sm text-slate-500">
                        No participants have joined this challenge yet.
                    </p>
                ) : (
                    <Table columns={columns} data={data} />
                )}
            </div>

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

            <DeclineSection
                submission={declineTarget}
                onClose={handleDeclineClose}
            />
        </div>
    );
}
