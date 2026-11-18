import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiShield, FiUser } from "react-icons/fi";
import Stepper from "@/app/_components/stepper";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Confirmation from "@/app/_components/confirmation";
import TextArea from "@/app/_components/textarea";
import { fadeUp } from "@/lib/animations";
import {
    APPROVAL_STATUS_VARIANTS,
    formatDate,
    getApprovalSummary,
    getCurrentStepIndex,
} from "../../sections/purchase-request-helpers";

function StepMeta({ step }) {
    return (
        <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
                <Badge
                    outlined
                    showDot
                    label={step.status}
                    variant={APPROVAL_STATUS_VARIANTS[step.status] ?? "secondary"}
                    className="rounded-full"
                />
                {step.actedAt && (
                    <span className="text-[11px] text-gray-400">{formatDate(step.actedAt)}</span>
                )}
            </div>
            {step.approverName && (
                <p className="flex items-center gap-1.5 text-xs text-gray-600">
                    <FiUser className="h-3.5 w-3.5 text-gray-400" />
                    {step.approverName}
                </p>
            )}
            {step.remarks && (
                <p className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs italic leading-relaxed text-gray-600">
                    “{step.remarks}”
                </p>
            )}
        </div>
    );
}

export default function StepperSection({ approvals = [], canAct = false, onDecision }) {
    const [pendingAction, setPendingAction] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState("");
    const [actionError, setActionError] = useState("");
    const [saving, setSaving] = useState(false);

    const currentIndex = getCurrentStepIndex(approvals);
    const summary = getApprovalSummary(approvals);
    const currentStep = currentIndex >= 0 ? approvals[currentIndex] : null;
    const canDecide = canAct && currentStep?.status === "pending";

    const closeDialog = () => {
        setPendingAction(null);
        setRemarks("");
        setRemarksError("");
        setActionError("");
    };

    const confirmAction = async () => {
        if (!pendingAction || saving) return;
        if (!canDecide || currentStep.key !== pendingAction.step) {
            setActionError("The current approval step has changed. Close this dialog and review the request again.");
            return;
        }
        if (pendingAction.decision === "reject" && !remarks.trim()) {
            setRemarksError("A reason is required when rejecting a request.");
            return;
        }

        setSaving(true);
        setActionError("");
        try {
            await onDecision(pendingAction.decision, pendingAction.step, remarks.trim());
            closeDialog();
        } catch (error) {
            setRemarksError(error?.errors?.remarks?.[0] ?? "");
            setActionError(error?.message ?? "Unable to save the decision.");
        } finally {
            setSaving(false);
        }
    };

    const steps = approvals.map((step, index) => ({
        key: step.key,
        label: step.label,
        description: step.description,
        status: step.status === "pending" && index === currentIndex ? "current" : step.status,
        meta: <StepMeta step={step} />,
        children:
            canDecide && index === currentIndex ? (
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => setPendingAction({ decision: "approve", step: step.key, label: step.label })}
                        ariaLabel={`Approve as ${step.label}`}
                    >
                        <FiCheckCircle className="mr-1.5 h-4 w-4" />
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        outlined
                        onClick={() => setPendingAction({ decision: "reject", step: step.key, label: step.label })}
                        ariaLabel={`Reject as ${step.label}`}
                    >
                        <FiXCircle className="mr-1.5 h-4 w-4" />
                        Reject
                    </Button>
                </div>
            ) : null,
    }));

    const progressPct = summary.total
        ? Math.round((summary.approvedCount / summary.total) * 100)
        : 0;

    return (
        <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            aria-labelledby="approval-timeline-heading"
            className="rounded-2xl bg-white p-5"
        >
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <h2
                        id="approval-timeline-heading"
                        className="flex items-center gap-2 text-base font-semibold text-gray-900"
                    >
                        <FiShield className="h-5 w-5 text-purple-600" />
                        Approval Timeline
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                        {summary.isRejected
                            ? `Rejected at ${summary.rejectedBy}`
                            : summary.isComplete
                              ? "All approvers have signed off"
                              : `${summary.approvedCount} of ${summary.total} approvals completed`}
                    </p>
                </div>
                <span className="shrink-0 font-mono text-xs font-semibold text-gray-500">
                    {summary.approvedCount}/{summary.total}
                </span>
            </div>

            {/* Progress rail */}
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPct}
                aria-label="Approval progress"
                className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    className={summary.isRejected ? "h-full bg-red-500" : "h-full bg-green-500"}
                />
            </div>

            <Stepper steps={steps} currentStep={currentIndex} orientation="vertical" />

            <Confirmation
                isOpen={Boolean(pendingAction)}
                onClose={saving ? () => {} : closeDialog}
                title={
                    pendingAction?.decision === "approve"
                        ? `Approve as ${pendingAction.label}?`
                        : `Reject as ${pendingAction?.label}?`
                }
            >
                <div className="space-y-4 pt-1">
                    <p className="text-sm text-gray-600">
                        {pendingAction?.decision === "approve"
                            ? "This will record your approval for the current step."
                            : "Rejecting stops the approval chain. The requester will need to submit a new request."}
                    </p>

                    <TextArea
                        name="approval-remarks"
                        label={pendingAction?.decision === "reject" ? "Reason for rejection" : "Remarks (optional)"}
                        rows={3}
                        maxLength={1000}
                        disabled={saving}
                        value={remarks}
                        required={pendingAction?.decision === "reject"}
                        error={remarksError}
                        onChange={(e) => {
                            setRemarks(e.target.value);
                            if (remarksError) setRemarksError("");
                        }}
                    />

                    {actionError && <p role="alert" className="text-sm text-red-600">{actionError}</p>}
                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <Button variant="light" outlined onClick={closeDialog} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            variant={pendingAction?.decision === "approve" ? "success" : "danger"}
                            onClick={confirmAction}
                            loading={saving}
                        >
                            {pendingAction?.decision === "approve" ? "Confirm approval" : "Confirm rejection"}
                        </Button>
                    </div>
                </div>
            </Confirmation>
        </motion.section>
    );
}