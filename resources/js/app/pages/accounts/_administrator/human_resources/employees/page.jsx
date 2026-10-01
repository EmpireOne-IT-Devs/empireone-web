import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import store from "@/app/store/store";
import { get_employees_thunk, get_leader_thunk } from "@/app/redux/employee-relation-thunk";
import EmployeeRelationLayout from "../layout";
import SearchSection from "./_sections/search-section";
import PaginationSection from "./_sections/pagination-section";
import AddEmployeeSection from "./_sections/add-employee-section";
import CardAcknowledgementSection from "./_sections/card-acknowledgement-section";
import Loading from "@/app/_components/loading-page";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await Promise.all([
                    store.dispatch(get_employees_thunk()),
                    store.dispatch(get_leader_thunk())
                ]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, [window.location.search]);

    return (
        <Layout>
            <EmployeeRelationLayout>
                {loading ? (
                    <Loading/>
                ) : (
                    <>
                        {/* Changed to flex-col for mobile, and md:flex-row for desktop */}
                        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                            {/* Added w-full so the search spans the whole width on mobile */}
                            <div className="flex-1 w-full">
                                <SearchSection />
                            </div>
                            {/* Added w-full for mobile button width, scaling back to auto on md */}
                            <div className="flex-none w-full md:w-auto">
                                <AddEmployeeSection />
                            </div>
                        </div>

                        {/* Added mt-4 to ensure proper spacing between controls and the card list */}
                        <div className="mt-4 flex flex-col gap-3">
                            <CardAcknowledgementSection />
                            <PaginationSection />
                        </div>
                    </>
                )}
            </EmployeeRelationLayout>
        </Layout>
    );
}