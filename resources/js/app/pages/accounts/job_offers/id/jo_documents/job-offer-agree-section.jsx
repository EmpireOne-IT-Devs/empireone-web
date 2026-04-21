import Button from "@/app/_components/button";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// 1. Add hasScrolledToBottom as a prop here
export default function JobOfferAgreeSection({ data = {}, hasScrolledToBottom = false }) {
    const { loading } = useSelector((store) => store.app);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    
    // Safely check window for Next.js
    const user_id = typeof window !== "undefined" ? window.location.pathname.split("/")[3] : null;

    async function submit_contract_agreement(params) {
        // Your submission logic here
    }

    return (
        <div className="fixed bottom-10 right-10 z-50">
            <Button
                loading={isLoading}
                onClick={submit_contract_agreement}
                // 2. Disable if loading OR if they haven't scrolled to the bottom
                disabled={loading || !hasScrolledToBottom}
            >
                I Accept Job Offer
            </Button>
        </div>
    );
}