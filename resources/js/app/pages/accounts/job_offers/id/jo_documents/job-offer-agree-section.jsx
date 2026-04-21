import Button from "@/app/_components/button";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function JobOfferAgreeSection({ data = {} }) {
    const { loading } = useSelector((store) => store.app);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const user_id = window.location.pathname.split("/")[3];

    async function submit_contract_agreement(params) {}
    return (
        <>
            <div className="fixed bottom-10 right-10">
                <Button
                    loading={isLoading}
                    onClick={submit_contract_agreement}
                    disabled={loading}
                >
                    I Accept Job Offer
                </Button>
            </div>
        </>
    );
}
