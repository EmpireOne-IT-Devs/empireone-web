import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Layout from "../../../../layout";
import AssetInventory from "../../layout";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import LiabilityFlowSection from "./sections/liability-flow-section";
import { findLiabilityForm } from "../sections/liability-form-mock-data";

const LIST_PATH = "/accounts/administrator/asset_inventory/liability_form";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FiSearch className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Liability form not found</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                The agreement you are looking for does not exist or may have been removed.
            </p>
            <Link
                href={LIST_PATH}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            >
                Back to liability forms
            </Link>
        </div>
    );
}

export default function Page() {
    const id = window.location.pathname.split("/")[5];
    const dispatch = useDispatch();
    const [form, setForm] = useState(() => findLiabilityForm(id));

    const handleVoid = () => {
        setForm((prev) => (prev ? { ...prev, status: "Voided" } : prev));
        dispatch(
            setAlert({
                open: true,
                type: "danger",
                title: "Agreement voided",
                message: `${form.id} has been voided. The public link is now inactive.`,
            }),
        );
    };

    const handleDownload = (row) => {
        dispatch(
            setAlert({
                open: true,
                type: "info",
                title: "Download started",
                message: `Preparing the PDF for ${row.id} (mock).`,
            }),
        );
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    {form ? (
                        <>
                            <HeaderSection form={form} />
                            <LiabilityFlowSection
                                form={form}
                                onVoid={handleVoid}
                                onDownload={handleDownload}
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
