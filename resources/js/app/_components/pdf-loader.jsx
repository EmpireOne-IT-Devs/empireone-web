import { BlobProvider } from "@react-pdf/renderer";
import React from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/app-slice";

export default function PDFLoader({ pdf, width = "sm:w-[80vw]" }) {
    const dispatch = useDispatch();
    return (
        <div className={`w-screen ${width} h-screen m-0 p-0`}>
            <BlobProvider document={pdf}>
                {({ url, loading, error }) => {
                    // Custom Loading State
                    dispatch(setLoading(loading));
                    if (loading) {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    gap: "16px",
                                    fontFamily:
                                        "system-ui, -apple-system, sans-serif",
                                }}
                            >
                                {/* Animated SVG Spinner */}
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 50 50"
                                    style={{
                                        animation: "spin 1s linear infinite",
                                    }}
                                >
                                    {/* Background track */}
                                    <circle
                                        cx="25"
                                        cy="25"
                                        r="20"
                                        fill="none"
                                        strokeWidth="5"
                                        stroke="#e5e7eb"
                                    />
                                    {/* Spinning progress stroke */}
                                    <circle
                                        cx="25"
                                        cy="25"
                                        r="20"
                                        fill="none"
                                        strokeWidth="5"
                                        stroke="#00529B"
                                        strokeDasharray="31.4 100"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {/* Pulsing Text */}
                                <p
                                    style={{
                                        animation:
                                            "pulse 1.5s ease-in-out infinite",
                                        color: "#4b5563",
                                        margin: 0,
                                        fontWeight: 500,
                                    }}
                                >
                                    Generating PDF, please wait...
                                </p>

                                {/* Inline Keyframes */}
                                <style>
                                    {`
            @keyframes spin {
                100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `}
                                </style>
                            </div>
                        );
                    }

                    // Error State
                    if (error) {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                }}
                            >
                                <p>Error generating PDF. Please try again.</p>
                            </div>
                        );
                    }

                    // Render iframe when PDF is ready
                    return (
                        <iframe
                            src={url}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                            title="Pre-Employment Checklist PDF"
                        />
                    );
                }}
            </BlobProvider>
        </div>
    );
}
