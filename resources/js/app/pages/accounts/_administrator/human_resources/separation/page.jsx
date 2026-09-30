import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import CardAcknowledgementSection from "./_sections/card-separation-section";
import store from "@/app/store/store";
import { get_attritions_thunk } from "@/app/redux/employee-relation-thunk";
import LoadingState from "@/app/_components/loading-state";

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
                    <LoadingState />
                ) : (
                    <CardAcknowledgementSection />
                )}
            </EmployeeRelationLayout>
        </Layout>
    );
}