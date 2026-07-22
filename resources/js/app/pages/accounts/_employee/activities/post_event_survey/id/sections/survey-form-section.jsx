import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submit_post_event_survey_thunk } from "@/app/redux/post-event-survey-slice";
import {
  Type,
  AlignLeft,
  Circle,
  CheckSquare,
  ChevronDown,
  Star,
  CheckCircle2,
  Lock,
} from "lucide-react";

const META = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`;
const sans = { fontFamily: "'Inter', sans-serif" };
const label = { fontFamily: "'IBM Plex Mono', monospace" };
const ratingLabels = {
    1: "Very Poor",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent",
};
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
      <span className="text-[11px] uppercase tracking-wider" style={label}>
        {meta.name}
      </span>
    </span>
  );
}

// ── Input components ──────────────────────────────────────────────────────
function ShortAnswerInput({ value, onChange, hasError }) {
    return (
        <div className="max-w-lg">
            <div
                className={`rounded-xl border bg-white transition-all ${
                    hasError
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-zinc-200 hover:border-zinc-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
                }`}
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
            </div>
        </div>
    );
}
function ParagraphInput({ value, onChange, hasError }) {
    return (
        <div className="max-w-2xl">
            <div
                className={`rounded-xl border bg-white transition-all ${
                    hasError
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-zinc-200 hover:border-zinc-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
                }`}
            >
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={5}
                    className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />

                <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2">
                    <p className="text-xs text-zinc-400">
                        Write a detailed response
                    </p>

                    <span className="text-xs text-zinc-400">
                        {value.length} characters
                    </span>
                </div>
            </div>
        </div>
    );
}
function MultipleChoiceInput({ options, value, onChange, hasError, name }) {
  return (
    <div className={`flex flex-col gap-2.5 ${hasError ? "rounded-md border border-red-300 bg-red-50 p-3" : ""}`}>
      {options.map((opt) => (
        <label key={opt.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
          <input
            type="radio"
            name={name}
            checked={value === opt.option_text}
            onChange={() => onChange(opt.option_text)}
            className="h-4 w-4 accent-indigo-600"
          />
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
    <div className={`flex flex-col gap-2.5 ${hasError ? "rounded-md border border-red-300 bg-red-50 p-3" : ""}`}>
      {options.map((opt) => (
        <label key={opt.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={value.includes(opt.option_text)}
            onChange={() => toggle(opt.option_text)}
            className="h-4 w-4 rounded accent-indigo-600"
          />
          {opt.option_text}
        </label>
      ))}
    </div>
  );
}

function DropdownInput({ options, value, onChange, hasError }) {
  return (
    <div className="relative max-w-xs">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition ${
          hasError ? "border-red-400" : "border-zinc-300 focus:border-indigo-500"
        }`}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.option_text}>
            {opt.option_text}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}
