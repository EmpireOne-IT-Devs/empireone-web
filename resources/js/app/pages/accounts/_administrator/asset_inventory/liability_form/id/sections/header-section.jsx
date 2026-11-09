import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import Badge from "@/app/_components/badge";
import { fadeUp } from "@/lib/animations";
import {
    FORM_STATUS_VARIANTS,
    FORM_TYPE_VARIANTS,
    formatDateTime,
} from "../../sections/liability-form-helpers";

const LIST_PATH = "/accounts/administrator/asset_inventory/liability_form";

export default function HeaderSection({ form }) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
            <div className="min-w-0">
                <Link
                    href={LIST_PATH}
                    className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-gray-500 transition-colors hover:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    Back to liability forms
                </Link>

                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                    Liability Form{" "}
                    <span className="font-mono text-purple-700">{form.id}</span>
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                    Created {formatDateTime(form.createdAt)} for {form.employeeName}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Badge
                    outlined
                    showDot
                    label={form.status}
                    variant={FORM_STATUS_VARIANTS[form.status] ?? "secondary"}
                    className="rounded-full"
                />
                <Badge
                    outlined
                    label={form.type}
                    variant={FORM_TYPE_VARIANTS[form.type] ?? "secondary"}
                />
            </div>
        </motion.div>
    );
}
