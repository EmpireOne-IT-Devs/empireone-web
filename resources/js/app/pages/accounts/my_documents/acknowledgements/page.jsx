
import { useEffect } from "react";
import Layout from "../../layout";
import MyDocumentsLayout from "../layout";
import SidebarTabsSection from "./_sections/sidebar-tabs-section";
import store from "@/app/store/store";
import { get_acknowledgement_thunk } from "@/app/redux/employee-relation-thunk";
export default function Page() {

    useEffect(()=>{
        store.dispatch(get_acknowledgement_thunk())
    },)
    return (
        <Layout>
            <MyDocumentsLayout>
                <SidebarTabsSection />
            </MyDocumentsLayout>
        </Layout>
    );
}
