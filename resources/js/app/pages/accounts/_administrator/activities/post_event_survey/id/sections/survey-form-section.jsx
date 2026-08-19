import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    submit_post_event_survey_thunk,
    get_post_event_survey_thunk,
} from "@/app/redux/post-event-survey-slice";
import { setAlert } from "@/app/redux/app-slice";
import {
    Type,
    AlignLeft,
    Circle,
    CheckSquare,
    ChevronDown,
    Star,
    ClipboardList,
    CheckCircle2,
    Lock,
} from "lucide-react";

const META = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`;
const sans = { fontFamily: "'Inter', sans-serif" };
const label = { fontFamily: "'IBM Plex Mono', monospace" };

const TYPES = {
    short_answer:    { icon: Type,        name: "Short answer"   },
    paragraph:       { icon: AlignLeft,   name: "Paragraph"      },
    multiple_choice: { icon: Circle,      name: "Multiple choice" },
    checkboxes:      { icon: CheckSquare, name: "Checkboxes"     },
    dropdown:        { icon: ChevronDown, name: "Dropdown"       },
    rating:          { icon: Star,        name: "Rating"         },
};

function TypeCaption({ type }) {
    const meta = TYPES[type] ?? TYPES.short_answer;
    const Icon = meta.icon;
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 text-zinc-400">
            <Icon size={13} strokeWidth={2} />
            <span className="text-[11px] uppercase tracking-wider" style={label}>
                {meta.name}
            </span>
        </span>
    );
}

function StarInput({ value, onChange, disabled }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>Poor</span>
                <span>Excellent</span>
            </div>
            <div className="flex items-center justify-between px-1">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(n)}
                        onMouseEnter={() => !disabled && setHover(n)}
                        onMouseLeave={() => !disabled && setHover(0)}
                        className="rounded-full p-1 transition disabled:cursor-not-allowed"
                    >
                        <Star
                            size={28}
                            strokeWidth={1.75}
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition ${
                                n <= (hover || value)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-zinc-300"
                            }`}
                        />
                    </button>
                ))}
            </div>
            {value > 0 && (
                <p className="mt-3 sm:mt-4 text-center text-xs text-zinc-400">
                    {value} / 5
                </p>
            )}
        </div>
    );
}