function RatingInput({ value, onChange, hasError }) {
    const rating = Number(value) || 0;

    return (
        <div
            className={`rounded-xl border p-4 transition ${
                hasError
                    ? "border-red-300 bg-red-50"
                    : "border-zinc-200 bg-white"
            }`}
        >
            <div className="mb-3 flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>Poor</span>
                <span>Excellent</span>
            </div>

            <div className="flex items-center justify-center gap-56">
                {[1, 2, 3, 4, 5].map((n) => {
                    const active = rating >= n;

                    return (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onChange(String(n))}
                            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                            className="rounded-full p-1 transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                        >
                            <Star
                                size={32}
                                strokeWidth={1.75}
                                className={`transition-colors ${
                                    active
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-zinc-300 hover:text-yellow-300"
                                }`}
                            />
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 text-center">
                {rating > 0 ? (
                    <>
                        <p className="text-sm font-semibold text-zinc-800">
                            {ratingLabels[rating]}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                            {rating} of 5 stars
                        </p>
                    </>
                ) : (
                    <p className="text-xs text-zinc-400">
                        Select a rating
                    </p>
                )}
            </div>
        </div>
    );
}
// ── Question row ─────────────────────────────────────────────────────────

function QuestionRow({ question, index, isLast, answer, onChange, error }) {
  const renderInput = () => {
    switch (question.question_type) {
      case "short_answer":
        return <ShortAnswerInput value={answer ?? ""} onChange={onChange} hasError={!!error} />;
      case "paragraph":
        return <ParagraphInput value={answer ?? ""} onChange={onChange} hasError={!!error} />;
      case "multiple_choice":
        return (
          <MultipleChoiceInput
            options={question.options}
            value={answer ?? ""}
            onChange={onChange}
            hasError={!!error}
            name={`q-${question.id}`}
          />
        );
      case "checkboxes":
        return <CheckboxesInput options={question.options} value={answer ?? []} onChange={onChange} hasError={!!error} />;
      case "dropdown":
        return <DropdownInput options={question.options} value={answer ?? ""} onChange={onChange} hasError={!!error} />;
      case "rating":
        return <RatingInput value={answer ?? ""} onChange={onChange} hasError={!!error} />;
      default:
        return null;
    }
  };

  const badgeClass = error
    ? "border-red-300 bg-red-50 text-red-600"
    : question.is_required
    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
    : "border-zinc-300 bg-white text-zinc-500";

  return (
    <div className={`relative flex gap-4 py-5 ${isLast ? "" : "border-b border-zinc-100"}`}>
      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${badgeClass}`}
        style={sans}
      >
        {index + 1}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
          <p className="text-[15px] font-medium leading-snug text-zinc-900" style={sans}>
            {question.question_text}
            {question.is_required && <span className="ml-1 text-indigo-500">*</span>}
          </p>
          <TypeCaption type={question.question_type} />
        </div>

        <div className="mt-3">{renderInput()}</div>

        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

// ── Status states ───────────────────────────────────────────────────────

function StatusPanel({ icon: Icon, tone, title, message }) {
  const toneClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    zinc: "bg-zinc-100 text-zinc-500",
  };
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-zinc-200 bg-white py-14 text-center" style={sans}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${toneClasses[tone]}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3 className="text-[15px] font-semibold text-zinc-900">{title}</h3>
      <p className="max-w-xs text-sm text-zinc-500">{message}</p>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────

export default function SurveyFormSection({ surveyId, questions = [], hasResponded, isClosed }) {
  const dispatch = useDispatch();
  const { submitting, submitError, submitted } = useSelector((state) => state.post_event_surveys);

  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

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

  if (hasResponded || submitted) {
    return (
      <StatusPanel
        icon={CheckCircle2}
        tone="emerald"
        title="Response already submitted"
        message="You have already completed this survey. Thank you for your feedback."
      />
    );
  }

  if (isClosed) {
    return (
      <StatusPanel
        icon={Lock}
        tone="zinc"
        title="Survey closed"
        message="This survey is no longer accepting responses."
      />
    );
  }

  const requiredCount = questions.filter((q) => q.is_required).length;

  return (
    <div className="w-full bg-white p-4 rounded-md" style={sans}>
      <style>{META}</style>

      <div className="flex items-baseline justify-between border-b border-zinc-200 pb-4">
        <h2 className="text-lg font-semibold text-zinc-900">Questions</h2>
        <p className="text-sm text-zinc-500">
          {questions.length} question{questions.length === 1 ? "" : "s"}
          {requiredCount > 0 && (
            <>
              {" "}
              <span className="text-zinc-300">·</span> <span className="text-indigo-500">{requiredCount} required</span>
            </>
          )}
        </p>
      </div>

      <div className="relative">
        <div className="absolute bottom-5 left-4 top-5 w-px bg-zinc-200" aria-hidden="true" />
        {questions.map((question, index) => (
          <QuestionRow
            key={question.id}
            question={question}
            index={index}
            isLast={index === questions.length - 1}
            answer={answers[question.id]}
            onChange={(val) => handleChange(question.id, val)}
            error={errors[question.id]}
          />
        ))}
      </div>

      {questions.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-5">
          {submitError && (
            <p className="text-sm text-red-500">
              {submitError?.errors ? "Please fill in all required fields." : submitError?.message ?? "Failed to submit. Please try again."}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit survey"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}