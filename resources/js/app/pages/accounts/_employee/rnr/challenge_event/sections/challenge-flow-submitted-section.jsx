import React from "react";
import Button from "@/app/_components/button";
import moment from "moment/moment";

export default function ChallengeFlowSubmittedSection({ challenge, onClose }) {
    const media = challenge.submission_media?.length
        ? challenge.submission_media
        : challenge.submission_url
          ? [{ type: "image", url: challenge.submission_url }]
          : [];

    return (
        <>
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {challenge.proof_approved_at
                    ? "Your proof is approved. Complete the survey to finalize the challenge and receive your challenge points."
                    : <>Your proof was submitted on{" "}
                        {moment(challenge.submitted_at).format("MMM D, YYYY")} and is waiting for admin review.</>}
            </div>
            {media.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {media.map((item, index) => item.type === "video" ? (
                        <video
                            key={item.url}
                            src={item.url}
                            controls
                            className="h-48 w-full rounded-2xl bg-black object-contain"
                            aria-label="Submitted video proof"
                        />
                    ) : (
                        <img
                            key={item.url}
                            src={item.url}
                            alt={`Submitted proof ${index + 1}`}
                            className="h-48 w-full rounded-2xl object-cover"
                        />
                    ))}
                </div>
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
