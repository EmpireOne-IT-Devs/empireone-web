import React, { useEffect, useRef, useState } from "react";
import { FiPlay as Play, FiRefreshCw as Refresh } from "react-icons/fi";

export default function SubmissionVideoPlayer({ url, label, isOpen }) {
    const videoRef = useRef(null);
    const [sourceRequested, setSourceRequested] = useState(false);
    const [status, setStatus] = useState("idle");

    const updateStatus = (nextStatus) => {
        if (videoRef.current?.hasAttribute("src")) {
            setStatus(nextStatus);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setSourceRequested(false);
            setStatus("idle");
        }

        return () => {
            const video = videoRef.current;
            if (video) {
                video.pause();
                video.removeAttribute("src");
                video.load();
            }
        };
    }, [isOpen, url]);

    const startPlayback = () => {
        const video = videoRef.current;
        if (!video || !isOpen) return;

        if (!video.hasAttribute("src")) {
            video.src = url;
            video.load();
            setSourceRequested(true);
        } else if (status === "error") {
            video.load();
        }

        setStatus("loading");
        const playback = video.play();
        if (playback && typeof playback.catch === "function") {
            playback.catch((error) => {
                if (
                    video.hasAttribute("src") &&
                    !["NotAllowedError", "AbortError"].includes(error?.name)
                ) {
                    setStatus("error");
                }
            });
        }
    };

    return (
        <>
            <video
                ref={videoRef}
                controls={sourceRequested}
                playsInline
                preload="none"
                onLoadStart={() => updateStatus("loading")}
                onLoadedMetadata={() => updateStatus("loading")}
                onWaiting={() => updateStatus("buffering")}
                onStalled={() => updateStatus("buffering")}
                onSeeking={() => updateStatus("buffering")}
                onCanPlay={() => updateStatus("ready")}
                onPlaying={() => updateStatus("ready")}
                onPause={() => updateStatus("ready")}
                onError={() => updateStatus("error")}
                className="h-full w-full bg-black object-contain"
                aria-label={label}
            />

            {!sourceRequested && status !== "error" && (
                <button
                    type="button"
                    onClick={startPlayback}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 text-white transition-colors hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                    aria-label={`Play ${label.toLowerCase()}`}
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                        <Play className="h-4 w-4" />
                        Play video
                    </span>
                </button>
            )}

            {(status === "loading" || status === "buffering") && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`pointer-events-none absolute flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm ${
                        status === "buffering"
                            ? "right-3 top-3"
                            : "inset-0 m-auto h-fit w-fit"
                    }`}
                >
                    <span className="h-3 w-12 animate-pulse rounded bg-white/40" />
                    {status === "buffering" ? "Buffering…" : "Loading video…"}
                </div>
            )}

            {status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 p-4 text-center text-sm text-white">
                    <p role="alert">This video could not be loaded.</p>
                    <button
                        type="button"
                        onClick={startPlayback}
                        className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 font-medium transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <Refresh className="h-4 w-4" />
                        Retry
                    </button>
                </div>
            )}
        </>
    );
}
