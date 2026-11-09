import React, { useMemo, useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import Layout from "../../../layout";
import AssetInventory from "../layout";
import { setAlert } from "@/app/redux/app-slice";
import HeaderSection from "./sections/header-section";
import StatsSection from "./sections/stats-section";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import CreateAgreementSection from "./sections/create-agreement-section";
import { initialLiabilityForms } from "./sections/liability-form-mock-data";
import { findDevice, findEmployee } from "../item_request/sections/item-request-helpers";
import { initialItemRequests } from "../item_request/sections/item-request-mock-data";

const PER_PAGE = 10;

export default function Page() {
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [forms, setForms] = useState(initialLiabilityForms);

    const today = moment().format("YYYY-MM-DD");

    // Any filter change starts back at the first page.
    const withPageReset = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const hasFilters = Boolean(searchQuery.trim() || statusFilter || typeFilter);

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setTypeFilter("");
        setPage(1);
    };

    const handleCreateSubmit = (values) => {
        const nextNumber = forms.length + 1;
        const id = `LF-${String(nextNumber).padStart(3, "0")}`;

        // Resolve from the approved request when one was picked, else direct lookups.
        const sourceRequest = values.itemRequestId
            ? initialItemRequests.find((r) => r.id === values.itemRequestId)
            : null;
        const device = findDevice(values.assetTag);
        const employee = findEmployee(values.employeeId);

        const form = {
            id,
            employeeName: sourceRequest?.assigneeName ?? employee?.name ?? values.employeeId,
            employeeId: values.employeeId,
            employeeRole: employee ? `${employee.department} Staff` : "—",
            department: sourceRequest?.department ?? employee?.department ?? "—",
            deviceName: sourceRequest?.deviceName ?? device?.name ?? values.assetTag,
            assetTag: values.assetTag,
            type: "Public Agreement",
            status: "Pending Signature",
            signedDate: null,
            condition: values.condition,
            accessories: values.accessories,
            adminNotes: values.adminNotes || null,
            publicLink: `https://assets.empireonecx.com/liability/pub/${id}-${Math.random()
                .toString(36)
                .slice(2, 6)}`,
            createdAt: moment().format("YYYY-MM-DDTHH:mm:ss"),
        };

        setForms((prev) => [form, ...prev]);
        setPage(1);
        dispatch(
            setAlert({
                open: true,
                type: "success",
                title: "Agreement created",
                message: `${id} is ready — share the public link with ${form.employeeName}.`,
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

    const filteredData = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();

        return forms.filter((form) => {
            const matchesSearch =
                !term ||
                [form.employeeName, form.employeeId, form.deviceName, form.assetTag, form.id]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return (
                matchesSearch &&
                (!statusFilter || form.status === statusFilter) &&
                (!typeFilter || form.type === typeFilter)
            );
        });
    }, [forms, searchQuery, statusFilter, typeFilter]);

    const pageMeta = useMemo(
        () => ({
            current_page: page,
            last_page: Math.max(1, Math.ceil(filteredData.length / PER_PAGE)),
            per_page: PER_PAGE,
            total: filteredData.length,
        }),
        [filteredData.length, page],
    );

    const pageData = useMemo(() => {
        const start = (page - 1) * PER_PAGE;
        return filteredData.slice(start, start + PER_PAGE);
    }, [filteredData, page]);

    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-4">
                    <HeaderSection onCreateClick={() => setIsCreateOpen(true)} />

                    <StatsSection forms={forms} today={today} />

                    <SearchSection
                        searchQuery={searchQuery}
                        setSearchQuery={withPageReset(setSearchQuery)}
                        statusFilter={statusFilter}
                        setStatusFilter={withPageReset(setStatusFilter)}
                        typeFilter={typeFilter}
                        setTypeFilter={withPageReset(setTypeFilter)}
                        resultCount={filteredData.length}
                    />

                    <TableSection
                        data={pageData}
                        meta={pageMeta}
                        onPageChange={setPage}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onDownload={handleDownload}
                    />

                    <CreateAgreementSection
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />
                </div>
            </AssetInventory>
        </Layout>
    );
}