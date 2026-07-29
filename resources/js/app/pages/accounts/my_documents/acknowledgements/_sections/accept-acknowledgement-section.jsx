import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Button from '@/app/_components/button'
import Modal from '@/app/_components/modal';
import store from '@/app/store/store';
import { get_acknowledgement_thunk } from '@/app/redux/employee-relation-thunk';
import { add_acknowledgement_employee_service } from '@/app/services/employee-relation-service';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '@/app/redux/app-slice';
import Checkbox from '@/app/_components/checkbox';

export default function AcceptAcknowledgementSection({ data }) {
    const [open, setOpen] = useState(false);
    const { data: user_data } = useSelector((store) => store.app);
    const [isLoading, setIsLoading] = useState(false);

    // CHANGED: Replaced useSelect from @react-three/drei with standard useState
    const [isAccept, setIsAccept] = useState(false);

    const dispatch = useDispatch();

    async function accept_acknowledgement() {
        try {
            setIsLoading(true);

            await add_acknowledgement_employee_service(data);
            await store.dispatch(get_acknowledgement_thunk());

            dispatch(
                setAlert({
                    type: "success",
                    title: "Acknowledgement Accepted!",
                    message: "Your acknowledgement has been recorded successfully.",
                    open: true,
                }),
            );

            setOpen(false);

        } catch (error) {
            console.error("Failed to accept acknowledgement:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Error",
                    message: "Failed to record acknowledgement. Please try again.",
                    open: true,
                }),
            );
        } finally {
            setIsLoading(false);
        }
    }

    function onClose() {
        if (!isLoading) {
            setOpen(false);
        }
    }

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <Button
                variant='secondary'
                onClick={() => setOpen(true)}
            >
                <CheckCircle2 size={20} />
                <span>Accept & Acknowledge</span>
            </Button>

            <Modal
                title="Confirm Acknowledgement"
                isOpen={open}
                onClose={onClose}
                width='max-w-2xl'
            >
                <div className='flex py-5 flex-col gap-3'>
                    <div className='flex px-3'>
                        <Checkbox
                            label={`I, ${user_data?.user?.personal_information?.first_name} ${user_data?.user?.personal_information?.last_name}, hereby acknowledge that I have read, understood, and agree to comply with the ${data?.label} of EmpireOne BPO Solutions Inc. I understand that any violation of these rules may result in disciplinary action.
                        `}
                            onChange={() => setIsAccept(!isAccept)}
                        />
                    </div>
                    <Button
                        onClick={accept_acknowledgement}
                        className='w-full flex items-center justify-center gap-2 mt-5'
                        variant='secondary'
                        disabled={!isAccept}
                        loading={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Processing...</span>
                            </>
                        ) : (
                            "I Accept Acknowledgment"
                        )}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}