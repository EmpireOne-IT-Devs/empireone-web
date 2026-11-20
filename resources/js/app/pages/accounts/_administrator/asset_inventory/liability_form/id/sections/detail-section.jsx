import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { Download } from "lucide-react";
import {
    FiBriefcase,
    FiCalendar,
    FiClock,
    FiFileText,
    FiHash,
    FiLink,
    FiMail,
    FiMonitor,
    FiShield,
    FiUser,
    FiXCircle,
} from "react-icons/fi";
import Button from "@/app/_components/button";
import Confirmation from "@/app/_components/confirmation";
import TextArea from "@/app/_components/textarea";
import { AssetAccountabilityDocument } from "@/app/pages/acknowledgment/liability_form/sections/asset-accountability-document";
import { LiabilityDownload } from "@/app/pages/acknowledgment/liability_form/sections/liability-download";
import { formatDateTime } from "../../sections/liability-form-helpers";
import { download_paper_scan_thunk } from "@/app/redux/asset-liability-form-thunk";

const ITEM_REQUEST_BASE = "/accounts/administrator/asset_inventory/item_request";

function Panel({ icon: Icon, title, subtitle, children }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
        </section>
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
                    {children || "—"}
                </dd>
            </div>
        </div>
    );
}

function firstError(value) {
    return Array.isArray(value) ? value[0] : value;
}

