import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import { decline_engagement_reward_challenge_submission_thunk } from "@/app/redux/engagement-thunk";

export default function DeclineSection({ submission, onClose }) {
    const dispatch = useDispatch();
    const { challengeSubmissionDecliningId } = useSelector(
        (state) => state.engagement,
    );
    const [note, setNote] = useState("");
    // Keep the last submission rendered while the modal animates out, so
    // the content doesn't disappear before the leave transition finishes.
    const [activeSubmission, setActiveSubmission] = useState(submission);

    useEffect(() => {
        if (submission && submission.id !== activeSubmission?.id) {
            setNote("");
        }
        if (submission) {
            setActiveSubmission(submission);
        }
    }, [submission]);

    if (!activeSubmission) return null;

    const declining = challengeSubmissionDecliningId === activeSubmission.id;

    const handleDecline = async () => {
        const result = await dispatch(
            decline_engagement_reward_challenge_submission_thunk({
                id: activeSubmission.id,
                review_note: note,
            }),
        );

        if (
            decline_engagement_reward_challenge_submission_thunk.rejected.match(
                result,
            )
        ) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Unable to decline submission",
                    message: result.payload?.message || "Please try again.",
                    open: true,
                }),
            );
            return;
        }

        dispatch(
            setAlert({
                type: "success",
                title: "Submission declined",
                message: `${activeSubmission.employee.name}'s submission was declined.`,
                open: true,
            }),
        );
        onClose();
    };

    return (
        <Modal
            isOpen={Boolean(submission)}
            onClose={onClose}
            width="max-w-md"
            title={
                <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                    Decline Submission
                </h2>
            }
        >
            <div className="mt-2 flex flex-col gap-4 pb-2">
                <TextArea
                    label="Reason (optional)"
                    name="review_note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Let the employee know why this was declined..."
                />
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="light"
                        outlined
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        loading={declining}
                        disabled={declining}
                        onClick={handleDecline}
                        className="w-full sm:w-auto"
                    >
                        Decline Submission
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
