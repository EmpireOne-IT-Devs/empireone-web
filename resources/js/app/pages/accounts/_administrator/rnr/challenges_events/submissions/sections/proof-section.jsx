import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, X, Award, Clock, FileImage, User, Maximize2, ExternalLink } from "lucide-react";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
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
    const [previewMedia, setPreviewMedia] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [bonusPoints, setBonusPoints] = useState("0");
    const [bonusError, setBonusError] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!submission) {
            setBonusPoints("0");
            setBonusError("");
            return;
        }

        if (submission.id !== activeSubmission?.id) {
            setBonusPoints("0");
            setBonusError("");
            setIsPreviewOpen(false);
            setPreviewMedia(null);
        }
        setActiveSubmission(submission);
    }, [submission]);

    if (!activeSubmission) return null;

    const proofMedia = activeSubmission.submission_media?.length
        ? activeSubmission.submission_media
        : activeSubmission.submission_url
          ? [{ type: "image", url: activeSubmission.submission_url }]
          : [];
    const canReview = activeSubmission.status === "submitted";
    const approving = approvingId === activeSubmission.id;
    const basePoints = Number(activeSubmission.challenge?.points) || 0;
    const parsedBonusPoints = Number(bonusPoints);
    const validBonusPoints =
        bonusPoints.trim() !== "" &&
        Number.isInteger(parsedBonusPoints) &&
        parsedBonusPoints >= 0;

    const handleApprove = async () => {
        if (!validBonusPoints) {
            setBonusError("Enter a whole number of 0 or more.");
            return;
        }

        const approved = await onApprove(activeSubmission, parsedBonusPoints);
        if (approved) onClose();
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
                            {proofMedia.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {proofMedia.map((item, index) => (
                                        <div key={item.url} className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-neutral-900/5 ring-1 ring-inset ring-neutral-900/10 dark:bg-neutral-800">
                                            {item.type === "video" ? (
                                                <video src={item.url} controls className="h-full w-full bg-black object-contain" aria-label={`Submission video proof ${index + 1}`} />
                                            ) : (
                                                <>
                                                    <img
                                                        src={item.url}
                                                        alt={`Submission proof ${index + 1}`}
                                                        className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                                                        onClick={() => {
                                                            setPreviewMedia(item);
                                                            setIsPreviewOpen(true);
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-0 flex w-full cursor-pointer items-center justify-center bg-neutral-900/40 text-left opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                                        onClick={() => {
                                                            setPreviewMedia(item);
                                                            setIsPreviewOpen(true);
                                                        }}
                                                        aria-label={`Preview submission image ${index + 1}`}
                                                    >
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-sm backdrop-blur-sm">
                                                            <Maximize2 className="h-3.5 w-3.5" />
                                                            Click to preview
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-neutral-900/5 ring-1 ring-inset ring-neutral-900/10 dark:bg-neutral-800">
                                    <div className="flex flex-col items-center gap-2 p-6 text-center text-neutral-400">
                                        <FileImage className="h-8 w-8 stroke-1" />
                                        <p className="text-xs font-medium">No proof attached</p>
                                    </div>
                                </div>
                            )}
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

                                {activeSubmission.employees?.length > 0 && (
                                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                            Team members ({activeSubmission.employees.length})
                                        </p>
                                        <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-neutral-600">
                                            {activeSubmission.employees.map((employee) => (
                                                <li key={employee.id} className="flex justify-between gap-3">
                                                    <span className="truncate">{employee.name}</span>
                                                    <span className="shrink-0 text-neutral-400">
                                                        {employee.eoid || "No EOID"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

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
                                                {activeSubmission.employees?.length > 0
                                                    ? activeSubmission.challenge.is_daily_challenge &&
                                                      !activeSubmission.team_points_awarded
                                                        ? `+${activeSubmission.challenge.points} pts to leader on completion`
                                                        : `+${activeSubmission.team_points_awarded || activeSubmission.challenge.points} pts to leader only`
                                                    : `+${activeSubmission.challenge.points} pts`}
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

                    {canReview && (
                        <div className="space-y-4 rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                            <Input
                                label="Bonus Points"
                                name="bonus_points"
                                type="number"
                                min="0"
                                step="1"
                                value={bonusPoints}
                                onChange={(event) => {
                                    setBonusPoints(event.target.value);
                                    setBonusError("");
                                }}
                                error={bonusError}
                            />
                            <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                <div>
                                    <p className="text-xs text-gray-500">Challenge Points</p>
                                    <p className="font-semibold text-gray-800">{basePoints}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Bonus Points</p>
                                    <p className="font-semibold text-amber-700">
                                        {validBonusPoints ? parsedBonusPoints : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="font-bold text-gray-900">
                                        {validBonusPoints ? basePoints + parsedBonusPoints : "—"}
                                    </p>
                                </div>
                            </div>
                            {activeSubmission.employees?.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    Team challenge and bonus points are awarded to the leader only.
                                </p>
                            )}
                            {activeSubmission.challenge?.is_daily_challenge && (
                                <p className="text-xs text-gray-500">
                                    The challenge points are awarded when the required approved days are complete.
                                </p>
                            )}
                        </div>
                    )}

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
            {mounted && isPreviewOpen && previewMedia &&
               
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
                                src={previewMedia.url}
                                alt="Submission proof enlarged preview"
                                className="max-h-[85vh] w-auto max-w-[85vw] object-contain"
                            />
                        </div>
                    </div>
               
            }
        </>
    );
}