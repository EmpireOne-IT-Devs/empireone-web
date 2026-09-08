import React, { useState } from 'react';
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { useDispatch, useSelector } from 'react-redux';
import { approve_job_offer_service } from '@/app/services/applicants-service';
import { setAlert } from '@/app/redux/app-slice';
import store from '@/app/store/store';
import { get_job_offer_by_id_thunk } from '@/app/redux/applicant-thunk';

export default function ApprovedJOSection({ props_data }) {
    const { loading } = useSelector((store) => store.app);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const handleSendJobOffer = async () => {
        try {
            setIsLoading(true);
            await approve_job_offer_service(props_data)
            store.dispatch(
                get_job_offer_by_id_thunk(window.location.pathname.split("/")[4]),
            );
            dispatch(
                setAlert({
                    type: "success",
                    title: "Job Offer has been sent!",
                    message:
                        "The job offer has been sent and is ready for review.",
                    open: true,
                }),
            );
            setOpen(false);
        } catch (error) {
            console.error("Failed to send job offer:", error);
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
                    SEND JOB OFFER
                </Button>
            </div>

            <Modal
                width="max-w-md"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Confirm Job Offer"
            >
                <div className="flex flex-col gap-6 mt-2">
                    <p className="text-sm text-gray-700">
                        Are you sure you would like to send this job offer?
                    </p>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                            variant='danger'
                        >
                            Cancel
                        </Button>
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            onClick={handleSendJobOffer}
                        >
                            YES, SEND
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}