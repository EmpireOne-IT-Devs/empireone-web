import React, { useState } from "react";
import { Trash, AlertTriangle } from "lucide-react";

import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import store from "@/app/store/store";
import { delete_applicant_service } from "@/app/services/applicants-service";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_applicants_thunk } from "@/app/redux/job-posting-thunk";

export default function DeleteApplicantSection({ data }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await delete_applicant_service(data.id)
            await store.dispatch(get_applicants_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Deleted Successfully!",
                    message: "The applicant has been removed.",
                    open: true,
                }),
            );
            setLoading(false);
            setOpen(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    return (
        <>
            {/* Changed to a danger/red variant for deletion */}
            <Button
                variant="danger"
                className="w-full"
                onClick={() => setOpen(true)}
                outlined>
                <Trash className="w-4 h-4 mr-2" />
                DELETE
            </Button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 shrink-0">
                            <AlertTriangle />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Confirm Action
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Delete Applicant
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-[400px]"
            >
                <form className="space-y-4 mt-4" onSubmit={handleDelete}>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Are you sure you want to delete this applicant? This action cannot be undone and will remove all their associated data.
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setOpen(false)}
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
                            <Trash className="w-3.5 h-3.5 mr-2" />
                            Yes, Delete
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}