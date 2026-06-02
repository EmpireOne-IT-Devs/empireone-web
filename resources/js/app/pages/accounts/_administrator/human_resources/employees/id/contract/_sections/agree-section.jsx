import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";
import { agree_contract_service } from "@/app/services/account-contract-service";
import store from "@/app/store/store";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AgreeSection({ data }) {
    const { loading } = useSelector((store) => store.app);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const user_id = window.location.pathname.split("/")[3];

    async function submit_contract_agreement(params) {
        try {
            setIsLoading(true);
            await agree_contract_service(data);
            await store.dispatch(get_user_by_id_thunk(user_id));
            dispatch(
                setAlert({
                    type: "success",
                    title: "Contract is successfully signed!",
                    message: "Thank you for signing",
                    open: true,
                }),
            );
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }
    return (
        <>
            <div className="fixed bottom-10 right-10">
                <Button
                    loading={isLoading}
                    onClick={submit_contract_agreement}
                    disabled={loading}
                >
                    I Agree
                </Button>
            </div>
        </>
    );
}