export default function DetailSection({ form, run, busy, actionError }) {
    const dispatch = useDispatch();
    const [voidOpen, setVoidOpen] = useState(false);
    const [resendOpen, setResendOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [failedAction, setFailedAction] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [downloading, setDownloading] = useState(false);
    const [scanError, setScanError] = useState("");
    const isPaper = form.source === "paper";

    const downloadScan = async () => {
        setDownloading(true);
        setScanError("");
        try {
            await dispatch(download_paper_scan_thunk(form.uuid)).unwrap();
        } catch (error) {
            setScanError(error.message);
        } finally {
            setDownloading(false);
        }
    };

    const reasonError =
        failedAction === "void" ? firstError(actionError?.errors?.reason) : null;
    const generalActionError = failedAction ? actionError?.message : null;

    const voidForm = async () => {
        const succeeded = await run("void", { reason: reason.trim() });
        if (succeeded) {
            setFailedAction(null);
            setVoidOpen(false);
            setReason("");
            setFeedback("The form was voided and its asset reservation was released.");
        } else {
            setFailedAction("void");
        }
    };

    const resendForm = async () => {
        const succeeded = await run("resend");
        if (succeeded) {
            setFailedAction(null);
            setResendOpen(false);
            setFeedback("The acknowledgment email was queued.");
        } else {
            setFailedAction("resend");
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Panel
                        icon={FiFileText}
                        title="Acknowledgment document"
                        subtitle="The agreement associated with this asset"
                    >
                        <AssetAccountabilityDocument form={form} />
                    </Panel>
                </div>

                <div className="space-y-4 lg:col-span-1">
                    <Panel
                        icon={FiUser}
                        title="Employee"
                        subtitle="Assigned recipient"
                    >
                        <dl className="divide-y divide-gray-100">
                            <Field icon={FiUser} label="Name">
                                {form.employeeName}
                            </Field>
                            <Field icon={FiHash} label="Employee number" mono>
                                {form.employeeNumber}
                            </Field>
                            <Field icon={FiCalendar} label="Issue date">
                                {form.issueDate}
                            </Field>
                        </dl>
                    </Panel>

                    <Panel
                        icon={FiMonitor}
                        title="Asset request"
                        subtitle="Request linked to this acknowledgment"
                    >
                        <dl className="divide-y divide-gray-100">
                            <Field icon={FiBriefcase} label="Asset tag" mono>
                                {form.assetTag}
                            </Field>
                            <Field icon={FiFileText} label="Request reference">
                                {form.itemRequestReference}
                            </Field>
                            <Field icon={FiCalendar} label="Created">
                                {formatDateTime(form.createdAt)}
                            </Field>
                        </dl>
                        {form.itemRequestUuid && (
                            <Link
                                href={`${ITEM_REQUEST_BASE}/${form.itemRequestUuid}`}
                                className="mt-3 inline-flex items-center gap-2 rounded-md text-sm font-medium text-purple-700 hover:text-purple-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                            >
                                <FiLink className="h-4 w-4" />
                                Open item request
                            </Link>
                        )}
                    </Panel>

                    <Panel
                        icon={FiShield}
                        title="Acknowledgment status"
                        subtitle="Form activity and available actions"
                    >
                        <dl className="divide-y divide-gray-100">
                            {isPaper ? (
                                <>
                                    <Field icon={FiFileText} label="Source">Paper Record</Field>
                                    <Field icon={FiCalendar} label="Original signed date">{form.paperSignedDate}</Field>
                                </>
                            ) : (
                                <>
                                    <Field icon={FiClock} label="Email last sent">{formatDateTime(form.emailSentAt)}</Field>
                                    <Field icon={FiCalendar} label="Acknowledged at">{formatDateTime(form.acknowledgedAt)}</Field>
                                </>
                            )}
                            {form.status === "Voided" && (
                                <>
                                    <Field icon={FiCalendar} label="Voided at">
                                        {formatDateTime(form.voidedAt)}
                                    </Field>
                                    <Field icon={FiXCircle} label="Void reason">
                                        {form.voidReason}
                                    </Field>
                                </>
                            )}
                        </dl>

                        <div className="mt-4 flex flex-col gap-2">
                            <LiabilityDownload form={form} />
                            {isPaper && (form.hasPaperScan ? (
                                <Button type="button" variant="secondary" outlined loading={downloading} disabled={downloading} onClick={downloadScan}>
                                    <Download size={16} aria-hidden="true" /> Download original scan
                                </Button>
                            ) : <p className="text-sm text-gray-600">No original scan attached.</p>)}
                            {scanError && <p role="alert" className="text-sm text-red-700">{scanError}</p>}
                            {feedback && <p role="status" className="text-sm text-green-700">{feedback}</p>}
                            {form.canResend && (
                                <Button
                                    variant="secondary"
                                    outlined
                                    onClick={() => {
                                        setFailedAction(null);
                                        setFeedback("");
                                        setResendOpen(true);
                                    }}
                                    ariaLabel={`Resend liability form ${form.id}`}
                                >
                                    <FiMail className="mr-2 h-4 w-4" />
                                    Resend acknowledgment
                                </Button>
                            )}
                            {form.canVoid && (
                                <Button
                                    variant="danger"
                                    outlined
                                    onClick={() => {
                                        setFailedAction(null);
                                        setFeedback("");
                                        setVoidOpen(true);
                                    }}
                                    ariaLabel={`Void liability form ${form.id}`}
                                >
                                    <FiXCircle className="mr-2 h-4 w-4" />
                                    Void form
                                </Button>
                            )}
                        </div>
                    </Panel>
                </div>
            </div>

            <Confirmation
                isOpen={resendOpen}
                onClose={() => {
                    if (!busy) setResendOpen(false);
                }}
                title={`Resend ${form.id}?`}
            >
                <div className="space-y-4 pt-1">
                    <p className="text-sm text-gray-600">
                        Email the acknowledgment link again to {form.employeeName}?
                    </p>
                    {failedAction === "resend" && generalActionError && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {generalActionError}
                        </p>
                    )}
                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <Button
                            variant="light"
                            outlined
                            disabled={Boolean(busy)}
                            onClick={() => setResendOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            loading={busy === "resend"}
                            disabled={Boolean(busy)}
                            onClick={resendForm}
                        >
                            Resend acknowledgment
                        </Button>
                    </div>
                </div>
            </Confirmation>

            <Confirmation
                isOpen={voidOpen}
                onClose={() => {
                    if (!busy) setVoidOpen(false);
                }}
                title={`Void ${form.id}?`}
            >
                <div className="space-y-4 pt-1">
                    <p className="text-sm text-gray-600">
                        Voiding prevents acknowledgment, cancels the Item Request, and releases the asset reservation. This action cannot be undone.
                    </p>
                    <TextArea
                        name="void_reason"
                        label="Reason for voiding"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        rows={3}
                        maxLength={2000}
                        required
                        disabled={Boolean(busy)}
                        error={reasonError}
                    />
                    {failedAction === "void" && generalActionError && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {generalActionError}
                        </p>
                    )}
                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <Button
                            variant="light"
                            outlined
                            disabled={Boolean(busy)}
                            onClick={() => setVoidOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            loading={busy === "void"}
                            disabled={Boolean(busy) || !reason.trim()}
                            onClick={voidForm}
                        >
                            Void form
                        </Button>
                    </div>
                </div>
            </Confirmation>
        </>
    );
}
