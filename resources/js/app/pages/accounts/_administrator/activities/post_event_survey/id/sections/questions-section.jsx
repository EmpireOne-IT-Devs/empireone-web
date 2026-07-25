import React from "react";
import {
    Type,
    AlignLeft,
    Circle,
    CheckSquare,
    ChevronDown,
    Star,
    ClipboardList,
} from "lucide-react";

const META = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`;
const sans = { fontFamily: "'Inter', sans-serif" };
const label = { fontFamily: "'IBM Plex Mono', monospace" };

const TYPES = {
    short_answer: { icon: Type, name: "Short answer" },
    paragraph: { icon: AlignLeft, name: "Paragraph" },
    multiple_choice: { icon: Circle, name: "Multiple choice" },
    checkboxes: { icon: CheckSquare, name: "Checkboxes" },
    dropdown: { icon: ChevronDown, name: "Dropdown" },
    rating: { icon: Star, name: "Rating" },
};

function TypeCaption({ type }) {
    const meta = TYPES[type] ?? TYPES.short_answer;
    const Icon = meta.icon;
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 text-zinc-400">
            <Icon size={13} strokeWidth={2} />
            <span
                className="text-[11px] uppercase tracking-wider"
                style={label}
            >
                {meta.name}
            </span>
        </span>
    );
}

function AnswerPreview({ question }) {
    const { question_type, options } = question;

    if (question_type === "short_answer") {
        return (
            <div className="mt-3 w-full sm:max-w-lg">
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="text-sm text-zinc-400">
                            Type your answer...
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-3 py-2 sm:px-4">
                        <span className="text-xs text-zinc-400">
                            Short response
                        </span>

                        <span className="text-xs text-zinc-400">
                            0 characters
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (question_type === "paragraph") {
        return (
            <div className="mt-3 w-full sm:max-w-2xl">
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <div className="min-h-[100px] sm:min-h-[130px] px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="text-sm text-zinc-400">
                            Share your thoughts...
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-3 py-2 sm:px-4">
                        <span className="text-xs text-zinc-400">
                            Write a detailed response
                        </span>

                        <span className="text-xs text-zinc-400">
                            0 characters
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (question_type === "multiple_choice" || question_type === "checkboxes") {
        const rounded =
            question_type === "checkboxes" ? "rounded-[4px]" : "rounded-full";

        return (
            <div className="mt-3 flex flex-col gap-2.5">
                {(options ?? []).map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2.5">
                        <span
                            className={`h-4 w-4 shrink-0 border border-zinc-300 ${rounded}`}
                        />
                        <span className="text-sm text-zinc-600">
                            {opt.option_text}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    if (question_type === "dropdown") {
        return (
            <div className="mt-3 flex w-full sm:max-w-xs items-center justify-between rounded-md border border-zinc-300 px-3 py-2.5 sm:py-2">
                <span className="text-sm text-zinc-400">
                    {options?.[0]?.option_text ?? "Choose"}
                </span>
                <ChevronDown size={16} className="text-zinc-400" />
            </div>
        );
    }

    if (question_type === "rating") {
        return (
            <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between text-xs font-medium text-zinc-500">
                    <span>Poor</span>
                    <span>Excellent</span>
                </div>

                <div className="flex items-center justify-between px-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="rounded-full p-1">
                            <Star
                                size={24}
                                strokeWidth={1.75}
                                className="text-zinc-300 w-7 h-7 sm:w-8 sm:h-8"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-3 sm:mt-4 text-center">
                    <p className="text-xs text-zinc-400">
                        Employee rating preview
                    </p>
                </div>
            </div>
        );
    }

    return null;
}

// ── Question row ─────────────────────────────────────────────────────────
// Renders as a Google Forms-style standalone card on mobile (no number badge,
// no connecting timeline), and as a numbered timeline row on sm+ screens —
// mirrors the layout used in the live survey form for consistency.

function QuestionRow({ question, index, isLast }) {
    return (
        <div
            className={`relative flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-none sm:border-0 sm:border-b sm:border-zinc-100 sm:bg-transparent sm:p-0 sm:py-5 sm:shadow-none ${
                isLast ? "" : "mb-3 sm:mb-0"
            } ${isLast ? "sm:border-b-0" : ""}`}
        >
            <div
                className={`relative z-10 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:flex ${
                    question.is_required
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-zinc-300 bg-white text-zinc-500"
                }`}
                style={sans}
            >
                {index + 1}
            </div>

            <div className="min-w-0 flex-1 sm:pt-0.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4 sm:gap-y-1.5">
                    <p
                        className="text-[15px] font-medium leading-snug text-zinc-900"
                        style={sans}
                    >
                        {question.question_text}
                        {question.is_required && (
                            <span className="ml-1 text-indigo-500">*</span>
                        )}
                    </p>
                    <TypeCaption type={question.question_type} />
                </div>

                <AnswerPreview question={question} />
            </div>
        </div>
    );
}

export default function QuestionsSection({ questions = [] }) {
    const requiredCount = questions.filter((q) => q.is_required).length;

    return (
        <div className="w-full bg-zinc-50 p-3 sm:bg-white sm:p-4 rounded-md" style={sans}>
            <style>{META}</style>

            <div className="mb-3 flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:mb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:rounded-none sm:border-0 sm:border-b sm:border-zinc-200 sm:bg-transparent sm:p-0 sm:pb-4 sm:shadow-none">
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                    Questions
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 whitespace-nowrap">
                    {questions.length} question
                    {questions.length === 1 ? "" : "s"}
                    {requiredCount > 0 && (
                        <>
                            {" "}
                            <span className="text-zinc-300">·</span>{" "}
                            <span className="text-indigo-500">
                                {requiredCount} required
                            </span>
                        </>
                    )}
                </p>
            </div>

            {questions.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-white py-10 sm:py-14 text-center sm:bg-transparent">
                    <ClipboardList size={20} className="text-zinc-300" />
                    <p className="text-sm text-zinc-400 px-2">
                        No questions found for this survey.
                    </p>
                </div>
            ) : (
                <div className="relative mt-3 sm:mt-0">
                    <div
                        className="absolute bottom-5 left-4 top-5 hidden w-px bg-zinc-200 sm:block"
                        aria-hidden="true"
                    />
                    {questions.map((question, index) => (
                        <QuestionRow
                            key={question.id}
                            question={question}
                            index={index}
                            isLast={index === questions.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}