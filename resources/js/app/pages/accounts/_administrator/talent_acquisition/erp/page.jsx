import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import store from "@/app/store/store";
import ERPTableSection from "./_sections/erp-table-section";
import { get_erps_thunk } from "@/app/redux/job-posting-thunk";
import ExportERPSection from "./_sections/export-erp-section";
import PaginationSection from "./_sections/pagination-section";
import SearchSection from "./_sections/search-section";
import Loading from "@/app/_components/loading-page";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await store.dispatch(get_erps_thunk());
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, [window.location.search]);

    return (
        <Layout>
            <JobPostingLayout>
                {loading ? (
                    <Loading/>
                ) : (
                    <>
                        <div className="w-full flex items-end justify-end">
                            <ExportERPSection />
                        </div>
                        <div className="flex flex-col gap-3">
                            <SearchSection />
                            <ERPTableSection />
                            <PaginationSection />
                        </div>
                    </>
                )}
            </JobPostingLayout>
        </Layout>
    );
}