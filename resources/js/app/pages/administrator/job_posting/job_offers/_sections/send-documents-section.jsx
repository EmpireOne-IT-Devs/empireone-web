import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Radio from "@/app/_components/radio";
import { get_job_offers_thunk } from "@/app/redux/job-posting-thunk";
import { send_documents_service } from "@/app/services/account-service";
import store from "@/app/store/store";
import { InfoIcon, MailIcon, SendIcon } from "lucide-react";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function SendDocumentsSection({ data }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [interviewType, setInterviewType] = useState("");
    const [interviewDate, setInterviewDate] = useState("");
    const [interviewTime, setInterviewTime] = useState("");

    async function send_documents(params) {
        try {
            setLoading(true);
            await send_documents_service({
                ...data,
                interviewType: interviewType,
                interviewDate: interviewDate,
                interviewTime: interviewTime,
            });
            await store.dispatch(get_job_offers_thunk(window.location.search));
            setLoading(false);
            setOpen(false);
        } catch (error) {
            setLoading(false);
        }
    }
    const today = new Date().toLocaleDateString("en-CA");
    return (
        <div>
            <Button variant="success" onClick={() => setOpen(true)} outlined>
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
                <div className="space-y-4 mt-4">
                    <ul className="mx-4 list-disc">
                        <li>Onboarding Documents</li>
                        <li>Contract Signing</li>
                    </ul>

                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Are you sure you want to send onboarding documents and
                        contract signing to this candidate?
                    </p>
                    <div className="flex flex-col gap-2 bg-gray-100 border border-gray-100 rounded-lg px-3.5 py-2.5">
                        <Radio
                            label="Face to Face Interview"
                            value="face_to_face"
                            name="interview_type"
                            checked={interviewType === "face_to_face"}
                            onChange={() => {
                                setInterviewType("face_to_face");
                                setInterviewDate("");
                                setInterviewTime("");
                            }}
                        />

                        {interviewType === "face_to_face" && (
                            <div className="mt-2">
                                <span className="text-sm text-neutral-500 block mb-1">
                                    Schedule Interview:
                                </span>

                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        min={today}
                                        className="border rounded px-2 py-1 text-sm"
                                        value={interviewDate}
                                        onChange={(e) =>
                                            setInterviewDate(e.target.value)
                                        }
                                    />
                                    <input
                                        type="time"
                                        className="border rounded px-2 py-1 text-sm"
                                        value={interviewTime}
                                        onChange={(e) =>
                                            setInterviewTime(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        <Radio
                            label="Online Interview"
                            value="online"
                            name="interview_type"
                            checked={interviewType === "online"}
                            onChange={() => {
                                setInterviewType("online");
                                setInterviewDate("");
                                setInterviewTime("");
                            }}
                        />
                        {interviewType === "online" && (
                            <div className="mt-2">
                                <span className="text-sm text-neutral-500 block mb-1">
                                    Schedule Interview:
                                </span>

                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        className="border rounded px-2 py-1 text-sm"
                                        value={interviewDate}
                                        onChange={(e) =>
                                            setInterviewDate(e.target.value)
                                        }
                                    />
                                    <input
                                        type="time"
                                        className="border rounded px-2 py-1 text-sm"
                                        value={interviewTime}
                                        onChange={(e) =>
                                            setInterviewTime(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>

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
                        <Button
                            loading={loading}
                            disabled={
                                !interviewType ||
                                !interviewDate ||
                                !interviewTime
                            }
                            onClick={() => send_documents()}
                            className="w-full"
                        >
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
