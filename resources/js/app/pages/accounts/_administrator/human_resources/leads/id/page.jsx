import React, { useEffect } from "react";
import Layout from "../../../../layout";
import store from "@/app/store/store";
import { get_leader_by_id_thunk } from "@/app/redux/employee-relation-thunk";
import TableSection from "./_sections/table-section";
import BackSection from "./_sections/back-section";
import HeaderSection from "./_sections/header-section";
import AddMemberSection from "./_sections/add-member-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(
            get_leader_by_id_thunk(window.location.pathname.split("/")[5]),
        );
    }, []);

    return (
        <Layout>
            <div className="flex flex-col gap-3 w-full">
                <BackSection />
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <HeaderSection />
                    </div>
                    <div>
                        <AddMemberSection />
                    </div>
                </div>
                <TableSection />
            </div>
        </Layout>
    );
}
