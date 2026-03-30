import React, { useEffect } from "react";
import EmploymentContractSection from "./_sections/employment-contract-section";
import store from "@/app/store/store";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";
import { useSelector } from "react-redux";
import VerifySection from "../_sections/verify-section";
import Button from "@/app/_components/button";
import AgreeSection from "./_sections/agree-section";

export default function Page() {
    const { user } = useSelector((store) => store.app);
    const user_id = window.location.pathname.split("/")[3];
    useEffect(() => {
        store.dispatch(get_user_by_id_thunk(user_id));
    }, []);
    return (
        <div>
            {!user?.account_employee?.signature && <VerifySection />}
            {user?.account_employee?.signature && (
                <>
                    <EmploymentContractSection />
                    <AgreeSection />
                </>
            )}
        </div>
    );
}
