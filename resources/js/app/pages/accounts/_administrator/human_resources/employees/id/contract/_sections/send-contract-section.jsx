import React, { useState } from 'react';
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { useDispatch, useSelector } from 'react-redux';
import { approve_job_offer_service, send_contract_service } from '@/app/services/applicants-service';
import { setAlert } from '@/app/redux/app-slice';
import store from '@/app/store/store';
import { get_user_by_id_thunk } from '@/app/redux/app-thunk';

export default function SendContractSection({ props_data }) {
    const { loading } = useSelector((store) => store.app);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const handleSendContract = async () => {
        try {
            setIsLoading(true);
            await send_contract_service(props_data)
            await store.dispatch(get_user_by_id_thunk(window.location.pathname.split("/")[3]));
            dispatch(
                setAlert({
                    type: "success",
                    title: "Contract has been sent!",
                    message:
                        "The contract has been sent and is ready for review.",
                    open: true,
                }),
            );
            setOpen(false);
        } catch (error) {
            console.error("Failed to send contract:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-10 right-10 z-50">
                <Button
                    loading={isLoading}
                    disabled={loading || isLoading}
                    onClick={() => setOpen(true)}
                >
                    VIEW ACTION
                </Button>
            </div>

            <Modal
                width="max-w-md"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Confirm Contract"
            >
                <div className="flex flex-col gap-6 mt-2">
                    <p className="text-sm text-gray-700">
                        Are you sure you would like to send this contract?
                    </p>

                    <div className="flex justify-end gap-3">

                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            onClick={handleSendContract}
                        >
                            YES, SEND
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}