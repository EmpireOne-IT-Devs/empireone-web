import { BlobProvider } from "@react-pdf/renderer";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setDocument } from "../redux/app-slice";

// Helper to safely sync the 'loading' state to Redux without breaking Hook rules
const LoadingSync = ({ loading }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setLoading(loading));
    }, [loading, dispatch]);

    return null;
};

// Helper to safely sync the generated document URL to Redux state
const DocumentSync = ({ url }) => {
    const dispatch = useDispatch();
    const { document } = useSelector((store) => store.app);

    useEffect(() => {
        // Only dispatch if we have a URL and it's not already saved to prevent infinite loops
        if (url && document?.url !== url) {
            dispatch(
                setDocument({
                    ...document,
                    url: url,
                }),
            );
        }
    }, [url, dispatch, document]);

    return null;
};

export default function PDFLoader({ pdf, width = "sm:w-[80vw]" }) {
    return (
        <div className={`w-screen ${width} h-screen m-0 p-0`}>
            <BlobProvider document={pdf}>
                {({ url, loading, error }) => {
                    if (loading) {
                        return (
                            <>
                                {/* Safely dispatch loading state */}
                                <LoadingSync loading={loading} />

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
                                            animation:
                                                "spin 1s linear infinite",
                                        }}
                                    >
                                        <circle
                                            cx="25"
                                            cy="25"
                                            r="20"
                                            fill="none"
                                            strokeWidth="5"
                                            stroke="#e5e7eb"
                                        />
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
                                            @keyframes spin { 100% { transform: rotate(360deg); } }
                                            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                                        `}
                                    </style>
                                </div>
                            </>
                        );
                    }

                    // Error State
                    if (error) {
                        return (
                            <>
                                <LoadingSync loading={loading} />
                                <div className="flex justify-center items-center h-full">
                                    <p>
                                        Error generating PDF. Please try again.
                                    </p>
                                </div>
                            </>
                        );
                    }

                    // Render iframe when PDF is ready
                    return (
                        <>
                            {/* Update loading to false now that it is done */}
                            <LoadingSync loading={loading} />

                            {/* Save the generated URL to Redux */}
                            <DocumentSync url={url} />

                            <iframe
                                src={url}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                }}
                                title="Pre-Employment Checklist PDF"
                            />
                        </>
                    );
                }}
            </BlobProvider>
        </div>
    );
}
