import React, { useEffect } from "react";
import Layout from "../../../../../layout";
import EmployeeLayout from "../layout";
import TableSection from "./_sections/table-section";
// import store from "@/app/store/store";
// import { get_performance_evaluation_by_user_id_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {
    // useEffect(() => {
    //     store.dispatch(
    //         get_performance_evaluation_by_user_id_thunk(
    //             window.location.pathname.split("/")[4],
    //         ),
    //     );
    // }, []);
    return (
        <Layout>
            <EmployeeLayout>
                <div className="flex flex-col gap-3 w-full">
                    <TableSection />
                </div>
            </EmployeeLayout>
        </Layout>
    );
}
