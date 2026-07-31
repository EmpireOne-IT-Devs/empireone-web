import React, { useEffect } from "react";
import Layout from "../../../layout";
import store from "@/app/store/store";
import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";
import EmployeeRelationLayout from "../layout";
import SearchSection from "./_sections/search-section";
import PaginationSection from "./_sections/pagination-section";
import AddEmployeeSection from "./_sections/add-employee-section";
import CardAcknowledgementSection from "./_sections/card-acknowledgement-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_employees_thunk());
    }, [window.location.search]);
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="flex w-full gap-3 mt-8">
                    <div className="flex-1">
                        <SearchSection />
                    </div>
                    <div className="flex-none">
                        <AddEmployeeSection />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    {/* <PaginationSection /> */}
                    {/* <TableSection /> */}
                    <CardAcknowledgementSection />
                    <PaginationSection />
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
