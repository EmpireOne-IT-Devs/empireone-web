import React, { useState } from 'react';

export default function LoadingState() {

    return (
        <div className="w-full  flex flex-col items-center justify-center text-white font-sans rounded-xl h-[50vh]">
            {/* Inline Styles for Seamless Infinite Stripe Movement */}
            <style>{`
        @keyframes moveStripes {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        .animated-stripes {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.25) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.25) 75%,
            transparent 75%,
            transparent
          );
          background-size: 40px 40px;
          animation: moveStripes 1s linear infinite;
        }
      `}</style>

            {/* Container Card with Subtle Glow */}
            <div className="relative w-full max-w-lg  rounded-3xl p-8 flex flex-col items-center text-center ">

                {/* Title */}
                <h1 className="text-2xl sm:text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-300 mb-8 select-none">
                    LOADING...
                </h1>

                {/* Outer Progress Bar Capsule Track */}
                <div className="relative w-full h-6 rounded-full p-[.5] border border-purple-500/40 shadow-inner overflow-hidden mb-6">
                    {/* Active Stripe Bar */}
                    <div
                        className={`h-full w-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)] relative overflow-hidden transition-opacity duration-300 opacity-100`}
                    >
                        {/* Animated Stripe Overlay */}
                        <div className="absolute inset-0 animated-stripes opacity-80" />
                    </div>
                </div>

                {/* Status Text */}
                <div className="flex items-center justify-center w-full px-2 text-purple-500 font-medium text-sm sm:text-base">
                    <span className={'animate-pulse'}>
                        Please Wait...
                    </span>
                </div>

            </div>
        </div>
    );
}