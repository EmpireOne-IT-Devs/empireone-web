import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
    FiCheck as Check,
    FiInbox as Inbox,
    FiUserX as UserX,
    FiX as X,
} from "react-icons/fi";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Checkbox from "@/app/_components/checkbox";
import Confirmation from "@/app/_components/confirmation";
import Pagination from "@/app/_components/pagination";
import Table from "@/app/_components/table";
import { setAlert } from "@/app/redux/app-slice";
import { clear_team_request_action_error } from "@/app/redux/team-request-slice";
import {
    approve_team_request_thunk,
    batch_approve_team_requests_thunk,
    decline_team_request_thunk,
    get_team_requests_thunk,
} from "@/app/redux/team-request-thunk";
import { fadeUp } from "@/lib/animations";
import SearchAgentSection from "./search-agent-section";
import ReviewRequestModal from "./review-request-modal";

const DEFAULT_FILTERS = {
    type: "overtime",
    status: "pending",
    search: "",
    dateFrom: "",
    dateTo: "",
};

const STATUS_VARIANTS = {
    pending: "warning",
    endorsed: "purple",
    approved: "success",
    granted: "success",
    declined: "danger",
};

const sr = (text) => <span className="sr-only">{text}</span>;

export default function AgentsTableSection() {
    const dispatch = useDispatch();
    const { items, meta, isLoading, isNotLeader, error, isActing, actionError, actionErrors } =
        useSelector((state) => state.team_requests);

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState([]);
    const [review, setReview] = useState(null);
    const [confirmBatch, setConfirmBatch] = useState(false);
    const [filterKey, setFilterKey] = useState(0);

    const load = useCallback(() => {
        setSelected([]);
        dispatch(
            get_team_requests_thunk({
                type: filters.type,
                status: filters.status || undefined,
                search: filters.search || undefined,
                date_from: filters.dateFrom || undefined,
                date_to: filters.dateTo || undefined,
                page,
            }),
        );
    }, [dispatch, filters, page]);

    useEffect(() => {
        load();
    }, [load]);

    const applyFilters = (next) => {
        setFilters(next);
        setPage(1);
    };

    const resetFilters = () => {
        applyFilters({ ...DEFAULT_FILTERS, type: filters.type, status: "" });
        setFilterKey((k) => k + 1);
    };

    const pendingIds = items.filter((item) => item.can_review).map((item) => item.id);
    const allSelected = pendingIds.length > 0 && pendingIds.every((id) => selected.includes(id));

    const toggleRow = (id) =>
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );

    const closeReview = () => {
        setReview(null);
        dispatch(clear_team_request_action_error());
    };

    const handleConfirmReview = async (note) => {
        const { item, mode } = review;
        const action =
            mode === "decline"
                ? decline_team_request_thunk({ type: item.type, id: item.id, note })
                : approve_team_request_thunk({ type: item.type, id: item.id });

        const result = await dispatch(action);

        if (result.meta.requestStatus === "fulfilled") {
            dispatch(
                setAlert({
                    type: "success",
                    title: mode === "decline" ? "Request declined." : "Request approved.",
                }),
            );
            closeReview();
            load();
        } else if (mode === "approve") {
            dispatch(setAlert({ type: "error", title: result.payload?.message }));
            closeReview();
            load();
        }
    };

    const handleBatchApprove = async () => {
        const result = await dispatch(
            batch_approve_team_requests_thunk({ type: filters.type, ids: selected }),
        );
        setConfirmBatch(false);

        if (result.meta.requestStatus === "fulfilled") {
            const { approved, failed } = result.payload;
            dispatch(
                setAlert({
                    type: failed ? "error" : "success",
                    title: failed
                        ? `${approved} approved, ${failed} could not be approved.`
                        : `${approved} request(s) approved.`,
                }),
            );
        }
        load();
    };

    const columns = [
        {
            header: "Employee",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="shrink-0">
                        <Checkbox
                            name={`team_request_${row.id}`}
                            label={sr(`Select request from ${row.employee?.name}`)}
                            checked={row.can_review && selected.includes(row.id)}
                            disabled={!row.can_review}
                            onChange={() => toggleRow(row.id)}
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {row.employee?.name ?? "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {[row.employee?.employee_id, row.employee?.department]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Date",
            render: (row) => dayjs(row.date).format("MM/DD/YYYY"),
        },
        {
            header: "Request Details",
            render: (row) => (
                <ul className="space-y-0.5 text-xs">
                    {row.details.map((detail) => (
                        <li key={detail.label}>
                            <span className="text-gray-500">{detail.label}:</span>{" "}
                            {detail.value}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            header: "Reason",
            render: (row) => (
                <span className="block max-w-xs break-words text-xs text-gray-600">
                    {row.reason || "-"}
                </span>
            ),
        },
        {
            header: "Status",
            render: (row) => (
                <Badge
                    label={row.status_label}
                    variant={STATUS_VARIANTS[row.status] ?? "secondary"}
                />
            ),
        },
        {
            header: "Leader Note",
            render: (row) => (
                <span className="block max-w-xs break-words text-xs text-gray-600">
                    {row.supervisor_note || "-"}
                </span>
            ),
        },
        {
            header: "Actions",
            render: (row) =>
                row.can_review ? (
                    <div className="flex gap-2">
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                                size="xs"
                                variant="success"
                                className="gap-1"
                                onClick={() => setReview({ item: row, mode: "approve" })}
                            >
                                <Check size={14} aria-hidden="true" />
                                Approve
                            </Button>
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                                size="xs"
                                variant="danger"
                                outlined
                                className="gap-1"
                                onClick={() => setReview({ item: row, mode: "decline" })}
                            >
                                <X size={14} aria-hidden="true" />
                                Decline
                            </Button>
                        </motion.div>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                ),
        },
    ];

    const renderEmpty = () => {
        const Icon = isNotLeader ? UserX : Inbox;
        return (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-white px-4 py-16 text-center">
                <div className="mb-3 rounded-full bg-purple-50 p-3 text-purple-600">
                    <Icon size={28} aria-hidden="true" />
                </div>
                <h3 className="text-base font-medium text-gray-900">
                    {isNotLeader
                        ? "You are not assigned as a leader"
                        : "No requests from your team"}
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                    {isNotLeader
                        ? "Only leaders can review the requests filed by their agents."
                        : "Nothing matches the current filters. Try a different request type, status or date range."}
                </p>
                {!isNotLeader && (
                    <Button variant="secondary" className="mt-4" onClick={resetFilters}>
                        Clear filters
                    </Button>
                )}
            </div>
        );
    };

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">Team Requests</h2>
                <p className="text-sm text-gray-500">
                    Review overtime, schedule corrections and leave filed by the agents assigned to you.
                </p>
            </div>

            <SearchAgentSection
                key={filterKey}
                filters={filters}
                onApply={applyFilters}
                selectedCount={selected.length}
                onBatchApprove={() => setConfirmBatch(true)}
                isBusy={isActing && confirmBatch}
            />

            {error ? (
                <div
                    role="alert"
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                    <Button size="sm" variant="danger" outlined onClick={load}>
                        Retry
                    </Button>
                </div>
            ) : !isLoading && items.length === 0 ? (
                renderEmpty()
            ) : (
                <div>
                    {pendingIds.length > 0 && (
                        <div className="mb-2">
                            <Checkbox
                                name="select_all_team_requests"
                                label="Select all pending on this page"
                                checked={allSelected}
                                onChange={() =>
                                    setSelected(allSelected ? [] : pendingIds)
                                }
                            />
                        </div>
                    )}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <Table columns={columns} data={items} isloading={isLoading} skeletonRows={8} />
                    </div>
                </div>
            )}

            {meta?.last_page > 1 && (
                <div className="mt-4">
                    <Pagination data={meta} onPageChange={setPage} />
                </div>
            )}

            <ReviewRequestModal
                target={review}
                onClose={closeReview}
                onConfirm={handleConfirmReview}
                isSubmitting={isActing}
                errors={actionErrors}
                serverError={actionError}
            />

            <Confirmation
                isOpen={confirmBatch}
                onClose={() => setConfirmBatch(false)}
                title="Approve selected requests"
            >
                <p className="text-sm text-gray-600">
                    Approve {selected.length} selected request(s)? This cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="light" outlined onClick={() => setConfirmBatch(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" loading={isActing} onClick={handleBatchApprove}>
                        Approve
                    </Button>
                </div>
            </Confirmation>
        </motion.div>
    );
}
