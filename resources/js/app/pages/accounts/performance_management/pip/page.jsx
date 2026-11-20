import React, { useEffect, useState } from "react";
import PerformanceManagementLayout from "./../layout";
import CreatePIPSection from "./_sections/create-pip-section";
import TableSection from "./_sections/table-section";
import store from "@/app/store/store";
import { get_pip_thunk } from "@/app/redux/employee-relation-thunk";
import SearchSection from "./_sections/search-section";
import PaginationSection from "./_sections/pagination-section";

export default function Page() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function get_data(params) {
            await store.dispatch(get_pip_thunk());
            setLoading(false);
        }
        get_data();
    }, [window.location.search]);
    return (
        <PerformanceManagementLayout>
            <div className="flex flex-col gap-3">
                <div className="flex w-full">
                    <div className="flex-1">
                        <SearchSection />
                    </div>
                    <CreatePIPSection />
                </div>
                <TableSection isloading={loading} />
                <PaginationSection />
            </div>
        </PerformanceManagementLayout>
    );
}
