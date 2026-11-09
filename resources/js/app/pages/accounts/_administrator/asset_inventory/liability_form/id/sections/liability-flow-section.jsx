import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    FiFileText,
    FiUser,
    FiMail,
    FiBriefcase,
    FiHash,
    FiMonitor,
    FiTag,
    FiTool,
    FiCalendar,
    FiClock,
    FiLink,
    FiCopy,
    FiCheck,
    FiDownload,
    FiXCircle,
    FiShield,
} from "react-icons/fi";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Confirmation from "@/app/_components/confirmation";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
    FORM_STATUS_VARIANTS,
    formatDate,
    formatDateTime,
} from "../../sections/liability-form-helpers";

function Panel({ icon: Icon, title, subtitle, children, className = "" }) {
    return (
        <motion.section
            variants={fadeUp}
            className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
        >
            <div className="mb-4 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Icon size={18} />
                </span>
                <div>
                    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
            </div>
            {children}
        </motion.section>
    );
}

function Field({ icon: Icon, label, children, mono = false }) {
    return (
        <div className="flex items-start gap-3 py-3">
            {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />}
            <div className="min-w-0 flex-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {label}
                </dt>
                <dd
                    className={`mt-0.5 break-words text-sm font-medium text-gray-900 ${
                        mono ? "font-mono" : ""
                    }`}
                >
                    {children ?? "—"}
                </dd>
            </div>
        </div>
    );
}

export default function LiabilityFlowSection({ form, onVoid, onDownload }) {
    const [copied, setCopied] = useState(false);
    const [voidOpen, setVoidOpen] = useState(false);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(form.publicLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard unavailable — no-op
        }
    };

    const canVoid = form.status === "Pending Signature";

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
            {/* Left column — details */}
            <div className="space-y-4 lg:col-span-2">
                <Panel icon={FiFileText} title="Agreement Summary" subtitle="Condition and included accessories">
                    <dl className="divide-y divide-gray-100">
                        <Field icon={FiTool} label="Device condition">
                            {form.condition}
                        </Field>
                        <Field icon={FiTool} label="Included accessories">
                            {form.accessories?.length ? (
                                <span className="flex flex-wrap gap-1.5">
                                    {form.accessories.map((a) => (
                                        <Badge key={a} outlined label={a} variant="secondary" />
                                    ))}
                                </span>
                            ) : (
                                "None"
                            )}
                        </Field>
                        <Field icon={FiFileText} label="Admin notes (internal)">
                            <span className="font-normal leading-relaxed text-gray-700">
                                {form.adminNotes}
                            </span>
                        </Field>
                    </dl>
                </Panel>

                <Panel icon={FiUser} title="Employee" subtitle="Who is signing the agreement">
                    <dl className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6">
                        <Field icon={FiUser} label="Name">
                            {form.employeeName}
                        </Field>
                        <Field icon={FiHash} label="Employee ID" mono>
                            {form.employeeId}
                        </Field>
                        <Field icon={FiBriefcase} label="Department">
                            {form.department}
                        </Field>
                        <Field icon={FiMail} label="Role">
                            {form.employeeRole}
                        </Field>
                    </dl>
                </Panel>

                <Panel icon={FiMonitor} title="Device" subtitle="Assigned unit">
                    <dl className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6">
                        <Field icon={FiMonitor} label="Device">
                            {form.deviceName}
                        </Field>
                        <Field icon={FiTag} label="Asset tag" mono>
                            {form.assetTag}
                        </Field>
                    </dl>
                </Panel>
            </div>

            {/* Right column — signature & actions */}
            <div className="space-y-4 lg:col-span-1">
                <div className="lg:sticky lg:top-4 space-y-4">
                    <Panel icon={FiShield} title="Signature Status" subtitle="Agreement lifecycle">
                        <dl className="divide-y divide-gray-100">
                            <Field icon={FiCalendar} label="Created">
                                {formatDateTime(form.createdAt)}
                            </Field>
                            <Field icon={FiCheck} label="Signed date">
                                {form.signedDate ? formatDateTime(form.signedDate) : "Not signed yet"}
                            </Field>
                            <Field icon={FiClock} label="Link expiry">
                                {form.publicLink
                                    ? `${formatDate(form.createdAt)} + 7 days`
                                    : "—"}
                            </Field>
                        </dl>

                        {form.publicLink && form.status === "Pending Signature" && (
                            <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-3">
                                <p className="flex items-center gap-1.5 text-xs font-medium text-purple-700">
                                    <FiLink className="h-3.5 w-3.5" />
                                    Public signing link
                                </p>
                                <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-purple-900">
                                    {form.publicLink}
                                </p>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    outlined
                                    className="mt-3 w-full"
                                    onClick={copyLink}
                                    ariaLabel="Copy public signing link"
                                >
                                    {copied ? (
                                        <>
                                            <FiCheck className="mr-1.5 h-3.5 w-3.5" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <FiCopy className="mr-1.5 h-3.5 w-3.5" />
                                            Copy link
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </Panel>

                    <Panel icon={FiTool} title="Actions" subtitle="Manage this agreement">
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => onDownload?.(form)}
                                ariaLabel={`Download liability form ${form.id}`}
                            >
                                <FiDownload className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                            {canVoid && (
                                <Button
                                    variant="danger"
                                    outlined
                                    onClick={() => setVoidOpen(true)}
                                    ariaLabel={`Void liability form ${form.id}`}
                                >
                                    <FiXCircle className="mr-2 h-4 w-4" />
                                    Void Agreement
                                </Button>
                            )}
                        </div>
                    </Panel>
                </div>
            </div>

            <Confirmation
                isOpen={voidOpen}
                onClose={() => setVoidOpen(false)}
                title={`Void ${form.id}?`}
            >
                <div className="space-y-4 pt-1">
                    <p className="text-sm text-gray-600">
                        Voiding marks this agreement as invalid. The public link will stop
                        working and the employee will no longer be able to sign. This cannot
                        be undone.
                    </p>
                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <Button variant="light" outlined onClick={() => setVoidOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                onVoid?.();
                                setVoidOpen(false);
                            }}
                        >
                            Void agreement
                        </Button>
                    </div>
                </div>
            </Confirmation>
        </motion.div>
    );
}
