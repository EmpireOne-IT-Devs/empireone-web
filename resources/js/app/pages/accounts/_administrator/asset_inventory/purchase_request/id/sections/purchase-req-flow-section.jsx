import React from "react";
import { motion } from "framer-motion";
import {
    FiPackage,
    FiCreditCard,
    FiBriefcase,
    FiUser,
    FiMail,
    FiCalendar,
    FiTruck,
    FiHash,
    FiFileText,
} from "react-icons/fi";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { formatDate, formatMoney } from "../../sections/purchase-request-helpers";
import StepperSection from "./stepper-section";

function Panel({ icon: Icon, title, subtitle, children, className = "" }) {
    return (
        <motion.section
            variants={fadeUp}
            className={`rounded-2xl border bg-white p-5 ${className}`}
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

export default function PurchaseReqFlowSection({
    request,
    currency = "PHP",
    onApprove,
    onReject,
}) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
            {/* Left column — request details */}
            <div className="space-y-4 lg:col-span-2">
                <Panel icon={FiPackage} title="Item Details" subtitle="What is being requested">
                    <dl className="divide-y divide-gray-100">
                        <Field icon={FiPackage} label="Item">
                            {request.itemName}
                        </Field>
                        <Field icon={FiFileText} label="Description / Justification">
                            <span className="font-normal leading-relaxed text-gray-700">
                                {request.description}
                            </span>
                        </Field>
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
                            <Field icon={FiHash} label="Category">
                                {request.category}
                            </Field>
                            <Field icon={FiTruck} label="Preferred supplier">
                                {request.supplier}
                            </Field>
                        </div>
                    </dl>
                </Panel>

                <Panel icon={FiCreditCard} title="Financial Summary" subtitle={`Amounts shown in ${currency}`}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Quantity
                            </p>
                            <p className="mt-1 text-xl font-bold text-gray-900">{request.quantity}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Unit price
                            </p>
                            <p className="mt-1 text-xl font-bold text-gray-900">
                                {formatMoney(request.unitPrice, currency)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-purple-600 p-4 text-white shadow-md shadow-purple-200">
                            <p className="text-xs font-medium uppercase tracking-wide text-purple-100">
                                Total amount
                            </p>
                            <p className="mt-1 text-xl font-bold">
                                {formatMoney(request.totalAmount, currency)}
                            </p>
                        </div>
                    </div>
                    <dl className="mt-3 divide-y divide-gray-100">
                        <Field icon={FiHash} label="Budget / department code" mono>
                            {request.departmentCode}
                        </Field>
                    </dl>
                </Panel>

                <Panel icon={FiBriefcase} title="Requester & Schedule" subtitle="Who raised it and when it is needed">
                    <dl className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6">
                        <Field icon={FiUser} label="Requester">
                            {request.requesterName}
                        </Field>
                        <Field icon={FiMail} label="Email">
                            {request.requesterEmail}
                        </Field>
                        <Field icon={FiBriefcase} label="Department">
                            {request.department}
                        </Field>
                        <Field icon={FiCalendar} label="Request date">
                            {formatDate(request.requestDate)}
                        </Field>
                        <Field icon={FiCalendar} label="Target purchase date">
                            {formatDate(request.purchaseDate)}
                        </Field>
                    </dl>
                </Panel>
            </div>

            {/* Right column — approval timeline */}
            <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                    <StepperSection
                        approvals={request.approvals}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                </div>
            </div>
        </motion.div>
    );
}
