import React, { useState, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { Transition } from "@headlessui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function Modal({
  isOpen,
  onClose,
  title = "",
  children,
  width = "sm:max-w-lg",
  closeOnClickOutside = false,
}) {
  const [mounted, setMounted] = useState(false);

  // Motion values to track drag distance for backdrop fading
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [0, 200], [1, 0]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Handles drag end on mobile - dismiss if dragged past threshold or velocity
  const handleDragEnd = (_, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const modalContent = (
    <Transition show={isOpen} appear as={Fragment}>
      <div
        className="fixed inset-0 z-[9999]"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop overlay dynamically linked to mobile drag distance */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <motion.div
            style={{ opacity }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
        </Transition.Child>

        <div
          className="fixed inset-0 overflow-y-auto flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => {
            if (closeOnClickOutside) onClose();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
            enterTo="translate-y-0 sm:opacity-100 sm:scale-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-y-0 sm:opacity-100 sm:scale-100"
            leaveTo="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
          >
            <motion.div
              style={{ y: dragY }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={handleDragEnd}
              className={`relative flex w-full ${width} max-h-[85vh] sm:max-h-[90vh] transform flex-col overflow-hidden 
                rounded-t-2xl sm:rounded-xl bg-white p-4 sm:p-6 text-left align-middle shadow-2xl transition-all touch-pan-y`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle Bar (Draggable trigger indicator for mobile) */}
              <div className="sm:hidden flex justify-center pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex flex-none items-center justify-between pb-3 border-b border-gray-100 sm:border-none">
                {title ? (
                  <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-900 pr-4 truncate">
                    {title}
                  </h3>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => onClose()}
                  className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-2 -mr-2 rounded-full hover:bg-gray-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-slate-400"
                  aria-label="Close modal"
                >
                  <FaTimes size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="min-h-0 flex-1 overflow-y-auto pt-3 sm:pt-2 text-sm sm:text-base text-gray-700 overscroll-contain">
                {children}
              </div>
            </motion.div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );

  return createPortal(modalContent, document.body);
}