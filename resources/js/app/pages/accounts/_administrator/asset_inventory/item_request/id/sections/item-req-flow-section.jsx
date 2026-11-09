import React from "react";
import moment from "moment";
import { motion } from "framer-motion";
import {
    FiPackage,
    FiFileText,
    FiHash,
    FiCalendar,
    FiClock,
    FiUser,
    FiMail,
    FiBriefcase,
    FiTag,
    FiRepeat,
} from "react-icons/fi";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { formatDate } from "../../sections/item-request-helpers";
import StepperSection from "./stepper-section";

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

function periodLabel(request) {
    if (!request.fromDate) return null;
    if (!request.untilDate) return "Open-ended";
    const days = moment(request.untilDate).diff(moment(request.fromDate), "days");
    if (Number.isNaN(days)) return null;
    return `${days} day${days === 1 ? "" : "s"}`;
}

export default function ItemReqFlowSection({ request, onApprove, onReject, onIssue }) {
    const period = periodLabel(request);

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
            {/* Left column — request details */}
            <div className="space-y-4 lg:col-span-2">
                <Panel icon={FiPackage} title="Device Details" subtitle="What is being assigned">
                    <dl className="divide-y divide-gray-100">
                        <Field icon={FiPackage} label="Device">
                            {request.deviceName}
                        </Field>
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
                            <Field icon={FiTag} label="Asset tag" mono>
                                {request.assetTag}
                            </Field>
                            <Field icon={FiRepeat} label="Request type">
                                {request.requestType}
                            </Field>
                        </div>
                    </dl>
                </Panel>

                <Panel icon={FiUser} title="Assignment" subtitle="Who the device is for">
                    <dl className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6">
                        <Field icon={FiUser} label="Assign to">
                            {request.assigneeName}
                        </Field>
                        <Field icon={FiHash} label="Employee ID" mono>
                            {request.assigneeId}
                        </Field>
                        <Field icon={FiMail} label="Email">
                            {request.requesterEmail}
                        </Field>
                        <Field icon={FiBriefcase} label="Department">
                            {request.department}
                        </Field>
                    </dl>
                </Panel>

                <Panel icon={FiCalendar} title="Schedule" subtitle="Assignment period">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Request date
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-900">
                                {formatDate(request.requestDate)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                From → Until
                            </p>
                            <p className="mt-1 text-sm font-bold text-gray-900">
                                {request.fromDate ? formatDate(request.fromDate) : "—"}
                                {request.untilDate ? ` → ${formatDate(request.untilDate)}` : ""}
                            </p>
                        </div>
                        <div className="rounded-xl bg-purple-600 p-4 text-white shadow-md shadow-purple-200">
                            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-purple-100">
                                <FiClock className="h-3.5 w-3.5" />
                                Duration
                            </p>
                            <p className="mt-1 text-sm font-bold">
                                {request.status === "Issued"
                                    ? "Item issued"
                                    : request.status === "Rejected"
                                      ? "Request rejected"
                                      : (period ?? "—")}
                            </p>
                        </div>
                    </div>
                </Panel>

                <Panel icon={FiFileText} title="Justification & Purpose" subtitle="Why the device is needed">
                    <dl className="divide-y divide-gray-100">
                        <Field icon={FiFileText} label="Justification">
                            <span className="font-normal leading-relaxed text-gray-700">
                                {request.justification}
                            </span>
                        </Field>
                        <Field icon={FiFileText} label="Purpose">
                            <span className="font-normal leading-relaxed text-gray-700">
                                {request.purpose}
                            </span>
                        </Field>
                    </dl>
                </Panel>

                {request.status === "Issued" && request.issuedAssetTag && (
                    <Panel
                        icon={FiTag}
                        title="Issued Asset"
                        subtitle="Unit handed over to the assignee"
                        className="border-green-200 bg-green-50/50"
                    >
                        <dl className="divide-y divide-green-100">
                            <Field icon={FiTag} label="Asset tag" mono>
                                {request.issuedAssetTag}
                            </Field>
                            <Field icon={FiPackage} label="Device issued">
                                {request.deviceName}
                            </Field>
                        </dl>
                    </Panel>
                )}
            </div>

            {/* Right column — approval timeline */}
            <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                    <StepperSection
                        approvals={request.approvals}
                        status={request.status}
                        onApprove={onApprove}
                        onReject={onReject}
                        onIssue={onIssue}
                    />
                </div>
            </div>
        </motion.div>
    );
}