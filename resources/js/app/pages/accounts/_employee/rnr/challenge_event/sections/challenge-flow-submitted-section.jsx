import React from "react";
import Button from "@/app/_components/button";
import moment from "moment/moment";

export default function ChallengeFlowSubmittedSection({ challenge, onClose }) {
    return (
        <>
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Your proof was submitted on{" "}
                {moment(challenge.submitted_at).format("MMM D, YYYY")} and is waiting for admin
                review.
            </div>
            {challenge.submission_url && (
                <img
                    src={challenge.submission_url}
                    alt="Submitted proof"
                    className="h-48 w-full rounded-2xl object-cover"
                />
            )}
            <div className="mt-2 flex justify-end">
                <Button
                    type="button"
                    variant="light"
                    outlined
                    onClick={onClose}
                    className="w-full sm:w-auto"
                >
                    Close
                </Button>
            </div>
        </>
    );
}
