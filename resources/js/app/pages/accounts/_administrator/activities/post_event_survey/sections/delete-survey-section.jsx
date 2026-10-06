import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Trash2, TriangleAlert } from "lucide-react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { delete_post_event_survey_thunk } from "@/app/redux/post-event-survey-slice";

/**
 * Dropdown menu item + confirmation modal for deleting a survey. Blocking
 * on an explicit confirm step avoids an accidental, unrecoverable delete.
 */
export default function DeleteSurveySection({ survey, onAction }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await dispatch(delete_post_event_survey_thunk(survey.id));

        setLoading(false);

        if (result.error) {
            const msg =
                result.payload?.message ||
                result.error?.message ||
                "Failed to delete survey. Please try again.";
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to delete survey",
                    message: msg,
                    open: true,
                }),
            );
            return;
        }

        dispatch(
            setAlert({
                type: "success",
                title: "Survey deleted",
                message: "The survey has been removed.",
                open: true,
            }),
        );
        setIsOpen(false);
        onAction?.();
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-normal text-red-600 hover:bg-red-50 hover:text-red-700"
            >
                <Trash2 size={16} className="shrink-0" />
                Delete
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
                                Delete Survey
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
                            {survey.title}
                        </span>
                        ? {survey.total_responses > 0
                            ? `This will also permanently remove its ${survey.total_responses} submitted response(s). `
                            : ""}
                        This action cannot be undone.
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
