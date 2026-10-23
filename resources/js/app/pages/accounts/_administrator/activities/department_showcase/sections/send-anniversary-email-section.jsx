import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePage } from "@inertiajs/react";
import {
    FiMail as Mail,
    FiGift as PartyPopper,
} from "react-icons/fi";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Checkbox from "@/app/_components/checkbox";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import { send_work_anniversary_email_thunk } from "@/app/redux/engagement-slice";

const DEFAULT_MESSAGE =
    "Congratulations on this milestone! Thank you for your continued dedication and hard work — here's to many more years of success together.";

export default function SendAnniversaryEmailSection() {
    const dispatch = useDispatch();
    const currentUser = usePage().props.auth?.user;
    const {
        workAnniversaries = [],
        workAnniversaryFilters,
        sendingAnniversaryEmail,
    } = useSelector((state) => state.engagement);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    const isWackyHojilla =
        String(currentUser?.name ?? "").trim().toLowerCase() === "wacky hojilla";
    const testRecipient =
        isWackyHojilla && currentUser?.id
            ? {
                  user_id: currentUser.id,
                  name: currentUser.name,
                  anniversary_label: "Test recipient",
                  department: null,
              }
            : null;
    const recipients =
        testRecipient &&
        !workAnniversaries.some(
            (employee) => Number(employee.user_id) === Number(testRecipient.user_id),
        )
            ? [...workAnniversaries, testRecipient]
            : workAnniversaries;

    const allSelected =
        recipients.length > 0 &&
        recipients.every((employee) => selectedIds.includes(employee.user_id));

    const handleOpen = () => {
        setSelectedIds(recipients.map((employee) => employee.user_id));
        setMessage(DEFAULT_MESSAGE);
        setIsOpen(true);
    };

    const handleClose = () => {
        if (sendingAnniversaryEmail) return;
        setIsOpen(false);
    };

    const toggleEmployee = (userId) => {
        setSelectedIds((current) =>
            current.includes(userId)
                ? current.filter((id) => id !== userId)
                : [...current, userId],
        );
    };

    const toggleAll = () => {
        setSelectedIds(
            allSelected
                ? []
                : recipients.map((employee) => employee.user_id),
        );
    };

    const handleSend = async () => {
        if (selectedIds.length === 0 || !message.trim()) return;

        const result = await dispatch(
            send_work_anniversary_email_thunk({
                user_ids: selectedIds,
                message: message.trim(),
                year: workAnniversaryFilters?.year,
                month: workAnniversaryFilters?.month,
            }),
        );

        if (result.error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to send emails",
                    message:
                        result.payload?.message ??
                        "Something went wrong while sending anniversary emails.",
                    open: true,
                }),
            );
            return;
        }

        const { sent_count = 0, failed_count = 0 } = result.payload ?? {};

        dispatch(
            setAlert({
                type: failed_count > 0 ? "warning" : "success",
                title: "Anniversary emails sent",
                message:
                    failed_count > 0
                        ? `${sent_count} email(s) sent, ${failed_count} failed.`
                        : `${sent_count} email(s) sent successfully.`,
                open: true,
            }),
        );

        setIsOpen(false);
    };

    const disabled = recipients.length === 0;

    return (
        <div>
            <Button
                variant="engagement"
                disabled={disabled}
                onClick={handleOpen}
                className="text-sm"
            >
                <Mail size={16} className="mr-2" />
                Send Email
            </Button>

            <Modal
                width="max-w-xl"
                isOpen={isOpen}
                onClose={handleClose}
                title="Send Work Anniversary Email"
            >
                <div className="space-y-4 p-1">
                    <div className="flex items-start gap-3 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">
                        <PartyPopper size={18} className="mt-0.5 shrink-0" />
                        <p>
                            Select the employees celebrating a work anniversary
                            this period and customize the message they'll
                            receive.
                        </p>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                                Recipients ({selectedIds.length}/
                                {recipients.length})
                            </span>
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                {allSelected ? "Deselect All" : "Select All"}
                            </button>
                        </div>

                        <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
                            {recipients.length === 0 ? (
                                <div className="p-3 text-sm text-gray-500">
                                    No employees found for this period.
                                </div>
                            ) : (
                                recipients.map((employee) => (
                                    <div
                                        key={employee.user_id}
                                        className="flex items-center justify-between px-3 py-2"
                                    >
                                        <Checkbox
                                            name={`anniversary-${employee.user_id}`}
                                            label={`${employee.name} — ${employee.anniversary_label}`}
                                            checked={selectedIds.includes(
                                                employee.user_id,
                                            )}
                                            onChange={() =>
                                                toggleEmployee(employee.user_id)
                                            }
                                        />
                                        <span className="shrink-0 text-xs text-gray-400">
                                            {employee.department ?? "—"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <TextArea
                        label="Message"
                        name="anniversary_message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={5}
                        required
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="light"
                            outlined
                            onClick={handleClose}
                            disabled={sendingAnniversaryEmail}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="engagement"
                            onClick={handleSend}
                            loading={sendingAnniversaryEmail}
                            disabled={
                                sendingAnniversaryEmail ||
                                selectedIds.length === 0 ||
                                !message.trim()
                            }
                        >
                            Send Email{selectedIds.length > 1 ? "s" : ""}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
