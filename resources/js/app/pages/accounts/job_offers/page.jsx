import React, { useEffect, useState } from "react";
import HeaderSection from "./sections/header-section";
import TableSection from "./sections/table-section";
import Layout from "./../layout";
import store from "@/app/store/store";
import { get_job_offer_by_user_thunk } from "@/app/redux/applicant-thunk";
import SearchSection from "./sections/search-section";

export default function Page() {
    const [searchKey, setSearchKey] = useState(0);

    useEffect(() => {
        // Read URL parameters and pass them to the thunk
        const params = new URLSearchParams(window.location.search);
        const filterParams = {};
        
        if (params.get("search")) filterParams.search = params.get("search");
        if (params.get("status") && params.get("status") !== "all") {
            filterParams.status = params.get("status");
        }
        
        store.dispatch(get_job_offer_by_user_thunk(filterParams));

        // Listen for URL changes (for browser back/forward)
        const handleUrlChange = () => {
            setSearchKey(prev => prev + 1);
        };

        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, [searchKey]);

    const handleSearch = () => {
        setSearchKey(prev => prev + 1);
    };

    return (
        <Layout>
            <div className="flex gap-3 flex-col">
                <HeaderSection />
                <SearchSection onSearch={handleSearch} />
                <TableSection />
            </div>
        </Layout>
    );
}
