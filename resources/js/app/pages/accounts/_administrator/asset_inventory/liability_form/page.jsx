import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import Button from "@/app/_components/button";
import { list_liability_forms_thunk } from "@/app/redux/asset-liability-form-thunk";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import RecordPaperFormSection from "./sections/record-paper-form-section";

export default function Page() {
    const dispatch = useDispatch();
    const { items, meta, error, loading } = useSelector(
        (state) => state.asset_liability_forms.list,
    );
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [source, setSource] = useState("");
    const [page, setPage] = useState(1);
    const [reloadToken, setReloadToken] = useState(0);
    const [recordPaperOpen, setRecordPaperOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setQuery(search.trim()), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const request = dispatch(
            list_liability_forms_thunk({ page, search: query || undefined, status: status || undefined, source: source || undefined }),
        );
        return () => request.abort();
    }, [dispatch, page, query, reloadToken, status, source]);

    const hasFilters = Boolean(search.trim() || status || source);
    const clearFilters = () => {
        setSearch("");
        setQuery("");
        setStatus("");
        setSource("");
        setPage(1);
    };

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    <HeaderSection onRecordPaper={() => setRecordPaperOpen(true)} />
                    <SearchSection
                        searchQuery={search}
                        setSearchQuery={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        statusFilter={status}
                        setStatusFilter={(value) => {
                            setStatus(value);
                            setPage(1);
                        }}
                        sourceFilter={source}
                        setSourceFilter={(value) => {
                            setSource(value);
                            setPage(1);
                        }}
                        resultCount={meta?.total ?? 0}
                        loading={loading}
                    />

                    {error && !loading && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-medium text-red-900">
                                    Couldn’t load liability forms
                                </p>
                                <p className="mt-1 text-sm text-red-700">
                                    {error.message || "Please check your connection and try again."}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                outlined
                                onClick={() => setReloadToken((value) => value + 1)}
                            >
                                Retry
                            </Button>
                        </div>
                    )}
                    {recordPaperOpen && (
                        <RecordPaperFormSection onClose={() => setRecordPaperOpen(false)} onRecorded={(form) => {
                            setRecordPaperOpen(false);
                            clearFilters();
                            setReloadToken((value) => value + 1);
                            dispatch(setAlert({ open: true, type: "success", title: "Paper form recorded", message: `${form.id} was saved.` }));
                        }} />
                    )}

                    {(!error || loading) && (
                        <TableSection
                            data={items}
                            loading={loading}
                            meta={meta}
                            onPageChange={setPage}
                            hasFilters={hasFilters}
                            onClearFilters={clearFilters}
                        />
                    )}
                </div>
            </AssetInventory>
        </Layout>
    );
}
