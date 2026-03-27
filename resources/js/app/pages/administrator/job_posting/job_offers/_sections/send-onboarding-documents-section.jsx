import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { InfoIcon, MailIcon, SendIcon } from "lucide-react";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function SendContractSigning() {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Button variant="warning" onClick={() => setOpen(true)} outlined>
                <span className="text-yellow-500">
                    <SendIcon className="w-4 h-4 mr-2" />
                </span>
                Send Onboarding
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
                                Send Onboarding Documents
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-[400px]"
            >
                <div className="space-y-4 mt-4">
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Are you sure you want to send onboarding documents to
                        this candidate?
                    </p>

                    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
                        <span className="text-blue-500 shrink-0 mt-px">
                            <InfoIcon size={16} />
                        </span>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            The candidate will receive an email immediately and
                            can begin the onboarding process right away.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button className="w-full">
                            <div className="mr-2">
                                <SendIcon className="w-3.5 h-3.5 " />{" "}
                            </div>
                            Yes, Send
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
