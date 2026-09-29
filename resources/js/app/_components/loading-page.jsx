import React from 'react'

export default function LoadingPage() {
    return (
        <div className="pt-36 flex flex-col items-center justify-center bg-white text-slate-800 p-4 relative overflow-hidden">
          
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-100/80 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-sm w-full bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-8 shadow-xl shadow-purple-500/5 text-center">
                {/* Animated Spinner Ring */}
                <div className="relative mb-6 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-50" />
                    <div className="absolute w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />

                    {/* Inner pulsing dot */}
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full animate-ping" />
                </div>

                {/* Text area */}
                <h2 className="text-xl font-semibold tracking-wide text-slate-900 mb-2">
                    Loading your experience
                </h2>
                <p className="text-sm text-slate-500 animate-pulse">
                    Please wait a moment while we set things up...
                </p>

                {/* Progress bar */}
                <div className="w-full bg-purple-50 h-1.5 rounded-full mt-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-sky-400 h-full w-2/3 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                </div>
            </div>
        </div>
    )
}