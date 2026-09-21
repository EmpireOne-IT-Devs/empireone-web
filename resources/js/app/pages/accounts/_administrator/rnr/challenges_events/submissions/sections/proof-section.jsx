import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, X, Award, Clock, FileImage, User, Maximize2, ExternalLink } from "lucide-react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import moment from "moment/moment";

export default function ProofSection({
    submission,
    onClose,
    onApprove,
    onDecline,
    approvingId,
}) {
    const [activeSubmission, setActiveSubmission] = useState(submission);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (submission) {
            setActiveSubmission(submission);
        }
    }, [submission]);

    if (!activeSubmission) return null;

    const canReview = activeSubmission.status === "submitted";
    const approving = approvingId === activeSubmission.id;

    const handleApprove = async () => {
        await onApprove(activeSubmission);
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={Boolean(submission)}
                onClose={onClose}
                width="max-w-2xl"
                title={
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold leading-snug text-neutral-900">
                            Review Submission
                        </h2>
                        {activeSubmission.status && (
                            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium capitalize text-neutral-600">
                                {activeSubmission.status}
                            </span>
                        )}
                    </div>
                }
            >
                <div className="flex flex-col gap-6 pt-1">
                    {/* Main Content Split Layout */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        {/* Media Preview Column */}
                        <div className="md:col-span-7">
                            <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-900/5 ring-1 ring-inset ring-neutral-900/10 dark:bg-neutral-800">
                                {activeSubmission.submission_url ? (
                                    <>
                                        <img
                                            src={activeSubmission.submission_url}
                                            alt="Submission proof"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                            onClick={() => setIsPreviewOpen(true)}
                                        />
                                        {/* Hover Overlay with Preview Trigger */}
                                        <button
                                            type="button"
                                            className="absolute inset-0 flex items-center justify-center bg-neutral-900/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer w-full text-left"
                                            onClick={() => setIsPreviewOpen(true)}
                                        >
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-sm backdrop-blur-sm">
                                                <Maximize2 className="h-3.5 w-3.5" />
                                                Click to preview
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 p-6 text-center text-neutral-400">
                                        <FileImage className="h-8 w-8 stroke-1" />
                                        <p className="text-xs font-medium">No photo proof attached</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata Column */}
                        <div className="flex flex-col justify-between gap-5 md:col-span-5">
                            <div className="space-y-4">
                                {/* Employee Info Card */}
                                <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
                                        {activeSubmission.employee?.name ? (
                                            activeSubmission.employee.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()
                                        ) : (
                                            <User className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-neutral-900">
                                            {activeSubmission.employee?.name || "Unknown User"}
                                        </p>
                                        <p className="truncate text-xs text-neutral-500">
                                            {activeSubmission.employee?.email || "No email provided"}
                                        </p>
                                    </div>
                                </div>

                                {/* Challenge Details */}
                                <div className="space-y-1">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                        Challenge
                                    </span>
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-neutral-800">
                                            {activeSubmission.challenge?.title}
                                        </h3>
                                        {activeSubmission.challenge?.points && (
                                            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                <Award className="h-3 w-3 text-amber-600" />
                                                +{activeSubmission.challenge.points} pts
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                                    <span>
                                        {moment(activeSubmission.submitted_at).format(
                                            "MMM D, YYYY · h:mm A"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3.5">
                        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                            Description / Notes
                        </span>
                        <p className="whitespace-pre-line text-xs leading-relaxed text-neutral-600">
                            {activeSubmission.challenge_description || (
                                <span className="italic text-neutral-400">
                                    No description was provided for this submission.
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Action Footer */}
                    {canReview && (
                        <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
                            <Button
                                type="button"
                                variant="danger"
                                outlined
                                onClick={() => onDecline(activeSubmission)}
                                className="w-full sm:w-auto"
                            >
                                <X className="mr-1.5 h-4 w-4" />
                                Decline
                            </Button>
                            <Button
                                type="button"
                                variant="success"
                                loading={approving}
                                disabled={approving}
                                onClick={handleApprove}
                                className="w-full sm:w-auto"
                            >
                                <Check className="mr-1.5 h-4 w-4" />
                                Approve
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Portal Lightbox Preview Overlay */}
            {/* z-index must exceed Modal's z-[9999] since both portal directly to document.body */}
            {mounted && isPreviewOpen && activeSubmission.submission_url &&
               
                    <div 
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
                        onClick={() => setIsPreviewOpen(false)}
                    >
                        <div 
                            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-neutral-900 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Controls */}
                            <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                              
                                <button
                                    type="button"
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/60 text-white backdrop-blur-md transition-colors hover:bg-neutral-900/90"
                                    title="Close preview"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Image */}
                            <img
                                src={activeSubmission.submission_url}
                                alt="Submission proof enlarged preview"
                                className="max-h-[85vh] w-auto max-w-[85vw] object-contain"
                            />
                        </div>
                    </div>
               
            }
        </>
    );
}