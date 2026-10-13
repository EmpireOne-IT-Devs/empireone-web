import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Eye, RefreshCw, Users, X } from "lucide-react";
import moment from "moment/moment";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import Skeleton from "@/app/_components/skeleton";
import { setAlert } from "@/app/redux/app-slice";
import {
    approve_engagement_reward_challenge_submission_thunk,
    decline_engagement_reward_challenge_submission_thunk,
    get_engagement_reward_challenge_submission_stats_thunk,
    get_engagement_reward_challenge_team_submissions_thunk,
} from "@/app/redux/engagement-thunk";
import ProofSection from "./proof-section";
import DeclineSection from "./decline-section";

const STATUS_BADGE = {
    submitted: { label: "Pending Review", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    declined: { label: "Rejected", variant: "danger" },
};

const PAGE_SIZE = 10;

export default function TeamTableSection({ filters }) {
    const dispatch = useDispatch();
    const {
        challengeTeamSubmissions,
        challengeTeamSubmissionsLoading,
        challengeTeamSubmissionsError,
        challengeSubmissionApprovingId,
    } = useSelector((state) => state.engagement);
    const [declineTarget, setDeclineTarget] = useState(null);
    const [proofTarget, setProofTarget] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const requestParams = useMemo(() => {
        const params = {};
        if (filters?.status) params.status = filters.status;
        if (filters?.challenge_id) params.challenge_id = filters.challenge_id;
        if (filters?.location_id) params.location_id = filters.location_id;
        if (filters?.search?.trim()) params.search = filters.search.trim();
        return params;
    }, [filters]);

    useEffect(() => {
        const debounceId = setTimeout(() => {
            dispatch(get_engagement_reward_challenge_team_submissions_thunk(requestParams));
        }, 250);
        return () => clearTimeout(debounceId);
    }, [dispatch, requestParams]);

    useEffect(() => {
        setCurrentPage(1);
    }, [requestParams]);

    const rows = useMemo(
        () => challengeTeamSubmissions.flatMap((submission) =>
            (submission.employees ?? []).map((employee) => ({
                ...submission,
                employee,
                rowId: `${submission.id}-${employee.id}`,
                teamSize: submission.employees.length,
            })),
        ).filter((submission) => {
            const search = filters?.search?.trim().toLowerCase();
            if (search && !submission.employee.name?.toLowerCase().includes(search)
                && !submission.employee.eoid?.toLowerCase().includes(search)) {
                return false;
            }
            return !filters?.location_id
                || String(submission.employee.location_id) === String(filters.location_id);
        }),
        [challengeTeamSubmissions, filters?.location_id, filters?.search],
    );
    const lastPage = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, lastPage));
    }, [lastPage]);

    const refresh = () => {
        dispatch(get_engagement_reward_challenge_submission_stats_thunk());
        dispatch(get_engagement_reward_challenge_team_submissions_thunk(requestParams));
    };

    const handleApprove = async (submission) => {
        const result = await dispatch(approve_engagement_reward_challenge_submission_thunk(submission.id));
        if (approve_engagement_reward_challenge_submission_thunk.rejected.match(result)) {
            dispatch(setAlert({
                type: "danger",
                title: "Unable to approve team submission",
                message: result.payload?.message || "Please try again.",
                open: true,
            }));
            return;
        }

        refresh();
        dispatch(setAlert({
            type: "success",
            title: "Team proof approved",
            message: `The shared proof was approved for ${submission.teamSize} direct report(s). Points follow each member's survey requirements.`,
            open: true,
        }));
    };

    const closeDecline = () => {
        setDeclineTarget(null);
        refresh();
    };

    if (challengeTeamSubmissionsLoading) {
        return (
            <div className="mt-6 overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
                <Skeleton variant="table" lines={5} />
            </div>
        );
    }

    if (challengeTeamSubmissionsError) {
        return (
            <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-6 text-center text-sm text-red-700 shadow-sm">
                Unable to load team submissions. Please refresh and try again.
            </p>
        );
    }

    return (
        <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Team Submissions</h2>
            {rows.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                    <Users className="mx-auto h-8 w-8 text-gray-400" aria-hidden="true" />
                    <h3 className="mt-3 font-semibold text-gray-900">No team submissions found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        No team challenge submissions match the selected filters.
                    </p>
                    <Button type="button" variant="secondary" outlined onClick={refresh} className="mt-4 gap-2">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Refresh submissions
                    </Button>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">EOD / Date</th>
                                    <th className="px-4 py-3">Full Name</th>
                                    <th className="px-4 py-3">Challenge Title</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Account</th>
                                    <th className="px-4 py-3">Points Submitted</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pageRows.map((submission) => {
                                    const badge = STATUS_BADGE[submission.status] ?? STATUS_BADGE.submitted;
                                    const approving = challengeSubmissionApprovingId === submission.id;

                                    return (
                                        <tr key={submission.rowId}>
                                            <td className="px-4 py-3 text-gray-700">
                                                {moment(submission.log_date).format("MMM D, YYYY")}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {submission.employee.name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-800">
                                                {submission.challenge?.title ?? "-"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {submission.employee.department_name ?? "-"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {submission.employee.account_name ?? "-"}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-yellow-600">
                                                +{submission.points_submitted ?? submission.challenge?.points ?? 0}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge label={badge.label} variant={badge.variant} />
                                                {submission.status === "declined" && submission.review_note && (
                                                    <p className="mt-1 text-xs text-gray-400">{submission.review_note}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="light"
                                                        outlined
                                                        size="sm"
                                                        onClick={() => setProofTarget(submission)}
                                                    >
                                                        <Eye className="mr-1 h-3.5 w-3.5" /> View
                                                    </Button>
                                                    {submission.status === "submitted" && (
                                                        <>
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
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {lastPage > 1 && (
                        <div className="mt-4">
                            <Pagination
                                data={{ current_page: currentPage, last_page: lastPage }}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
            <DeclineSection
                submission={declineTarget}
                onClose={closeDecline}
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
        </section>
    );
}
