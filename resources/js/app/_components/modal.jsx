import React, { useState, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { Transition } from "@headlessui/react";
import { FaRegWindowClose } from "react-icons/fa";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    width = "sm:max-w-lg",
    closeOnClickOutside = false, // Set to false to prevent closing on outside click
}) {
    // Ensure portal only renders on the client-side (prevents SSR hydration errors)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // If we aren't mounted on the client yet, don't attempt to render the portal
    if (!mounted) return null;

    const modalContent = (
        <Transition show={isOpen} as={Fragment}>
            <div
                className="fixed inset-0 z-[9999]"
                // 🛑 CRITICAL FIX: Stop event propagation!
                // This prevents parent dropdowns from thinking you clicked "outside" 
                // when you are interacting with the modal or its backdrop.
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Overlay Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal Panel Wrapper */}
                <div
                    className="fixed inset-0 overflow-y-auto p-4 flex items-center justify-center"
                    // Handles the closeOnClickOutside logic safely
                    onClick={() => {
                        if (closeOnClickOutside) {
                            onClose();
                        }
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95 translate-y-2"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-2"
                    >
                        <div
                            className={`relative flex w-full ${width} max-h-[90vh] transform flex-col overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-2xl transition-all`}
                            // Stops clicks INSIDE the white panel from triggering the wrapper's onClick
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Title Section */}
                            <div className="flex flex-none items-center justify-between py-3">
                                {title && (
                                    <div
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 w-full"
                                    >
                                        {title}
                                    </div>
                                )}
                                <div className="flex w-full items-end justify-end">
                                    <button
                                        type="button"
                                        onClick={() => onClose()}
                                        className="text-red-600 transition-colors p-1"
                                    >
                                        <FaRegWindowClose size={26} />
                                    </button>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {children}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );

    // Render the modal directly into the <body> tag
    return createPortal(modalContent, document.body);
}