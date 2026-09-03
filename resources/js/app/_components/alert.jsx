import { useEffect, useState, useCallback } from "react";
import { Transition } from "@headlessui/react";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/app-slice";

export default function Alert({
    open = true,
    onClose,
    title = "Successfully saved!",
    message = "Action completed successfully.",
    duration = 2000,
    type = "success", // primary | secondary | success | warning | danger | info | none
    showProgress = true,
    shakeOnOpen = true,
}) {
    const dispatch = useDispatch();
    const [show, setShow] = useState(open);
    const [progress, setProgress] = useState(100);
    const [shake, setShake] = useState(false);

    /* --------------------------------------------
     * Variant Config
     * ------------------------------------------ */
    const config = {
        primary: {
            icon: CheckCircleIcon,
            iconColor: "text-blue-400",
            barColor: "bg-blue-500",
        },
        secondary: {
            icon: CheckCircleIcon,
            iconColor: "text-gray-400",
            barColor: "bg-gray-500",
        },
        success: {
            icon: CheckCircleIcon,
            iconColor: "text-green-400",
            barColor: "bg-green-500",
        },
        warning: {
            icon: ExclamationCircleIcon,
            iconColor: "text-yellow-400",
            barColor: "bg-yellow-500",
        },
        danger: {
            icon: ExclamationCircleIcon,
            iconColor: "text-red-400",
            barColor: "bg-red-500",
        },
        error: {
            icon: ExclamationCircleIcon,
            iconColor: "text-red-400",
            barColor: "bg-red-500",
        },
        info: {
            icon: CheckCircleIcon,
            iconColor: "text-blue-400",
            barColor: "bg-blue-500",
        },
        none: {
            icon: null,
            iconColor: "",
            barColor: "",
        },
    };

    const safeType = config[type] ? type : "info";
    const Icon = config[safeType].icon;

    /* --------------------------------------------
     * Handlers
     * ------------------------------------------ */
    const handleClose = useCallback(() => {
        setShow(false);
        onClose?.();
        dispatch(
            setAlert({
                type: "none",
                title: "",
                message: "",
                open: false,
            }),
        );
    }, [dispatch, onClose]);

    /* --------------------------------------------
     * Sync external open prop
     * ------------------------------------------ */
    useEffect(() => {
        setShow(open);
        setProgress(100);
    }, [open]);

    /* --------------------------------------------
     * Auto-dismiss progress bar calculation
     * ------------------------------------------ */
    useEffect(() => {
        if (!show || !showProgress || safeType === "none") return;

        const intervalTime = 50;
        const decrement = 100 / (duration / intervalTime);

        const interval = setInterval(() => {
            setProgress((prev) => Math.max(prev - decrement, 0));
        }, intervalTime);

        return () => clearInterval(interval);
    }, [show, duration, showProgress, safeType]);

    /* --------------------------------------------
     * Watcher to close when progress hits 0
     * ------------------------------------------ */
    useEffect(() => {
        if (progress <= 0 && show) {
            handleClose();
        }
    }, [progress, show, handleClose]);

    /* --------------------------------------------
     * Shake on open
     * ------------------------------------------ */
    useEffect(() => {
        if (!show || !shakeOnOpen) return;

        setShake(true);
        const timer = setTimeout(() => setShake(false), 400);

        return () => clearTimeout(timer);
    }, [show, shakeOnOpen]);

    if (safeType === "none") return null;

    /* --------------------------------------------
     * Render
     * ------------------------------------------ */
    return (
        <div
            role="alert"
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                <Transition
                    show={show}
                    enter="transform transition ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 scale-95"
                    enterTo="opacity-100 translate-y-0 scale-100"
                    leave="transform transition ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 scale-100"
                    leaveTo="opacity-0 translate-y-2 scale-95"
                >
                    <div
                        className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg
                        bg-white shadow-lg outline outline-1 outline-black/5 transition
                        ${shake ? "animate-shake" : ""}`}
                    >
                        {/* Content */}
                        <div className="p-4">
                            <div className="flex items-start">
                                {Icon && (
                                    <div className="shrink-0">
                                        <Icon
                                            className={`size-6 ${config[safeType].iconColor}`}
                                        />
                                    </div>
                                )}

                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">
                                        {title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {message}
                                    </p>
                                </div>

                                <div className="ml-4 flex shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="inline-flex rounded-md text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {showProgress && (
                            <div className="h-1 w-full bg-gray-200">
                                <div
                                    className={`h-full transition-[width] duration-[50ms] ${config[safeType].barColor}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </div>
                </Transition>
            </div>
        </div>
    );
}