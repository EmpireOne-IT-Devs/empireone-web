import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import CoeRequestsTableSection from "./sections/coe-requests-table-section";
import { get_coe_requests_thunk } from "@/app/redux/coe-request-thunk";

export default function page() {
    const dispatch = useDispatch();
    const [current_page, setCurrentPage] = useState(1);
    const { items, meta, loading, error } = useSelector(
        (store) => store.coe_requests,
    );

    useEffect(() => {
        dispatch(get_coe_requests_thunk({ page: current_page, per_page: 10 }));
    }, [dispatch, current_page]);

    return (
        <Layout>
            <EmployeeRelationLayout>
                <CoeRequestsTableSection
                    loading={loading}
                    data={items}
                    meta={meta}
                    error={error}
                    onPageChange={setCurrentPage}
                />
            </EmployeeRelationLayout>
        </Layout>
    );
}
