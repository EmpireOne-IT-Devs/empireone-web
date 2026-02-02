import React from "react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Modal({ isOpen, onClose, title, children, width = "", closeOnClickOutside = true }) {
    const handleOverlayClick = (e) => {
        if (closeOnClickOutside && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <div className="relative z-50">
                {/* Overlay */}
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

                {/* Modal Panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4" onClick={handleOverlayClick}>
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
                            className={`relative w-full ${width} overflow-visible max-h-[95vh] py-12 transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Title */}
                            {title && (
                                <div
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                >
                                    {title}
                                </div>
                            )}

                            {/* Content */}
                            <div>{children}</div>

                            {/* Close button (optional) */}
                            <button
                                onClick={() => onClose()}
                                className="absolute top-3 right-3 text-4xl text-red-600 hover:text-red-700 "
                            >
                                &times;
                            </button>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
}
