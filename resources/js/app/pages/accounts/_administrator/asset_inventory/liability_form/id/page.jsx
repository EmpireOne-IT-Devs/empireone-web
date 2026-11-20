import React from "react";
import { Link } from "@inertiajs/react";
import { FiSearch } from "react-icons/fi";
import Layout from "../../../../layout";
import AssetInventory from "../../layout";
import Button from "@/app/_components/button";
import useLiabilityForm from "@/app/pages/acknowledgment/liability_form/sections/use-liability-form";
import HeaderSection from "./sections/header-section";
import DetailSection from "./sections/detail-section";

const LIST_PATH = "/accounts/administrator/asset_inventory/liability_form";

function NotFound({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiSearch className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {onRetry ? "Unable to load liability form" : "Liability form not found"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {message || "The agreement you are looking for does not exist or may have been removed."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {onRetry && (
                    <Button
                        type="button"
                        variant="secondary"
                        outlined
                        onClick={onRetry}
                    >
                        Retry
                    </Button>
                )}
                <Link
                    href={LIST_PATH}
                    className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                >
                    Back to liability forms
                </Link>
            </div>
        </div>
    );
}

export default function Page({ id }) {
    const { form, loading, error, reload, run, busy, actionError } = useLiabilityForm(id);

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    {loading ? (
                        <div
                            role="status"
                            aria-live="polite"
                            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
                        >
                            <span className="sr-only">Loading liability form</span>
                            <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
                            <div className="h-8 w-64 max-w-full animate-pulse rounded bg-gray-100" />
                            <div className="h-40 animate-pulse rounded-xl bg-gray-50" />
                        </div>
                    ) : error ? (
                        <NotFound message={error.message} onRetry={[403, 404].includes(error.status) ? undefined : reload} />
                    ) : form ? (
                        <>
                            <HeaderSection form={form} />
                            <DetailSection
                                form={form}
                                run={run}
                                busy={busy}
                                actionError={actionError}
                            />
                        </>
                    ) : (
                        <NotFound />
                    )}
                </div>
            </AssetInventory>
        </Layout>
    );
}
