import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Eye, X } from "lucide-react";
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

export default function TableSection({ filters }) {
    const dispatch = useDispatch();
    const {
        challengeSubmissions,
        challengeSubmissionsLoading,
        challengeSubmissionApprovingId,
    } = useSelector((state) => state.engagement);
    const [declineTarget, setDeclineTarget] = useState(null);
    const [proofTarget, setProofTarget] = useState(null);
    const [submissionType, setSubmissionType] = useState("individual");
    const requestParams = useMemo(() => {
        const params = {};
        if (filters?.status) params.status = filters.status;
        if (filters?.challenge_id) params.challenge_id = filters.challenge_id;
        if (filters?.location_id) params.location_id = filters.location_id;
        if (filters?.search?.trim()) params.search = filters.search.trim();
        return params;
    }, [filters]);
    const individualSubmissions = challengeSubmissions.filter(
        (submission) => !submission.employees?.length,
    );
    const teamSubmissions = challengeSubmissions.filter(
        (submission) => submission.employees?.length > 0,
    );
    const visibleSubmissions =
        submissionType === "team" ? teamSubmissions : individualSubmissions;

    useEffect(() => {
        if (
            submissionType === "individual" &&
            individualSubmissions.length === 0 &&
            teamSubmissions.length > 0
        ) {
            setSubmissionType("team");
        } else if (
            submissionType === "team" &&
            teamSubmissions.length === 0 &&
            individualSubmissions.length > 0
        ) {
            setSubmissionType("individual");
        }
    }, [individualSubmissions.length, submissionType, teamSubmissions.length]);

    useEffect(() => {
        const debounceId = setTimeout(() => {
            dispatch(get_engagement_reward_challenge_submissions_thunk(requestParams));
        }, 250);

        return () => clearTimeout(debounceId);
    }, [dispatch, requestParams]);

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
        dispatch(get_engagement_reward_challenge_submissions_thunk(requestParams));
        dispatch(
            setAlert({
                type: "success",
                title: "Submission approved",
                message: submission.employees?.length
                    ? result.payload?.data?.team_points_awarded > 0
                        ? `Team proof approved for ${submission.employees.length} members. +${result.payload.data.team_points_awarded} challenge points awarded to the leader only.`
                        : `Team proof approved for ${submission.employees.length} members. Challenge points will be awarded to the leader when the full team challenge is complete.`
                    : `+${submission.challenge?.points ?? 0} pts awarded to ${submission.employee?.name ?? "the employee"}.`,
                open: true,
            }),
        );
    };

    const handleDeclineClose = () => {
        setDeclineTarget(null);
        dispatch(get_engagement_reward_challenge_submission_stats_thunk());
        dispatch(get_engagement_reward_challenge_submissions_thunk(requestParams));
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
            <div
                className="flex flex-wrap gap-2 border-b border-gray-100 px-4 py-3"
                aria-label="Submission type"
            >
                {[
                    { id: "individual", label: "Individual", count: individualSubmissions.length },
                    { id: "team", label: "Team", count: teamSubmissions.length },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        aria-pressed={submissionType === tab.id}
                        disabled={tab.count === 0}
                        onClick={() => setSubmissionType(tab.id)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            submissionType === tab.id
                                ? "bg-indigo-600 text-white shadow-sm"
                                : tab.count === 0
                                  ? "cursor-not-allowed bg-gray-50 text-gray-300"
                                  : "bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <tr>
                        <th className="px-4 py-3">EOID</th>
                        <th className="px-4 py-3">Fullname</th>
                        <th className="px-4 py-3">Challenge Title</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Account</th>
                        <th className="px-4 py-3">Points</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Survey</th>

                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {visibleSubmissions.length === 0 && (
                        <tr>
                            <td
                                colSpan={11}
                                className="px-4 py-6 text-center text-sm text-gray-500"
                            >
                                No {submissionType} submissions found for the selected filters.
                            </td>
                        </tr>
                    )}
                    {visibleSubmissions.map((submission) => {
                        const employee = submission.employee ?? {};
                        const challenge = submission.challenge ?? {};
                        const badge =
                            STATUS_BADGE[submission.status] ??
                            STATUS_BADGE.submitted;
                        const approving =
                            challengeSubmissionApprovingId === submission.id;

                        return (
                            <tr key={submission.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">
                                        {employee.eoid ?? "-"}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">
                                        {employee.name ?? "Unknown employee"}
                                    </p>
                                    {submission.employees?.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                            Team proof · {submission.employees.length} members
                                        </p>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">
                                        {challenge.title ?? "Challenge unavailable"}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-sm text-gray-700">
                                        {employee.department_name ?? "-"}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-sm text-gray-700">
                                        {employee.account_name ?? "-"}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-yellow-500">
                                        {submission.employees?.length > 0 && (
                                            submission.team_points_awarded > 0
                                                ? `+${submission.team_points_awarded} to leader`
                                                : challenge.is_daily_challenge
                                                  ? `${challenge.points ?? 0} on completion`
                                                  : `+${challenge.points ?? 0} to leader`
                                        )}
                                        {!submission.employees?.length && `+${challenge.points ?? 0}`}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-400">
                                    {employee.email ?? "-"}
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
                                <td className="px-4 py-3">
                                        {submission.challenge?.survey_required ? (
                                            <Badge
                                                    label={
                                                        submission.employees?.length
                                                            ? submission.employees.every((member) => member.survey_completed)
                                                                ? "Team completed"
                                                                : "Team pending"
                                                            : submission.survey_completed
                                                              ? "Completed"
                                                              : "Pending"
                                                    }
                                                    variant={
                                                        submission.employees?.length
                                                            ? submission.employees.every((member) => member.survey_completed)
                                                                ? "success"
                                                                : "warning"
                                                            : submission.survey_completed
                                                              ? "success"
                                                              : "warning"
                                                    }
                                                />
                                        ) : null}
                                        {submission.challenge?.survey_required &&
                                            submission.employees?.length > 0 && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Leader: {submission.employee?.survey_completed ? "Completed" : "Pending"}
                                            </p>
                                        )}
                                        {!submission.challenge?.survey_required && (
                                            <span className="text-sm text-gray-400">—</span>
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
