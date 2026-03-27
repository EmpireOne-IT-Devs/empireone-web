import React, { useEffect } from "react";
import Layout from "../layout";
import HeaderSection from "./section/header-section";
import SearchSection from "./section/search-section";
import TableSection from "./section/table-section";
import store from "@/app/store/store";
import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_employees_thunk());
    }, []);
    return (
        <Layout>
            <HeaderSection />
            <SearchSection />
            <TableSection />
        </Layout>
    );
}
