import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, X } from "lucide-react";
import Button from "@/app/_components/button";
import Badge from "@/app/_components/badge";
import Modal from "@/app/_components/modal";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_engagement_reward_challenge_submissions_thunk,
    get_engagement_reward_challenge_submission_stats_thunk,
    approve_engagement_reward_challenge_submission_thunk,
    decline_engagement_reward_challenge_submission_thunk,
} from "@/app/redux/engagement-thunk";

const STATUS_BADGE = {
    submitted: { label: "Pending Review", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    declined: { label: "Rejected", variant: "danger" },
};

function formatDateTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function DeclineModal({ submission, onClose }) {
    const dispatch = useDispatch();
    const { challengeSubmissionDecliningId } = useSelector((state) => state.engagement);
    const [note, setNote] = useState("");

    if (!submission) return null;

    const declining = challengeSubmissionDecliningId === submission.id;

    const handleDecline = async () => {
        const result = await dispatch(
            decline_engagement_reward_challenge_submission_thunk({ id: submission.id, review_note: note }),
        );

        if (decline_engagement_reward_challenge_submission_thunk.rejected.match(result)) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to decline submission",
                    message: result.payload?.message || "Please try again.",
                    open: true,
                }),
            );
            return;
        }

        dispatch(
            setAlert({
                type: "success",
                title: "Submission declined",
                message: `${submission.employee.name}'s submission was declined.`,
                open: true,
            }),
        );
        onClose();
    };

    return (
        <Modal
            isOpen={Boolean(submission)}
            onClose={onClose}
            width="max-w-md"
            title={
                <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                    Decline Submission
                </h2>
            }
        >
            <div className="mt-2 flex flex-col gap-4 pb-2">
                <TextArea
                    label="Reason (optional)"
                    name="review_note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Let the employee know why this was declined..."
                />
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="light" outlined onClick={onClose} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        loading={declining}
                        disabled={declining}
                        onClick={handleDecline}
                        className="w-full sm:w-auto"
                    >
                        Decline Submission
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default function TableSection() {
    const dispatch = useDispatch();
    const { challengeSubmissions, challengeSubmissionsLoading, challengeSubmissionApprovingId } = useSelector(
        (state) => state.engagement,
    );
    const [declineTarget, setDeclineTarget] = useState(null);

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_submissions_thunk());
    }, [dispatch]);

    const handleApprove = async (submission) => {
        const result = await dispatch(approve_engagement_reward_challenge_submission_thunk(submission.id));

        if (approve_engagement_reward_challenge_submission_thunk.rejected.match(result)) {
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
        return <p className="mt-6 text-sm text-gray-500">Loading submissions...</p>;
    }

    if (challengeSubmissions.length === 0) {
        return (
            <p className="mt-6 rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                No challenge submissions yet.
            </p>
        );
    }

    return (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <tr>
                        <th className="px-4 py-3">Proof</th>
                        <th className="px-4 py-3">Employee</th>
                        <th className="px-4 py-3">Challenge</th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {challengeSubmissions.map((submission) => {
                        const badge = STATUS_BADGE[submission.status] ?? STATUS_BADGE.submitted;
                        const approving = challengeSubmissionApprovingId === submission.id;

                        return (
                            <tr key={submission.id}>
                                <td className="px-4 py-3">
                                    {submission.submission_url ? (
                                        <a href={submission.submission_url} target="_blank" rel="noreferrer">
                                            <img
                                                src={submission.submission_url}
                                                alt="Submission proof"
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        </a>
                                    ) : (
                                        <span className="text-xs text-gray-400">No photo</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">{submission.employee.name}</p>
                                    <p className="text-xs text-gray-400">{submission.employee.email}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">{submission.challenge.title}</p>
                                    <p className="text-xs text-gray-400">+{submission.challenge.points} pts</p>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                    {formatDateTime(submission.submitted_at)}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge label={badge.label} variant={badge.variant} />
                                    {submission.status === "declined" && submission.review_note && (
                                        <p className="mt-1 text-xs text-gray-400">{submission.review_note}</p>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {submission.status === "submitted" ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="danger"
                                                outlined
                                                size="sm"
                                                onClick={() => setDeclineTarget(submission)}
                                            >
                                                <X className="mr-1 h-3.5 w-3.5" /> Decline
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="success"
                                                size="sm"
                                                loading={approving}
                                                disabled={approving}
                                                onClick={() => handleApprove(submission)}
                                            >
                                                <Check className="mr-1 h-3.5 w-3.5" /> Approve
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">Reviewed</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <DeclineModal submission={declineTarget} onClose={handleDeclineClose} />
        </div>
    );
}
