'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Drawer({
    isOpen,
    onClose,
    title,
    badge,
    trigger,
    children,
    width = 'max-w-2xl',
}) {
    const [open, setOpen] = useState(isOpen || false)
    const [active, setActive] = useState(false) // Controls active CSS transition state
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Sync external isOpen prop if provided
    useEffect(() => {
        if (isOpen !== undefined) {
            if (isOpen) {
                setOpen(true)
            } else {
                handleClose()
            }
        }
    }, [isOpen])

    // Trigger CSS slide transition after mounting DOM portal
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
            // Double rAF ensures the initial off-screen DOM state renders before applying transition
            const raf1 = requestAnimationFrame(() => {
                const raf2 = requestAnimationFrame(() => {
                    setActive(true)
                })
                return () => cancelAnimationFrame(raf2)
            })
            return () => cancelAnimationFrame(raf1)
        } else {
            setActive(false)
            document.body.style.overflow = 'unset'
        }
    }, [open])

    const handleClose = () => {
        setActive(false)
        // Wait 300ms for slide-out animation to finish before unmounting DOM portal
        setTimeout(() => {
            setOpen(false)
            if (onClose) onClose()
        }, 300)
    }

    return (
        <>
            {/* Clickable Trigger Element */}
            {trigger &&
                React.cloneElement(trigger, {
                    onClick: (e) => {
                        e.stopPropagation()
                        setOpen(true)
                        if (trigger.props.onClick) trigger.props.onClick(e)
                    },
                })}

            {/* Portal mounted directly to document.body */}
            {mounted &&
                open &&
                createPortal(
                    <div
                        className={`fixed inset-0 w-screen h-screen z-[99999] flex justify-end bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${active ? 'opacity-100' : 'opacity-0'
                            }`}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClose()
                        }}
                    >
                        {/* Slide Drawer Panel */}
                        <div
                            className={`relative w-full ${width} h-full bg-white shadow-2xl flex flex-col text-slate-800 transform transition-transform duration-300 ease-in-out ${active ? 'translate-x-0' : 'translate-x-full'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex items-center  w-28 gap-3 justify-center px-3 py-2 rounded-xl border border-blue-500 text-md font-semibold text-blue-700 bg-white hover:bg-slate-100 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                            />
                                        </svg>
                                        Back
                                    </button>

                                </div>

                                {title && (
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {title}
                                    </h2>
                                )}
                            </div>

                            {/* Scrollable Content Body */}
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/50">
                                {children}
                            </div>

                        </div>
                    </div>,
                    document.body
                )}
        </>
    )
}