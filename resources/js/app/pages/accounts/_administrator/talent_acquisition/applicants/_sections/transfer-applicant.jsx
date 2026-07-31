import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Briefcase, CheckCircle2 } from "lucide-react";

import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { transfer_job_offer_service } from "@/app/services/job-offer-service";
import store from "@/app/store/store";
import { get_applicants_thunk, get_job_application_by_id_thunk, get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import { setAlert } from "@/app/redux/app-slice";
import { TbTransfer } from "react-icons/tb";

export default function TransferApplicant({ data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        setValue, // Extracted setValue to manually update the form
        reset,    // Extracted reset to clear form on close
        formState: { errors, isSubmitting },
    } = useForm();

    const { job_postings } = useSelector(
        (state) => state.job_postings,
    );
    console.log('waaaaaaaasssssssss', job_postings)
    // Automatically set the first available job posting as the default value when the modal opens
    useEffect(() => {
        if (open && job_postings.length > 0) {
            setValue("job_posting_id", data?.job_posting_id);
        } else if (!open) {
            reset(); // Clear the form when closed
        }
    }, [open]); // Only run when 'open' state changes

    const onSubmit = async (form_data) => {
        try {
            await transfer_job_offer_service({
                ...data,
                new_job_posting_id: form_data.job_posting_id,
            });
            await store.dispatch(get_applicants_thunk());
            await store.dispatch(get_job_posting_thunk())
            dispatch(
                setAlert({
                    type: "success",
                    title: "Applicant Successfully Transferred!",
                    message: "The applicant has been transferred and is ready for review.",
                    open: true,
                }),
            );
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button
                variant="secondary"
                outlined
                className="w-full"
                onClick={() => setOpen(true)}
            >
                <TbTransfer />
                TRANSFER
            </Button>

            <Modal
                width="sm:max-w-2xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Transfer Applicant"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col pt-2"
                >
                    <div className="w-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Select a Position to Transfer To
                        </label>

                        <Controller
                            name="job_posting_id"
                            control={control}
                            rules={{
                                required: "Please select a position to transfer this applicant to.",
                            }}
                            render={({ field }) => (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1">
                                    {job_postings?.length === 0 ? (
                                        <div className="col-span-full py-8 text-center text-sm text-slate-500 italic border-2 border-dashed rounded-xl border-slate-200">
                                            No active positions available for transfer.
                                        </div>
                                    ) : (
                                        job_postings?.map((res) => {
                                            const isSelected = field.value === res.id;
                                            return (
                                                <div
                                                    key={res.id}
                                                    onClick={() => field.onChange(res.id)}
                                                    className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${isSelected
                                                        ? "border-purple-600 bg-purple-50 ring-1 ring-purple-600 shadow-md"
                                                        : "border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50 hover:shadow-sm"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                                                            <Briefcase className="w-5 h-5" />
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                                                        )}
                                                    </div>
                                                    <span className={`font-semibold text-sm ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                                                        Location:   {res?.job_requisition?.location?.name}
                                                    </span>
                                                    <span className={`font-semibold text-sm ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                                                        Account: {res?.job_requisition?.account?.name}
                                                    </span>
                                                    <span className={`font-semibold text-sm ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                                                        {res.job_requisition?.title}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        />

                        {/* Error Message */}
                        {errors?.job_posting_id && (
                            <p className="mt-3 text-sm text-red-500 font-medium">
                                {errors.job_posting_id.message}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 pt-5">
                        <Button
                            variant="secondary"
                            outlined
                            disabled={isSubmitting}
                            onClick={() => setOpen(false)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            loading={isSubmitting}
                            variant="primary"
                            type="submit"
                        >
                            Confirm Transfer
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}