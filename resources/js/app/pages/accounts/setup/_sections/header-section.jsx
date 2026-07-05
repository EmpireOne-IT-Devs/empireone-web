import React from "react";

export default function HeaderSection({ title = '' }) {
    return (
        <>
            <div className="relative w-full bg-gradient-to-b from-purple-700 to-purple-500 text-white p-10 flex flex-col items-center justify-between text-center max-h-[300px] overflow-hidden">
                <div className="z-10">
                    <div className="w-72 px-3 h-24 bg-white rounded-tr-3xl rounded-bl-3xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-fade-in-down">
                        <img src="/images/eo-full-logo.png" alt="Logo" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-wide animate-fade-in [animation-delay:200ms]">
                        {title}
                    </h1>
                </div>
                <div className="text-[16px] tracking-widest text-blue-200 uppercase flex space-x-3 z-10 mb-4 animate-fade-in-up [animation-delay:400ms]">
                    {/* <span>Customer {call_type == "safety issue" ? "Safety Concern" : call_type ?? ''}</span> */}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-16 animate-wave-rise z-0">
                    <svg
                        viewBox="0 0 800 100"
                        preserveAspectRatio="none"
                        className="h-full w-full fill-white"
                    >
                        <path
                            d="M0,100 L800,100 L800,20 C750,40 700,90 650,60 C600,30 550,80 500,50 C450,20 400,70 350,40 C300,10 250,60 200,40 C150,20 100,70 50,40 C0,10 0,100 0,100 Z"
                            opacity="0.4"
                        />
                        <path
                            d="M0,100 L800,100 L800,40 C750,60 700,110 650,80 C600,50 550,100 500,70 C450,40 400,90 350,60 C300,30 250,80 200,60 C150,40 100,90 50,60 C0,30 0,100 0,100 Z"
                            opacity="0.7"
                        />
                        <path d="M0,100 L800,100 L800,60 C750,80 700,130 650,100 C600,70 550,120 500,90 C450,60 400,110 350,80 C300,50 250,100 200,80 C150,60 100,110 50,80 C0,50 0,100 0,100 Z" />
                    </svg>
                </div>
            </div>
        </>
    );
}
