import React from "react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaRegWindowClose } from "react-icons/fa";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    width = "",
    closeOnClickOutside = true,
}) {
    const handleOverlayClick = (e) => {
        if (closeOnClickOutside && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <div className="fixed z-40">
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
                <div
                    className="fixed inset-0 overflow-y-auto p-4"
                    onClick={handleOverlayClick}
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
                            className={`relative mx-auto flex w-full ${width} max-h-[90vh] transform flex-col overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:my-8`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Title */}
                            <div className="flex flex-none items-center justify-between py-3">
                                {title && (
                                    <div
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 w-full "
                                    >
                                        {title}
                                    </div>
                                )}
                                <div className="flex w-full  items-end justify-end ">
                                    <button
                                        onClick={() => onClose()}
                                        className=" text-xl text-red-600 hover:text-red-700 px-5 p-2 "
                                    >
                                        <FaRegWindowClose size={32} />
                                    </button>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {children}
                            </div>

                            {/* Close button (optional) */}
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
}
