import React, { useEffect, useState } from 'react';
import AvatarInterface from './_sections/avatar-interface';
import CameraPreview from './_sections/camera-preview';
import { useInterviewLogic } from './_sections/useInterviewLogic';
import GetStarted from './_sections/get-started';
import store from '@/app/store/store';
import { get_job_interview_by_id_thunk } from '@/app/redux/app-thunk';
import { router } from '@inertiajs/react';

const InterviewRoom = () => {
    const { state, actions, refs } = useInterviewLogic();
    const [isCameraMain, setIsCameraMain] = useState(false);

    if (state.isFinished) {
        return (
            <div className="flex items-center flex-col justify-center gap-3 min-h-screen bg-[#0a0a14] text-white">
                <h2 className="text-2xl font-syne anim-fade-up">Interview Complete! Results submitted.</h2>
                <button

                    onClick={() => router.visit('/dashboard')}
                    className={`w-96 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2  bg-teal-500 hover:bg-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]`}
                >
                    GO TO DASHBOARD
                </button>
            </div>
        );
    }

    return (
        <section
            className="relative min-h-screen w-full overflow-hidden bg-[#0a0a14] text-white flex flex-col font-dm"
            id="home"
        >
            {/* ---------------- KEYFRAMES & FONTS ---------------- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                .font-syne { font-family: 'Syne', sans-serif; }
                .font-dm { font-family: 'DM Sans', sans-serif; }
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
                .float { animation: float 4s ease-in-out infinite; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes orbPulse { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
                .anim-fade-up { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
                .anim-orb { animation: orbPulse 6s ease-in-out infinite; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-600 { animation-delay: 0.6s; }
            `}</style>

            {/* ---------------- BACKGROUND ORBS ---------------- */}
            <div className="absolute inset-0 bg-[#0a0a14] z-0" />
            <div className="absolute w-[700px] h-[700px] bg-purple-600/20 blur-[100px] rounded-full -top-40 -left-32 anim-orb z-0" />
            <div className="absolute w-[600px] h-[600px] bg-orange-500/10 blur-[100px] rounded-full top-20 -right-24 anim-orb delay-300 z-0" />
            <div className="absolute w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full bottom-10 left-1/3 anim-orb delay-600 z-0" />

            {/* ---------------- MAIN CONTENT ---------------- */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4 py-8">

                {!state.interviewId && <GetStarted actions={actions} state={state} />}

                {state.interviewId && (
                    <div className="w-full max-w-5xl flex flex-col gap-6 anim-fade-up">

                        {/* Header */}
                        <header className="flex justify-between items-center pb-4 border-b border-white/10">
                            <div className="font-syne font-bold text-xl tracking-wide">
                                INCRUITER <span className="text-teal-400">AI</span>
                            </div>
                            <div className="text-white/50 text-sm font-medium tracking-wider">
                                ID: {state.interviewId ? String(state.interviewId).substring(0, 8) : 'Loading...'}
                            </div>
                        </header>


                        {/* AI Avatar (Background/Main) */}
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                            <AvatarInterface
                                audioUrl={state.speechData?.audioUrl}
                                visemes={state.speechData?.visemes}
                                audioRef={refs.audioRef}
                                onSpeakEnd={() => actions.setIsAiSpeaking(false)}
                            />
                        </div>

                        {/* User Camera (Picture-in-Picture) */}
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <CameraPreview
                                videoRef={refs.userVideoRef}
                                isVisible={!!state.interviewId}
                            />
                        </div>

                        {/* Control Panel (Glassmorphism) */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl w-full shadow-xl">

                            {/* Status Bar */}
                            <div className="flex justify-between items-center mb-4 text-sm md:text-base">
                                <span className="font-medium text-white/70">
                                    Question {state.currentIndex + 1} of {state.questions.length}
                                </span>
                                <span className={`font-bold flex items-center gap-2 ${state.isAiSpeaking ? 'text-teal-400' : 'text-orange-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${state.isAiSpeaking ? 'bg-teal-400 animate-pulse' : 'bg-orange-400 animate-pulse'}`}></span>
                                    {state.isAiSpeaking ? "AI SPEAKING" : "LISTENING..."}
                                </span>
                            </div>

                            {/* Question Text */}
                            <h2 className="text-xl md:text-2xl font-medium leading-relaxed mb-8 min-h-[4rem]">
                                {state.questions[state.currentIndex]?.question || "Loading question..."}
                            </h2>

                            {/* Action Button */}
                            <button
                                onClick={actions.handleFinishAnswer}
                                disabled={state.isAiSpeaking || state.isSubmitting}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${state.isAiSpeaking
                                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                    : 'bg-teal-500 hover:bg-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]'
                                    }`}
                            >
                                {state.isSubmitting ? (
                                    "Saving Response..."
                                ) : state.isAiSpeaking ? (
                                    "Wait for AI to finish..."
                                ) : (
                                    "Confirm & Next Question"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default InterviewRoom;