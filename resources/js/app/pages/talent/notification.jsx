import Button from '@/app/_components/button';
import { router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { FcOk, FcClock, FcInfo } from 'react-icons/fc';

export default function Notification() {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('default');

    // Prevent SSR hydration mismatches
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setMessage(params.get('message') || 'Your action was completed successfully.');
        setStatus(params.get('status') || 'default');
    }, []);

    // Dynamically change UI based on the backend status
    const uiConfig = {
        cooldown: {
            icon: <FcClock className="w-10 h-10 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />,
            title: 'Cooldown Period Active',
            ringColor: 'bg-amber-50 border-amber-100',
        },
        found: {
            icon: <FcInfo className="w-10 h-10 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />,
            title: 'Application Already Exists',
            ringColor: 'bg-blue-50 border-blue-100',
        },
        default: {
            icon: <FcOk className="w-10 h-10 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />,
            title: 'Status Update',
            ringColor: 'bg-slate-50 border-slate-100',
        }
    };

    const currentConfig = uiConfig[status] || uiConfig.default;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">

            {/* Card Container */}
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 p-8 text-center transition-all duration-300 hover:shadow-2xl animate-[fadeIn_0.5s_ease-out]">

                {/* Dynamic Interactive Icon Container */}
                <div className={`mx-auto w-20 h-20 border rounded-full flex items-center justify-center mb-6 group cursor-default transition-colors duration-300 shadow-sm ${currentConfig.ringColor}`}>
                    {currentConfig.icon}
                </div>

                {/* Typography */}
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                    {currentConfig.title}
                </h2>

                <p className="text-slate-600 mb-8 leading-relaxed min-h-[3rem]">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        className="w-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                        onClick={() => router.visit('/talent/application')}
                    >
                        Browse Other Positions
                    </Button>

                    <button
                        onClick={() => router.visit('/')}
                        className="text-sm text-slate-500 hover:text-slate-700 transition-colors mt-2 font-medium"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
}