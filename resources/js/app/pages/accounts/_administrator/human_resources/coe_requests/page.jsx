import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import CoeRequestsTableSection from "./sections/coe-requests-table-section";
import { get_coe_requests_thunk } from "@/app/redux/coe-request-thunk";

export default function page() {
    const dispatch = useDispatch();
    const [current_page, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debounced_search, setDebouncedSearch] = useState("");
    const [purpose, setPurpose] = useState("");
    const { items, meta, loading, error } = useSelector(
        (store) => store.coe_requests,
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        dispatch(
            get_coe_requests_thunk({
                page: current_page,
                per_page: 10,
                search: debounced_search || undefined,
                purpose: purpose || undefined,
            }),
        );
    }, [dispatch, current_page, debounced_search, purpose]);

    const handlePurposeChange = (value) => {
        setPurpose(value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setDebouncedSearch("");
        setPurpose("");
        setCurrentPage(1);
    };

    return (
        <Layout>
            <EmployeeRelationLayout>
                <CoeRequestsTableSection
                    loading={loading}
                    data={items}
                    meta={meta}
                    error={error}
                    onPageChange={setCurrentPage}
                    search={search}
                    setSearch={setSearch}
                    purpose={purpose}
                    setPurpose={handlePurposeChange}
                    hasFilters={Boolean(debounced_search || purpose)}
                    onClearFilters={clearFilters}
                />
            </EmployeeRelationLayout>
        </Layout>
    );
}
