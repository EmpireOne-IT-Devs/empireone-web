import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal"; // adjust path as needed
import { CheckIcon, InfoIcon, MailIcon, SendIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function SendOnboardingDocumentsSection() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleClose = useCallback(() => {
        if (loading) return;
        setOpen(false);
        setTimeout(() => setSuccess(false), 300);
    }, [loading]);

    const handleConfirm = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(handleClose, 1800);
        }, 1400);
    }, [handleClose]);

    return (
        <>
            <Button onClick={() => setOpen(true)} outlined>
                <span className="text-blue-500">
                    <SendIcon className="w-4 h-4 mr-2" />
                </span>
                Send Onboarding
            </Button>

            <Modal
                isOpen={open}
                onClose={handleClose}
                closeOnClickOutside={!loading}
                width="max-w-[400px]"
                title={
                    !success && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                                <MailIcon />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                    Confirm Action
                                </p>
                                <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                    Send Onboarding Documents
                                </h2>
                            </div>
                        </div>
                    )
                }
            >
                {success ? (
                    // — Success state —
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 animate-[popIn_0.35s_cubic-bezier(0.34,1.5,0.64,1)]">
                            <CheckIcon />
                        </div>
                        <p className="text-base font-semibold text-neutral-800 tracking-tight">
                            Documents Sent!
                        </p>
                        <p className="text-sm text-neutral-400 max-w-[240px] leading-relaxed">
                            The candidate has been notified and can now begin
                            onboarding.
                        </p>
                    </div>
                ) : (
                    // — Confirm state —
                    <div className="space-y-4 mt-4">
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Are you sure you want to send onboarding documents
                            to this candidate?
                        </p>

                        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
                            <span className="text-blue-500 shrink-0 mt-px">
                                <InfoIcon size={16} />
                            </span>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                The candidate will receive an email immediately
                                and can begin the onboarding process right away.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                            <Button
                                variant="outlined"
                                outlined
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm} disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="mr-2">
                                            <FaSpinner className="animate-spin" />{" "}
                                        </div>
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <div className="mr-2">
                                            <SendIcon className="w-3.5 h-3.5 " />{" "}
                                        </div>
                                        Yes, Send
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
