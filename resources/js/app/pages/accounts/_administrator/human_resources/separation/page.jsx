import React, { useEffect } from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import CardAcknowledgementSection from "./_sections/card-separation-section";
import store from "@/app/store/store";
import { get_attritions_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {


    useEffect(()=>{
        store.dispatch(get_attritions_thunk())
    },[])
    return (
        <Layout>
            <EmployeeRelationLayout>
                <CardAcknowledgementSection />
            </EmployeeRelationLayout>
        </Layout>
    );
}
