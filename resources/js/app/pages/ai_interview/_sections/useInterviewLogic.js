import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import store from "@/app/store/store";
import { get_job_interview_by_id_thunk } from "@/app/redux/app-thunk";

export const useInterviewLogic = () => {
    const { job_interview_id } = useSelector((store) => store.app);
    const [jobTitle, setJobTitle] = useState(null);
    const [interviewId, setInterviewId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speechData, setSpeechData] = useState(null);

    const [isStarting, setIsStarting] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const interviewIdRef = useRef(null);
    const answersRef = useRef([]);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    // Routing & Media Refs
    const audioRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const mixedStreamRef = useRef(null);
    const audioCtxRef = useRef(null);
    const userVideoRef = useRef(null);

    // NEW: Ref to prevent DOMException when routing audio
    const isAudioConnectedRef = useRef(false);

    useEffect(() => {
        store.dispatch(
            get_job_interview_by_id_thunk(
                window.location.pathname.split("/")[2],
            ),
        );
    }, []);
    // Initialization & Cleanup
    useEffect(() => {
        setJobTitle(job_interview_id?.job_title ?? null);
        if (job_interview_id?.status == "completed") {
            setIsFinished(true);
        }
        if (job_interview_id?.status == "in_progress") {
            setInterviewId(job_interview_id?.id);
        }
        if (!audioRef.current) {
            const audio = new Audio();
            audio.crossOrigin = "anonymous";
            audioRef.current = audio;
        }

        // NEW: Proper cleanup on unmount to turn off the camera/mic
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
            }
            if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
                audioCtxRef.current.close();
            }
        };
    }, [job_interview_id?.job_title]);

    const startInterview = async () => {
        setIsStarting(true);
        let currentMediaStream = null;

        try {
            const res = await axios.post("/api/interviews/start", {
                job_title: jobTitle,
                job_interview_id: job_interview_id.id,
            });

            setInterviewId(res.data.interview_id);
            interviewIdRef.current = res.data.interview_id;
            setQuestions(res.data.questions);

            currentMediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            mediaStreamRef.current = currentMediaStream;

            if (userVideoRef.current) {
                userVideoRef.current.srcObject = currentMediaStream;
            }

            if (!audioCtxRef.current) {
                const AudioContext =
                    window.AudioContext || window.webkitAudioContext;
                const ctx = new AudioContext();
                audioCtxRef.current = ctx;

                const mixedDest = ctx.createMediaStreamDestination();

                // 1. Connect Microphone
                const micSource =
                    ctx.createMediaStreamSource(currentMediaStream);
                micSource.connect(mixedDest);

                // 2. Connect AI Audio (Safeguarded)
                if (!isAudioConnectedRef.current && audioRef.current) {
                    const aiSource = ctx.createMediaElementSource(
                        audioRef.current,
                    );
                    aiSource.connect(mixedDest);
                    aiSource.connect(ctx.destination);
                    isAudioConnectedRef.current = true;
                }

                // 3. Add Video Tracks
                currentMediaStream.getVideoTracks().forEach((track) => {
                    mixedDest.stream.addTrack(track);
                });

                mixedStreamRef.current = mixedDest.stream;
            }

            if (audioCtxRef.current.state === "suspended") {
                await audioCtxRef.current.resume();
            }

            startRecordingAndPlay(res.data.questions[0], 0, res.data.questions);
        } catch (err) {
            // NEW: Clean up camera if setup fails halfway
            if (currentMediaStream) {
                currentMediaStream.getTracks().forEach((track) => track.stop());
            }
            alert(
                "Error starting interview. Please ensure camera and microphone permissions are granted.",
            );
            console.error(err);
        } finally {
            setIsStarting(false);
        }
    };

    const startRecordingAndPlay = (q, index, allQuestions) => {
        // NEW: Check for supported mime types to ensure cross-browser compatibility
        const options = MediaRecorder.isTypeSupported(
            "video/webm;codecs=vp8,opus",
        )
            ? { mimeType: "video/webm;codecs=vp8,opus" }
            : MediaRecorder.isTypeSupported("video/mp4")
              ? { mimeType: "video/mp4" }
              : {}; // fallback to browser default

        mediaRecorder.current = new MediaRecorder(
            mixedStreamRef.current,
            options,
        );
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                audioChunks.current.push(e.data);
            }
        };

        mediaRecorder.current.onstop = () => {
            // Determine correct mime type for the Blob based on what we actually recorded
            const mimeType = mediaRecorder.current.mimeType || "video/webm";
            const blob = new Blob(audioChunks.current, { type: mimeType });
            answersRef.current.push({ qna_id: q.id, blob });

            if (index < allQuestions.length - 1) {
                const next = index + 1;
                setCurrentIndex(next);
                startRecordingAndPlay(allQuestions[next], next, allQuestions);
            } else {
                submitAll();
            }
        };

        mediaRecorder.current.start();
        setIsAiSpeaking(true);
        setSpeechData({ audioUrl: q.audio_url, visemes: q.visemes });
    };

    const handleFinishAnswer = () => {
        if (mediaRecorder.current?.state === "recording") {
            mediaRecorder.current.stop();
        }
    };

    const submitAll = async () => {
        setIsSubmitting(true);

        // Turn off camera/mic immediately upon finishing
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        const formData = new FormData();
        answersRef.current.forEach((ans, i) => {
            formData.append(`answers[${i}][qna_id]`, ans.qna_id);
            // Append file with generic extension, backend can parse the mimetype
            formData.append(`answers[${i}][audio]`, ans.blob, `file_${i}.webm`);
        });

        try {
            await axios.post(
                `/api/interviews/${interviewIdRef.current}/submitAnswer`,
                formData,
            );
            setIsFinished(true);
        } catch (e) {
            alert("Upload failed.");
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        state: {
            jobTitle,
            interviewId,
            questions,
            currentIndex,
            speechData,
            isStarting,
            isAiSpeaking,
            isSubmitting,
            isFinished,
        },
        actions: {
            setJobTitle,
            startInterview,
            handleFinishAnswer,
            setIsAiSpeaking,
        },
        refs: {
            audioRef,
            userVideoRef,
        },
    };
};
