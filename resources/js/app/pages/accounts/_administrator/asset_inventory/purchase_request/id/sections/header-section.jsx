import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import Badge from "@/app/_components/badge";
import { fadeUp } from "@/lib/animations";
import {
    CATEGORY_VARIANTS,
    PRIORITY_VARIANTS,
    STATUS_VARIANTS,
    formatDate,
} from "../../sections/purchase-request-helpers";

const LIST_PATH = "/accounts/administrator/asset_inventory/purchase_request";

export default function HeaderSection({ request }) {
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
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    Back to purchase requests
                </Link>

                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                    Purchase Request{" "}
                    <span className="font-mono text-purple-700">{request.id}</span>
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                    Requested {formatDate(request.requestDate)} by {request.requesterName}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Badge
                    outlined
                    showDot
                    label={request.status}
                    variant={STATUS_VARIANTS[request.status] ?? "secondary"}
                    className="rounded-full"
                />
                <Badge
                    label={request.priority}
                    variant={PRIORITY_VARIANTS[request.priority] ?? "secondary"}
                />
                <Badge
                    outlined
                    label={request.category}
                    variant={CATEGORY_VARIANTS[request.category] ?? "secondary"}
                />
            </div>
        </motion.div>
    );
}
