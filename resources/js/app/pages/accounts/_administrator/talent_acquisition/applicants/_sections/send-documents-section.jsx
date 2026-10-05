import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { InfoIcon, MailIcon, SendIcon, AlertCircleIcon } from "lucide-react";

import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Radio from "@/app/_components/radio";
import { get_applicants_thunk } from "@/app/redux/job-posting-thunk";
import { send_documents_service } from "@/app/services/account-service";

export default function SendDocumentsSection({ data }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            contract_type: "",
        },
    });

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            await send_documents_service({
                ...data,
                ...formData,
            });
            await dispatch(get_applicants_thunk());
            setOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to send documents:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                className="w-full"
                variant="success"
                onClick={() => setOpen(true)}
                outlined
            >
                <span className="text-green-500">
                    <SendIcon className="w-4 h-4 mr-2" />
                </span>
                Send Documents
            </Button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <MailIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Confirm Action
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Send Documents
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-[400px]"
            >
                <form
                    className="space-y-4 mt-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <ul className="mx-4 list-disc text-sm text-neutral-600">
                        <li>Onboarding Documents</li>
                        <li>Contract Signing</li>
                    </ul>

                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Are you sure you want to send onboarding documents and
                        contract signing to this candidate?
                    </p>

                    {/* Interactive Contract Selection Section */}
                    <div className="flex flex-col gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
                        <label className="text-xs font-semibold text-red-800 uppercase tracking-wider">
                            Select the type of contract
                        </label>

                        <Controller
                            control={control}
                            name="contract_type"
                            rules={{ required: "Please select a contract type" }}
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    <Radio
                                        label="Probation Part Time"
                                        value="probation_part_time"
                                        checked={field.value === "probation_part_time"}
                                        onChange={() => field.onChange("probation_part_time")}
                                    />
                                    <Radio
                                        label="Probation Full Time"
                                        value="probation_full_time"
                                        checked={field.value === "probation_full_time"}
                                        onChange={() => field.onChange("probation_full_time")}
                                    />
                                </div>
                            )}
                        />

                        {errors.contract_type && (
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                                <AlertCircleIcon size={14} />
                                {errors.contract_type.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
                        <span className="text-blue-500 shrink-0 mt-px">
                            <InfoIcon size={16} />
                        </span>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            The candidate will receive an email immediately and
                            can begin the onboarding process right away.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                        >
                            <div className="mr-2">
                                <SendIcon className="w-3.5 h-3.5" />
                            </div>
                            Yes, Send
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}