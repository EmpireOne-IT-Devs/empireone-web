import Button from "@/app/_components/button";
import moment from "moment";
import React from "react";

export default function FinalReviewSection({
    prevStep,
    watchedValues,
    loading,
}) {

    console.log('watchedValues', watchedValues.file_name)
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2
                className="text-2xl font-bold pb-2"
                style={{
                    background: "linear-gradient(90deg,#c084fc,#93c5fd,#fb923c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Final Review
            </h2>
            <div
                className="p-6 rounded-xl space-y-6 text-sm"
                style={{
                    background: "rgba(168,85,247,0.04)",
                    border: "1px solid rgba(168,85,247,0.15)",
                    color: "#374151",
                }}
            >
                {/* Personal & Contact Info */}
                <div>
                    <p className="font-bold uppercase text-xs tracking-wider" style={{ color: "#fb923c" }}>
                        Personal & Contact Details
                    </p>
                    <div className="grid grid-cols-2 gap-y-1">
                        <p>
                            <strong style={{ color: "#6b7280" }}>Name:</strong> {watchedValues.first_name}{" "}
                            {watchedValues.middle_name}{" "}
                            {watchedValues.last_name}
                        </p>
                        <p>
                            <strong style={{ color: "#6b7280" }}>Gender:</strong> {watchedValues.gender}
                        </p>
                        <p>
                            <strong style={{ color: "#6b7280" }}>Email:</strong> {watchedValues.email}
                        </p>
                        <p>
                            <strong style={{ color: "#6b7280" }}>Contact:</strong> {watchedValues.contact}
                        </p>
                        <p>
                            <strong style={{ color: "#6b7280" }}>DOB: </strong>
                            {moment(watchedValues.date_of_birth).format("LL")}
                        </p>
                        
                        <p>
                            <strong style={{ color: "#6b7280" }}>Previously of EmpireOne: </strong>
                            {watchedValues.previous_employee_status}
                        </p>
                    </div>
                </div>
                <div>
                    <p className="font-bold uppercase text-xs tracking-wider" style={{ color: "#fb923c" }}>
                        Interview Details
                    </p>
                    <p>
                        {moment(watchedValues.scheduled_date).format("LL")}
                        {" - "}({watchedValues.start_time} to{" "}
                        {watchedValues.end_time})
                    </p>
                </div>
                {/* Address Information */}
                <div>
                    <p className="font-bold uppercase text-xs tracking-wider" style={{ color: "#fb923c" }}>
                        Birth Place
                    </p>
                    <p className="capitalize">{watchedValues.birth_place}</p>
                </div>
                {
                    watchedValues.is_previous_employee == 'Yes' && <div>
                        <p className="font-bold uppercase text-xs tracking-wider" style={{ color: "#fb923c" }}>
                            Previous Employee Status
                        </p>
                        <p className="capitalize">{watchedValues.previous_employee_status}</p>
                    </div>
                }


                <div>
                    <p className="font-bold uppercase text-xs tracking-wider" style={{ color: "#fb923c" }}>
                        Current Address
                    </p>
                    <p className="capitalize">
                        {watchedValues.street}, {watchedValues.barangay}{" "}
                        {watchedValues.city} {watchedValues.province}{" "}
                        {watchedValues.regions} {watchedValues.zip_code}
                    </p>
                </div>

                {/* Document Review */}
                <div
                    className="p-3 rounded-lg flex items-center justify-between"
                    style={{
                        background: "rgba(59,130,246,0.08)",
                        border: "1px solid rgba(59,130,246,0.2)",
                    }}
                >
                    <div>
                        <p className="text-[10px] font-bold uppercase" style={{ color: "#3b82f6" }}>
                            Attached CV
                        </p>
                        <p className="text-xs font-medium truncate max-w-[200px]" style={{ color: "#1e3a8a" }}>
                            {watchedValues.file_name || "No file uploaded"}
                        </p>
                    </div>
                    <svg className="w-5 h-5" style={{ color: "#93c5fd" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
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
                    Edit Details
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    style={{
                        color: "#fff",
                        background: loading ? "rgba(52,211,153,0.35)" : "linear-gradient(135deg,#059669,#10b981)",
                        border: "1px solid rgba(52,211,153,0.3)",
                        boxShadow: loading ? "none" : "0 4px 15px rgba(16,185,129,0.25)",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <span className="text-white">Submitting...</span>
                        </div>
                    ) : (
                        "Submit Application"
                    )}
                </button>
            </div>
        </div>
    );
}
