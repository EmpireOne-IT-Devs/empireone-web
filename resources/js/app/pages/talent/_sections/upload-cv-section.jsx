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
                <label
                    className="font-bold mb-2 text-xs uppercase tracking-widest"
                    style={{ color: "#7e22ce" }}
                >
                    Upload Your CV
                </label>

                <div className="relative group">
                    <label
                        htmlFor="cv-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200"
                        style={
                            errors.cv
                                ? { borderColor: "rgba(248,113,113,0.5)", background: "rgba(248,113,113,0.05)" }
                                : fileName || watchedValues.file
                                ? { borderColor: "rgba(52,211,153,0.45)", background: "rgba(52,211,153,0.05)" }
                                : { borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.05)" }
                        }
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {/* Icon */}
                            {fileName || watchedValues.file ? (
                                <svg
                                    className="w-10 h-10 mb-3"
                                    style={{ color: "#34d399" }}
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
                                    className="w-10 h-10 mb-3 transition-colors"
                                    style={{ color: "rgba(168,85,247,0.6)" }}
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

                            <p className="mb-2 text-sm" style={{ color: "#4b5563" }}>
                                <span className="font-semibold">
                                    {fileName || watchedValues.file
                                        ? "File selected!"
                                        : "Click to upload"}
                                </span>{" "}
                                {!fileName && "or drag and drop"}
                            </p>

                            <p className="text-xs truncate max-w-xs" style={{ color: "#9ca3af" }}>
                                PDF, DOC, or DOCX (MAX. 50MB)
                            </p>

                            {/* Note for restored files */}
                            {fileName && (
                                <p className="text-[10px] mt-1" style={{ color: "#9ca3af" }}>
                                    (Please re-upload before submitting)
                                </p>
                            )}
                        </div>

                        <input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            {...register("cv")}
                        />
                    </label>
                </div>

                {errors.cv && (
                    <p className="text-xs mt-2 font-medium flex items-center" style={{ color: "rgba(248,113,113,0.9)" }}>
                        <span className="mr-1">⚠️</span> CV is required!
                    </p>
                )}
            </div>

            <div className="flex gap-4 pt-2">
                <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 h-11 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                        color: "#9333ea",
                        background: "rgba(168,85,247,0.06)",
                        border: "1px solid rgba(168,85,247,0.2)",
                    }}
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    className="w-1/2 h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                    style={{
                        color: "#fff",
                        background: "linear-gradient(135deg,#a855f7,#3b82f6)",
                        border: "1px solid rgba(168,85,247,0.4)",
                        boxShadow: "0 4px 15px rgba(168,85,247,0.25)",
                    }}
                >
                    Continue to set interview
                </button>
            </div>
        </div>
    );
}
