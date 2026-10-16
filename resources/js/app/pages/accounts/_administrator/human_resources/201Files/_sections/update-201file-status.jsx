import { get_201_files_thunk } from '@/app/redux/employee-relation-thunk';
import { update_201_files_service } from '@/app/services/human-resources-service';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/app/_components/modal';
import store from '@/app/store/store';
import Button from '@/app/_components/button';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setAlert } from '@/app/redux/app-slice';

export default function Update201fileStatus({ props_data }) {
    const [open, setOpen] = useState(false);
    const [loadingId, setLoadingId] = useState(false);
    const [actionType, setActionType] = useState(null);
    const dispatch = useDispatch()
    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            reason: ''
        }
    });

    async function handleUpdateStatus(targetStatus, declineReason = '') {
        try {
            setLoadingId(true);
            setActionType(targetStatus);

            await update_201_files_service({
                id: props_data.id,
                status: targetStatus,
                ...(targetStatus === 'Declined' && { reason: declineReason }),
            });

            // Dispatch Redux thunk to refresh store data
            await store.dispatch(get_201_files_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Change Status Successfully!",
                    message: "The change Form has been created and is ready for review.",
                    open: true,
                })
            );

            // Reset modal and form state if declining
            if (targetStatus === 'Declined') {
                handleCloseModal();
            }
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Change Status Unsuccessfully!",
                    message: "The change Form has been created and is ready for review.",
                    open: true,
                })
            );
            console.error(error);
        }
    }

    const onDeclineSubmit = (data) => {
        handleUpdateStatus('Declined', data.reason);
    };

    const handleCloseModal = () => {
        setOpen(false);
        reset(); // Resets form values and validation state
    };

    const isApproving = loadingId && actionType === 'Approved';
    const isDeclining = loadingId && actionType === 'Declined';

    return (
        <div>
            <div className="flex gap-2">
                <button
                    type="button"
                    disabled={loadingId}
                    onClick={() => handleUpdateStatus("Approved")}
                    className="px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                    {isApproving ? "Approving..." : "Approve"}
                </button>

                <button
                    type="button"
                    disabled={loadingId}
                    onClick={() => setOpen(true)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                    {isDeclining ? "Declining..." : "Decline"}
                </button>
            </div>

            {/* Decline Reason Modal */}
            <Modal
                title="Decline Document"
                isOpen={open}
                onClose={handleCloseModal}
                width='max-w-2xl'
            >
                <div className="w-full rounded-lg bg-white p-6 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-900">Decline Document</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Please provide a reason or note for declining this document.
                    </p>

                    <form onSubmit={handleSubmit(onDeclineSubmit)} className="mt-4">
                        <textarea
                            {...register('reason', {
                                required: 'Decline reason is required',
                                validate: (value) => value.trim() !== '' || 'Decline reason cannot be empty'
                            })}
                            placeholder="Enter decline reason..."
                            rows={4}
                            className={`w-full rounded-md border p-2.5 text-sm focus:outline-none focus:ring-1 ${errors.reason
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-rose-500 focus:ring-rose-500'
                                }`}
                        />
                        {errors.reason && (
                            <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>
                        )}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={loadingId}
                                onClick={handleCloseModal}
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <Button type="submit" disabled={loadingId}>
                                {isDeclining ? "Submitting..." : "Confirm Decline"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}