function AnswerInput({ question, value, onChange, disabled }) {
    const { question_type, options } = question;

    if (question_type === "short_answer") {
        return (
            <div className="mt-3 w-full sm:max-w-lg">
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-200 transition">
                    <input
                        type="text"
                        disabled={disabled}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-zinc-800 placeholder:text-zinc-400 bg-transparent focus:outline-none disabled:opacity-60"
                    />
                    <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-3 py-2 sm:px-4">
                        <span className="text-xs text-zinc-400">Short response</span>
                        <span className="text-xs text-zinc-400">{(value ?? "").length} characters</span>
                    </div>
                </div>
            </div>
        );
    }

    if (question_type === "paragraph") {
        return (
            <div className="mt-3 w-full sm:max-w-2xl">
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-200 transition">
                    <textarea
                        rows={4}
                        disabled={disabled}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full min-h-[100px] sm:min-h-[130px] px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-zinc-800 placeholder:text-zinc-400 bg-transparent focus:outline-none resize-none disabled:opacity-60"
                    />
                    <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-3 py-2 sm:px-4">
                        <span className="text-xs text-zinc-400">Write a detailed response</span>
                        <span className="text-xs text-zinc-400">{(value ?? "").length} characters</span>
                    </div>
                </div>
            </div>
        );
    }

    if (question_type === "multiple_choice") {
        return (
            <div className="mt-3 flex flex-col gap-2.5">
                {(options ?? []).map((opt) => (
                    <label
                        key={opt.id}
                        className={`flex items-center gap-2.5 ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        <span
                            className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition ${
                                value === opt.option_text
                                    ? "border-indigo-500 bg-indigo-500"
                                    : "border-zinc-300 bg-white"
                            }`}
                            onClick={() => !disabled && onChange(opt.option_text)}
                        >
                            {value === opt.option_text && (
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                        </span>
                        <span className="text-sm text-zinc-600">{opt.option_text}</span>
                    </label>
                ))}
            </div>
        );
    }

    if (question_type === "checkboxes") {
        const selected = Array.isArray(value) ? value : [];
        return (
            <div className="mt-3 flex flex-col gap-2.5">
                {(options ?? []).map((opt) => {
                    const checked = selected.includes(opt.option_text);
                    return (
                        <label
                            key={opt.id}
                            className={`flex items-center gap-2.5 ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <span
                                className={`h-4 w-4 shrink-0 rounded-[4px] border-2 flex items-center justify-center transition ${
                                    checked ? "border-indigo-500 bg-indigo-500" : "border-zinc-300 bg-white"
                                }`}
                                onClick={() => {
                                    if (disabled) return;
                                    onChange(
                                        checked
                                            ? selected.filter((v) => v !== opt.option_text)
                                            : [...selected, opt.option_text],
                                    );
                                }}
                            >
                                {checked && (
                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </span>
                            <span className="text-sm text-zinc-600">{opt.option_text}</span>
                        </label>
                    );
                })}
            </div>
        );
    }

    if (question_type === "dropdown") {
        return (
            <div className="mt-3 w-full sm:max-w-xs">
                <div className="relative">
                    <select
                        disabled={disabled}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full appearance-none rounded-md border border-zinc-300 bg-white px-3 py-2.5 sm:py-2 pr-8 text-sm text-zinc-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200 disabled:opacity-60"
                    >
                        <option value="">Choose an option</option>
                        {(options ?? []).map((opt) => (
                            <option key={opt.id} value={opt.option_text}>
                                {opt.option_text}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
            </div>
        );
    }

    if (question_type === "rating") {
        return <StarInput value={Number(value) || 0} onChange={onChange} disabled={disabled} />;
    }

    return null;
}

function QuestionRow({ question, index, isLast, value, onChange, disabled }) {
    return (
        <div
            className={`relative flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-none sm:border-0 sm:border-b sm:border-zinc-100 sm:bg-transparent sm:p-0 sm:py-5 sm:shadow-none ${
                isLast ? "sm:border-b-0" : "mb-3 sm:mb-0"
            }`}
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
                    <p className="text-[15px] font-medium leading-snug text-zinc-900" style={sans}>
                        {question.question_text}
                        {question.is_required && (
                            <span className="ml-1 text-indigo-500">*</span>
                        )}
                    </p>
                    <TypeCaption type={question.question_type} />
                </div>

                <AnswerInput
                    question={question}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}

export default function SurveyFormSection({ surveyId }) {
    const dispatch = useDispatch();
    const { selectedSurvey, submitting } = useSelector(
        (state) => state.post_event_surveys,
    );

    const [answers, setAnswers] = useState({});

    const isClosed       = selectedSurvey?.status === "closed";
    const alreadyAnswered = selectedSurvey?.user_has_responded === true;
    const questions      = selectedSurvey?.questions ?? [];
    const requiredCount  = questions.filter((q) => q.is_required).length;

    const setAnswer = (questionId, value) =>
        setAnswers((prev) => ({ ...prev, [questionId]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const q of questions) {
            if (!q.is_required) continue;
            const val = answers[q.id];
            const empty =
                val === undefined ||
                val === null ||
                val === "" ||
                (Array.isArray(val) && val.length === 0);
            if (empty) {
                dispatch(setAlert({ type: "error", title: "Required field missing", message: `Please answer: "${q.question_text}"`, open: true }));
                return;
            }
        }

        const result = await dispatch(submit_post_event_survey_thunk({ id: surveyId, answers }));

        if (submit_post_event_survey_thunk.fulfilled.match(result)) {
            dispatch(setAlert({ type: "success", title: "Survey submitted!", message: "Thank you for your response.", open: true }));
            dispatch(get_post_event_survey_thunk(surveyId));
        } else {
            dispatch(setAlert({ type: "error", title: "Submission failed", message: result.payload?.message ?? "Something went wrong.", open: true }));
        }
    };

    if (isClosed) {
        return (
            <div className="w-full bg-zinc-50 p-3 sm:bg-white sm:p-4 rounded-md" style={sans}>
                <style>{META}</style>
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-white py-10 sm:py-14 text-center sm:bg-transparent">
                    <Lock size={20} className="text-zinc-300" />
                    <p className="text-sm font-semibold text-zinc-500 px-2">This survey is closed.</p>
                    <p className="text-xs text-zinc-400">Responses are no longer accepted.</p>
                </div>
            </div>
        );
    }

    if (alreadyAnswered) {
        return (
            <div className="w-full bg-zinc-50 p-3 sm:bg-white sm:p-4 rounded-md" style={sans}>
                <style>{META}</style>
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-green-200 bg-green-50/60 py-10 sm:py-14 text-center">
                    <CheckCircle2 size={22} className="text-green-500" />
                    <p className="text-sm font-semibold text-green-700 px-2">You have already answered this survey.</p>
                    <p className="text-xs text-green-600">Thank you for your response!</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full bg-zinc-50 p-3 sm:bg-white sm:p-4 rounded-md" style={sans}>
            <style>{META}</style>

            {/* Header row — mirrors QuestionsSection header */}
            <div className="mb-3 flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:mb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:rounded-none sm:border-0 sm:border-b sm:border-zinc-200 sm:bg-transparent sm:p-0 sm:pb-4 sm:shadow-none">
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                    Answer Survey
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 whitespace-nowrap">
                    {questions.length} question{questions.length === 1 ? "" : "s"}
                    {requiredCount > 0 && (
                        <>
                            {" "}<span className="text-zinc-300">·</span>{" "}
                            <span className="text-indigo-500">{requiredCount} required</span>
                        </>
                    )}
                </p>
            </div>

            {questions.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-white py-10 sm:py-14 text-center sm:bg-transparent">
                    <ClipboardList size={20} className="text-zinc-300" />
                    <p className="text-sm text-zinc-400 px-2">No questions available for this survey.</p>
                </div>
            ) : (
                <>
                    <div className="relative mt-3 sm:mt-0">
                        {/* Connecting timeline line */}
                        <div className="absolute bottom-5 left-4 top-5 hidden w-px bg-zinc-200 sm:block" aria-hidden="true" />
                        {questions.map((question, index) => (
                            <QuestionRow
                                key={question.id}
                                question={question}
                                index={index}
                                isLast={index === questions.length - 1}
                                value={answers[question.id]}
                                onChange={(val) => setAnswer(question.id, val)}
                                disabled={submitting}
                            />
                        ))}
                    </div>

                    <div className="mt-4 flex justify-end border-t border-zinc-100 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={sans}
                        >
                            {submitting ? "Submitting…" : "Submit Survey"}
                        </button>
                    </div>
                </>
            )}
        </form>
    );
}


const QUESTION_ICONS = {
    short_answer:    Type,
    paragraph:       AlignLeft,
    multiple_choice: Circle,
    checkboxes:      CheckSquare,
    dropdown:        ChevronDown,
    rating:          Star,
};

function StarRating({ value, onChange, disabled }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(n)}
                    onMouseEnter={() => !disabled && setHover(n)}
                    onMouseLeave={() => !disabled && setHover(0)}
                    className="p-0.5 transition disabled:cursor-not-allowed"
                >
                    <Star
                        size={28}
                        className={
                            n <= (hover || value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }
                    />
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 text-xs text-gray-500">{value}/5</span>
            )}
        </div>
    );
}

function QuestionField({ question, value, onChange, disabled }) {
    const Icon = QUESTION_ICONS[question.question_type] ?? Type;
    const required = question.is_required;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-2 mb-4">
                <Icon size={15} className="mt-0.5 shrink-0 text-orange-500" />
                <p className="text-sm font-semibold text-gray-800 leading-snug">
                    {question.question_text}
                    {required && <span className="ml-1 text-orange-500">*</span>}
                </p>
            </div>

            {question.question_type === "short_answer" && (
                <input
                    type="text"
                    disabled={disabled}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Your answer"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-300 disabled:opacity-60"
                />
            )}

            {question.question_type === "paragraph" && (
                <textarea
                    rows={4}
                    disabled={disabled}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Your answer"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-300 disabled:opacity-60 resize-none"
                />
            )}

            {question.question_type === "multiple_choice" && (
                <div className="flex flex-col gap-2.5">
                    {(question.options ?? []).map((opt) => (
                        <label
                            key={opt.id}
                            className={`flex items-center gap-2.5 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            <input
                                type="radio"
                                name={`q_${question.id}`}
                                disabled={disabled}
                                checked={value === opt.option_text}
                                onChange={() => onChange(opt.option_text)}
                                className="accent-orange-500"
                            />
                            <span className="text-sm text-gray-700">{opt.option_text}</span>
                        </label>
                    ))}
                </div>
            )}

            {question.question_type === "checkboxes" && (
                <div className="flex flex-col gap-2.5">
                    {(question.options ?? []).map((opt) => {
                        const checked = Array.isArray(value) && value.includes(opt.option_text);
                        return (
                            <label
                                key={opt.id}
                                className={`flex items-center gap-2.5 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                <input
                                    type="checkbox"
                                    disabled={disabled}
                                    checked={checked}
                                    onChange={() => {
                                        const current = Array.isArray(value) ? value : [];
                                        onChange(
                                            checked
                                                ? current.filter((v) => v !== opt.option_text)
                                                : [...current, opt.option_text],
                                        );
                                    }}
                                    className="accent-orange-500"
                                />
                                <span className="text-sm text-gray-700">{opt.option_text}</span>
                            </label>
                        );
                    })}
                </div>
            )}

            {question.question_type === "dropdown" && (
                <select
                    disabled={disabled}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-300 disabled:opacity-60"
                >
                    <option value="">Choose an option</option>
                    {(question.options ?? []).map((opt) => (
                        <option key={opt.id} value={opt.option_text}>
                            {opt.option_text}
                        </option>
                    ))}
                </select>
            )}

            {question.question_type === "rating" && (
                <StarRating
                    value={Number(value) || 0}
                    onChange={onChange}
                    disabled={disabled}
                />
            )}
        </div>
    );
}
