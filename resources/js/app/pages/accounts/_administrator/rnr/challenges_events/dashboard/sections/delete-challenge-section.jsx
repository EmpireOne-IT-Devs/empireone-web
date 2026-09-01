import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, TriangleAlert } from "lucide-react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { delete_engagement_reward_challenge_thunk } from "@/app/redux/engagement-thunk";

export default function DeleteChallengeSection({ challenge }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await dispatch(delete_engagement_reward_challenge_thunk(challenge.id));

        setLoading(false);

        if (result.error) {
            const msg =
                result.payload?.message ||
                result.error?.message ||
                "Failed to delete challenge. Please try again.";
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to delete challenge",
                    message: msg,
                    open: true,
                }),
            );
            return;
        }

        dispatch(
            setAlert({
                type: "success",
                title: "Challenge deleted",
                message: "The challenge has been removed.",
                open: true,
            }),
        );
        setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="p-1 rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                aria-label="Delete challenge"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 shrink-0">
                            <TriangleAlert />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Confirm Action
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Delete Challenge
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-[400px]"
            >
                <form className="space-y-4 mt-4" onSubmit={handleDelete}>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-neutral-800">
                            {challenge.title}
                        </span>
                        ? This action cannot be undone.
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setIsOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            loading={loading}
                            disabled={loading}
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}


