import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form"; // 1. Imported useForm
import { transfer_job_offer_service } from "@/app/services/job-offer-service";
import store from "@/app/store/store";
import { get_job_application_by_id_thunk } from "@/app/redux/job-posting-thunk";
import { setAlert } from "@/app/redux/app-slice";

export default function TransferApplicant({ data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    // 2. Initialized useForm
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const { job_postings, loading } = useSelector(
        (state) => state.job_postings,
    );

    // 3. Safely access window to prevent Next.js hydration errors
    const currentId =
        typeof window !== "undefined"
            ? window.location.pathname.split("/")[5]
            : null;

    const active_job_postings =
        job_postings?.filter((res) => res.id != currentId) || [];
    console.log("active_job_postings", active_job_postings);
    // 4. Added a submit handler
    const onSubmit = async (form_data) => {
        try {
            await transfer_job_offer_service({
                ...data,
                new_job_posting_id: form_data.job_posting_id,
            });
            await store.dispatch(get_job_application_by_id_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Applicant Successfully Transferred!",
                    message:
                        "The applicant has been transferred and is ready for review.",
                    open: true,
                }),
            );
            setOpen(false);
        } catch (error) {}
    };

    return (
        <>
            <Button
                size="xs"
                variant="secondary"
                outlined
                disabled={data.final_status == "Transferred"}
                onClick={() => setOpen(true)}
            >
                {data.final_status == "Transferred"
                    ? "Transferred"
                    : "Transfer Applicant"}
            </Button>

            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Transfer Applicant"
            >
                {/* 5. Wrapped in a form with handleSubmit */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 min-h-96 p-3 flex flex-col items-end justify-between"
                >
                    <Controller
                        name="job_posting_id"
                        control={control}
                        rules={{
                            required: "Job posting is required",
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Select Existing Position"
                                options={active_job_postings.map((res) => ({
                                    label: res.job_requisition.title, // Removed literal string quotes
                                    value: res.id, // Changed to use the ID for the value
                                }))}
                                error={errors.job_posting_id?.message}
                            />
                        )}
                    />
                    {/* Added Action Buttons inside the Modal to submit the form */}
                    <div className="flex justify-end gap-3 mt-6">
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
