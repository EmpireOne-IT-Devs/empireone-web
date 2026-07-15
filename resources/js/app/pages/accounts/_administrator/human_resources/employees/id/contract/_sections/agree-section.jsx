import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";
import { agree_contract_service } from "@/app/services/account-contract-service";
import { add_documents_service } from "@/app/services/documents-services";
import store from "@/app/store/store";
import { router } from "@inertiajs/react";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AgreeSection({ data, user }) {
    const { loading, document } = useSelector((store) => store.app);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const user_id = window.location.pathname.split("/")[3];

    async function submit_contract_agreement(params) {
        try {
            setIsLoading(true);
            const fileResponse = await fetch(document.url);
            const fileBlob = await fileResponse.blob();

            const formData = new FormData();
            formData?.append(
                "documents[0][name]", "My Contract.pdf",
            );

            formData?.append("documents[0][status]", "Approved");
            formData?.append(
                "documents[0][file]",
                fileBlob
            );
            await agree_contract_service(data);
            await add_documents_service(formData);
            await store.dispatch(get_user_by_id_thunk(user_id));
            dispatch(
                setAlert({
                    type: "success",
                    title: "Contract is successfully signed!",
                    message: "Thank you for signing",
                    open: true,
                }),
            );
            router.visit(`/accounts/${user?.role == 1 ? "administrator" : user?.role == 3 ? "applicant" : "employee"}/my_documents`)
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
