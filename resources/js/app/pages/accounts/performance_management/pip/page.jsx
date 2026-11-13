import React, { useEffect } from "react";
import PerformanceManagementLayout from "./../layout";
import CreatePIPSection from "./_sections/create-pip-section";
import TableSection from "./_sections/table-section";
import store from "@/app/store/store";
import { get_pip_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_pip_thunk());
    }, [window.location.search]);
    return (
        <PerformanceManagementLayout>
            <div className="flex flex-col gap-3">
                <CreatePIPSection />
                <TableSection />
            </div>
        </PerformanceManagementLayout>
    );
}
