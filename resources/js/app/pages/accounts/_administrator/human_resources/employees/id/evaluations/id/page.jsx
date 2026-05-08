import React, { useEffect } from "react";
import EvaluationFormSection from "./_sections/evaluation-form-section";
import store from "@/app/store/store";
import { get_performance_evaluation_by_id_thunk } from "@/app/redux/employee-relation-thunk";
import ResultFormSection from "./_sections/result-form-section";

export default function Page() {

    useEffect(() => {
        store.dispatch(get_performance_evaluation_by_id_thunk(window.location.pathname.split('/')[6]))
    }, [])
    return (
        <>
            <ResultFormSection />
        </>
    );
}
