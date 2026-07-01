import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submit_post_event_survey_thunk } from "@/app/redux/post-event-survey-slice";
import { CheckSquare, AlignLeft, ChevronDown, Star, Type } from "lucide-react";

const QUESTION_TYPE_LABELS = {
    short_answer:    "Short Answer",
    paragraph:       "Paragraph",
    multiple_choice: "Multiple Choice",
    checkboxes:      "Checkboxes",
    dropdown:        "Dropdown",
    rating:          "Rating (1–5)",
};

const QUESTION_TYPE_ICONS = {
    short_answer:    <Type size={14} />,
    paragraph:       <AlignLeft size={14} />,
    multiple_choice: <CheckSquare size={14} />,
    checkboxes:      <CheckSquare size={14} />,
    dropdown:        <ChevronDown size={14} />,
    rating:          <Star size={14} />,
};

// ── Input components ──────────────────────────────────────────────────────────

function ShortAnswerInput({ value, onChange, hasError }) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your answer"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-300 ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-blue-400"}`}
        />
    );
}

function ParagraphInput({ value, onChange, hasError }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your answer"
            rows={4}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition resize-none focus:ring-2 focus:ring-blue-300 ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-blue-400"}`}
        />
    );
}

function MultipleChoiceInput({ options, value, onChange, hasError }) {
    return (
        <div className={`flex flex-col gap-2 ${hasError ? "p-2 rounded-lg border border-red-300 bg-red-50" : ""}`}>
            {options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="radio" checked={value === opt.option_text} onChange={() => onChange(opt.option_text)} className="accent-blue-500" />
                    {opt.option_text}
                </label>
            ))}
        </div>
    );
}

function CheckboxesInput({ options, value = [], onChange, hasError }) {
    const toggle = (text) =>
        onChange(value.includes(text) ? value.filter((v) => v !== text) : [...value, text]);
    return (
        <div className={`flex flex-col gap-2 ${hasError ? "p-2 rounded-lg border border-red-300 bg-red-50" : ""}`}>
            {options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" checked={value.includes(opt.option_text)} onChange={() => toggle(opt.option_text)} className="accent-blue-500 rounded" />
                    {opt.option_text}
                </label>
            ))}
        </div>
    );
}

function DropdownInput({ options, value, onChange, hasError }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-300 ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-blue-400"}`}
        >
            <option value="">Select an option</option>
            {options.map((opt) => (
                <option key={opt.id} value={opt.option_text}>{opt.option_text}</option>
            ))}
        </select>
    );
}

function RatingInput({ value, onChange, hasError }) {
    return (
        <div className={`flex gap-2 ${hasError ? "p-2 rounded-lg border border-red-300 bg-red-50" : ""}`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(String(n))}
                    className={`w-10 h-10 rounded-full border-2 text-sm font-semibold transition ${value === String(n) ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-400"}`}
                >
                    {n}
                </button>
            ))}
        </div>
    );
}

// ── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({ question, index, answer, onChange, error }) {
    const renderInput = () => {
        switch (question.question_type) {
            case "short_answer":    return <ShortAnswerInput value={answer ?? ""} onChange={onChange} hasError={!!error} />;
            case "paragraph":       return <ParagraphInput value={answer ?? ""} onChange={onChange} hasError={!!error} />;
            case "multiple_choice": return <MultipleChoiceInput options={question.options} value={answer ?? ""} onChange={onChange} hasError={!!error} />;
            case "checkboxes":      return <CheckboxesInput options={question.options} value={answer ?? []} onChange={onChange} hasError={!!error} />;
            case "dropdown":        return <DropdownInput options={question.options} value={answer ?? ""} onChange={onChange} hasError={!!error} />;
            case "rating":          return <RatingInput value={answer ?? ""} onChange={onChange} hasError={!!error} />;
            default:                return null;
        }
    };

    return (
        <div className={`rounded-xl border bg-white p-5 shadow-sm flex flex-col gap-3 transition ${error ? "border-red-300" : "border-gray-200"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5 shrink-0 pt-0.5">{index + 1}.</span>
                    <p className="text-sm font-semibold text-gray-800">
                        {question.question_text}
                        {question.is_required && <span className="ml-1 text-red-500">*</span>}
                    </p>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-500 shrink-0">
                    {QUESTION_TYPE_ICONS[question.question_type]}
                    {QUESTION_TYPE_LABELS[question.question_type] ?? question.question_type}
                </span>
            </div>

            <div className="pl-7">{renderInput()}</div>

            {error && <p className="pl-7 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function SurveyFormSection({ surveyId, questions = [], hasResponded, isClosed }) {
    const dispatch = useDispatch();
    const { submitting, submitError, submitted } = useSelector(
        (state) => state.post_event_surveys
    );

    const [answers, setAnswers] = useState({});
    const [errors, setErrors]   = useState({});

    const handleChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
        setErrors((prev) => ({ ...prev, [questionId]: null }));
    };

    const validate = () => {
        const newErrors = {};
        questions.forEach((q) => {
            if (!q.is_required) return;
            const val = answers[q.id];
            const isEmpty = val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0);
            if (isEmpty) newErrors[q.id] = "This question is required.";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        dispatch(submit_post_event_survey_thunk({ id: surveyId, answers }));
    };

    // Already submitted (from API or after submit)
    if (hasResponded || submitted) {
        return (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">✓</div>
                <h3 className="text-base font-semibold text-green-800">Response Already Submitted</h3>
                <p className="text-sm text-green-600">You have already completed this survey. Thank you!</p>
            </div>
        );
    }

    // Survey is closed
    if (isClosed) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center flex flex-col items-center gap-3">
                <h3 className="text-base font-semibold text-red-700">Survey Closed</h3>
                <p className="text-sm text-red-500">This survey is no longer accepting responses.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Questions ({questions.length})
            </h2>

            {questions.map((question, index) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id]}
                    onChange={(val) => handleChange(question.id, val)}
                    error={errors[question.id]}
                />
            ))}

            {questions.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                    {submitError && (
                        <p className="text-sm text-red-500">
                            {submitError?.errors
                                ? "Please fill in all required fields."
                                : submitError?.message ?? "Failed to submit. Please try again."}
                        </p>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                            {submitting ? "Submitting…" : "Submit Survey"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
