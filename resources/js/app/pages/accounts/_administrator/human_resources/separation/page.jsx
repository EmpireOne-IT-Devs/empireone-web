import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import store from "@/app/store/store";
import { get_attritions_thunk } from "@/app/redux/employee-relation-thunk";
import Loading from "@/app/_components/loading-page";
import ExportSeparationSection from "./_sections/export-separation-section";
import TableSection from "./_sections/table-section";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await store.dispatch(get_attritions_thunk());
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, []);

    return (
        <Layout>
            <EmployeeRelationLayout>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="flex flex-col gap-3">
                        <ExportSeparationSection />
                        <TableSection />
                    </div>
                )}
            </EmployeeRelationLayout>
        </Layout>
    );
}