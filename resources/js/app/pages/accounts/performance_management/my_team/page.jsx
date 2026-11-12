import React, { useEffect, useState } from "react";
import PerformanceManagementLayout from "./../layout";
import store from "@/app/store/store";
import { get_my_team_thunk } from "@/app/redux/department-thunk";
import TableSection from "./_sections/table-section";
import SearchSection from "./_sections/search-section";
import PaginationSection from "./_sections/pagination-section";
export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data(params) {
            try {
                setLoading(true);
                await store.dispatch(get_my_team_thunk());
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, [window.location.search]);

    return (
        <PerformanceManagementLayout>
            <SearchSection />
            <div className="flex flex-col gap-3">
               
                <TableSection isloading={loading} />
                <PaginationSection />
            </div>
        </PerformanceManagementLayout>
    );
}
