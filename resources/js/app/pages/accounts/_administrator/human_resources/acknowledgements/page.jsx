import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import store from "@/app/store/store";
import { get_acknowledgement_thunk } from "@/app/redux/employee-relation-thunk";
import EmployeeRelationLayout from "../layout";
import SidebarTabsSection from "./_sections/sidebar-tabs-section";
import LoadingState from "@/app/_components/loading-state";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await store.dispatch(get_acknowledgement_thunk());
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
                    <LoadingState />
                ) : (
                    <SidebarTabsSection />
                )}
            </EmployeeRelationLayout>
        </Layout>
    );
}