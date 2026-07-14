import React, { useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function PostActionMenu({
    open,
    onToggle,
    onEdit,
    onDelete,
    deleting = false,
}) {
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handleOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onToggle();
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [open, onToggle]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={onToggle}
                className="text-orange-400 hover:text-orange-600 p-1 transition rounded"
            >
                <MoreHorizontal size={22} />
            </button>

            {open && (
                <div className="absolute right-0 top-7 z-50 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-sm">
                    <button
                        onClick={() => {
                            onToggle();
                            onEdit();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                        <Pencil size={13} />
                        Edit post
                    </button>
                    <button
                        onClick={() => {
                            onToggle();
                            onDelete();
                        }}
                        disabled={deleting}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                    >
                        <Trash2 size={13} />
                        {deleting ? "Deleting…" : "Delete post"}
                    </button>
                </div>
            )}
        </div>
    );
}
