import React from "react";
import Button from "@/app/_components/button";
import moment from "moment/moment";

export default function ChallengeFlowApprovedSection({ challenge, onClose }) {
    return (
        <>
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Approved on {moment(challenge.reviewed_at).format("MMM D, YYYY")} — +
                {challenge.points} pts awarded to your profile.
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
