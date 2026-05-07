import React, { useEffect } from "react";
import Layout from "../../../../../layout";
import CreatePEFSection from "./_sections/create-pef-section";
import store from "@/app/store/store";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";

export default function page() {
    const user_id = window.location.pathname.split("/")[6];
    useEffect(() => {
        store.dispatch(get_user_by_id_thunk(user_id));
    }, []);
    return (
        <Layout>
            <CreatePEFSection />
        </Layout>
    );
}
