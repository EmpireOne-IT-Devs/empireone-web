import React, { useEffect } from "react";
import SignaturePad from "./_sections/signature-pad";
import store from "@/app/store/store";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
export default function Page() {
    useEffect(() => {
        store.dispatch(get_app_data_thunk());
    }, []);
    return (
        <>
            <SignaturePad />
        </>
    );
}
