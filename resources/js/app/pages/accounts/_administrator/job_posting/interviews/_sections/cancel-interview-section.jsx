import React, { useState } from "react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Alert from "@/app/_components/alert";

export default function CancelInterviewSection({ isOpen, onClose }) {
    const [reason, setReason] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const handleCancelInterview = () => {
        if (!reason.trim()) {
            setShowAlert(true);
            return;
        }

        console.log("Cancelling with reason:", reason);

        setReason("");
        onClose();
    };

    const handleClose = () => {
        setReason("");
        setShowAlert(false);
        onClose();
    };

    return (
        <>
            <Modal width="max-w-lg" isOpen={isOpen} onClose={handleClose}>
                <div className="flex flex-col items-start  pb-2">
                    <h3 className="text-lg">Cancel Interview</h3>
                    <p className="text-lg text-gray-600 mt-2">
                        Please provide a reason for cancelling this interview:
                    </p>
                </div>

                <div className="mt-2    ">
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3"
                        rows="4"
                        placeholder="Enter reason for cancellation..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className=" pt-2">
                    <div className="flex justify-end gap-2">
                        <div className="flex-1">
                            <Button
                                variant="secondary"
                                outlined
                                type="button"
                                className="w-full px-4 py-2.5 text-sm rounded-lg"
                                onClick={handleClose}
                            >
                                Keep Interview
                            </Button>
                        </div>

                        <div className="flex-1">
                            <Button
                                variant="danger"
                                type="button"
                                className="w-full px-4 py-2.5 text-sm rounded-lg"
                                onClick={handleCancelInterview}
                            >
                                Cancel Interview
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Alert
                open={showAlert}
                onClose={() => setShowAlert(false)}
                type="danger"
                title="Validation Error"
                message="Please provide a reason for cancellation."
                duration={3000}
            />
        </>
    );
}
