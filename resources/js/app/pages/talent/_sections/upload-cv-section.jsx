import Button from "@/app/_components/button";
import React from "react";

export default function UploadCvSection({
    register,
    errors,
    nextStep,
    prevStep,
    watchedValues,
}) {
    // Safely get file name
    const fileName = watchedValues?.cv?.[0]?.name ?? "";

    return (
        <div className="space-y-4 animate-in fade-in duration-300 my-3">
            <div className="flex flex-col">
                <label className="font-bold text-gray-700 mb-2">
                    Upload Your CV
                </label>

                <div className="relative group">
                    <label
                        htmlFor="cv-upload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all
                            ${errors.cv ? "border-red-400 bg-red-50" : ""}
                            ${fileName || watchedValues.file ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400"}
                        `}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {/* Icon */}
                            {fileName || watchedValues.file ? (
                                <svg
                                    className="w-10 h-10 mb-3 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                            )}

                            <p className="mb-2 text-sm text-gray-700">
                                <span className="font-semibold">
                                    {fileName || watchedValues.file
                                        ? "File selected!"
                                        : "Click to upload"}
                                </span>{" "}
                                {!fileName && "or drag and drop"}
                            </p>

                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                {"PDF, DOC, or DOCX (MAX. 50MB)"}
                            </p>

                            {/* Note for restored files */}
                            {fileName && (
                                <p className="text-[10px] text-gray-400 mt-1">
                                    (Please re-upload before submitting)
                                </p>
                            )}
                        </div>

                        <input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            {...register("cv", {
                                required: watchedValues.file ? false : true,
                            })}
                        />
                    </label>
                </div>

                {errors.cv && (
                    <p className="text-red-500 text-xs mt-2 font-medium flex items-center">
                        <span className="mr-1">⚠️</span> CV is required!.
                    </p>
                )}
            </div>

            <div className="flex gap-4 pt-2">
                <Button
                    outlined
                    variant="secondary"
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 "
                >
                    Back
                </Button>
                <Button outlined type="button" onClick={nextStep} className="w-1/2 ">
                    Continue To Review
                </Button>
            </div>
        </div>
    );
}
