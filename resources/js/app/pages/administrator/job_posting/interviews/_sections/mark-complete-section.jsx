import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import React, { useState } from "react";

export default function MarkCompleteSection() {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [selectedRecommendation, setSelectedRecommendation] =
        useState("Neutral");

    const applicant = {
        name: "John Smith",
        position: "Senior Software Engineer",
    };

    return (
        <div>
            <div className="flex-none">
                <Button
                    type="button"
                    onClick={() => setOpen(true)}
                    variant="primary"
                    className="px-7 py-2.5 text-sm rounded-lg whitespace-nowrap"
                >
                    Mark as Completed
                </Button>
            </div>
            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <div className="flex justify-between items-start border-b pb-4">
                    <div>
                        <h3 className="text-2xl font-bold">
                            Interview Feedback
                        </h3>
                        <div className="text-lg text-gray-600 mt-1">
                            {applicant.name} – {applicant.position}
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="mt-6">
                        <div className="font-medium text-gray-700 mb-3">
                            Overall Rating *
                        </div>
                        <div className="flex gap-5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <svg
                                        className={`w-8 h-8 ${
                                            rating >= star
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                        fill={
                                            rating >= star
                                                ? "currentColor"
                                                : "none"
                                        }
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="text-gray-700 font-medium mb-2">
                            Key Strengths *
                        </div>
                        <textarea
                            placeholder="What did the candidate do well?"
                            className="w-full h-24 px-3 py-3 text-sm leading-normal border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="mt-6">
                        <div className="text-gray-700 font-medium mb-2">
                            Areas for Improvement
                        </div>
                        <textarea
                            placeholder="What could the candidate improve on?"
                            className="w-full h-24 px-3 py-3 text-sm leading-normal border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                    <div className="mt-6">
                        <div className="text-gray-700 font-medium mb-2">
                            Recommendation *
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                "Strongly Recommend",
                                "Recommend",
                                "Neutral",
                                "Not Recommend",
                            ].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() =>
                                        setSelectedRecommendation(option)
                                    }
                                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors  ${
                                        selectedRecommendation === option
                                            ? "text-black bg-purple-100 border border-purple-600"
                                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="text-gray-700 font-medium mb-2">
                            Additional Comments *
                        </div>
                        <textarea
                            placeholder="Overall assessment and next steps..."
                            className="w-full h-24 px-3 py-3 text-sm leading-normal border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="mt-8 border-t pt-4">
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                outlined
                                type="button"
                                className="h-11 inline-flex items-center gap-2 px-4 min-w-[350px]"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-11 inline-flex items-center gap-2 px-4 min-w-[350px]"
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
