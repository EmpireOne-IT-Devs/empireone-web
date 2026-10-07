import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { isHtml, sanitizeHtml, RICH_TEXT_CLASSES } from "@/app/lib/rich-text";

const COLLAPSED_HEIGHT = 200;

export default function ChallengeGuideSection({ challenge, defaultExpanded = false, label = "Challenge Guide" }) {
    const description = challenge?.description ?? "";
    const html = useMemo(
        () => (isHtml(description) ? sanitizeHtml(description) : null),
        [description],
    );
    const contentRef = useRef(null);
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [overflowing, setOverflowing] = useState(false);

    useLayoutEffect(() => {
        const el = contentRef.current;
        if (el) setOverflowing(el.scrollHeight > COLLAPSED_HEIGHT + 16);
    }, [description]);

    if (!description.trim()) return null;

    const collapsed = overflowing && !expanded;

    return (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 p-4 shadow-sm">
            <div className="mb-2.5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <BookOpen className="h-4 w-4" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    {label}
                </p>
            </div>

            <div className="relative">
                <div
                    ref={contentRef}
                    className={`overflow-hidden ${RICH_TEXT_CLASSES}`}
                    style={{ maxHeight: collapsed ? COLLAPSED_HEIGHT : "none" }}
                >
                    {html !== null ? (
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    ) : (
                        <p className="whitespace-pre-line">{description}</p>
                    )}
                </div>
                {collapsed && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
                )}
            </div>

            {overflowing && (
                <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                    {expanded ? "Show less" : "Read full guide"}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>
            )}
        </div>
    );
}
