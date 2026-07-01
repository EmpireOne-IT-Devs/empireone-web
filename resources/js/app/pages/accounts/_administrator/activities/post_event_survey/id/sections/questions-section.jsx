import React from "react";
import { CheckSquare, AlignLeft, ChevronDown, Star, Type } from "lucide-react";

const QUESTION_TYPE_LABELS = {
    short_answer: "Short Answer",
    paragraph: "Paragraph",
    multiple_choice: "Multiple Choice",
    checkboxes: "Checkboxes",
    dropdown: "Dropdown",
    rating: "Rating (1\u20135)",
};

const QUESTION_TYPE_ICONS = {
    short_answer: <Type size={14} />,
    paragraph: <AlignLeft size={14} />,
    multiple_choice: <CheckSquare size={14} />,
    checkboxes: <CheckSquare size={14} />,
    dropdown: <ChevronDown size={14} />,
    rating: <Star size={14} />,
};

function QuestionCard({ question, index }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5 shrink-0 pt-0.5">
                        {index + 1}.
                    </span>
                    <p className="text-sm font-semibold text-gray-800">
                        {question.question_text}
                        {question.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </p>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-500 shrink-0">
                    {QUESTION_TYPE_ICONS[question.question_type]}
                    {QUESTION_TYPE_LABELS[question.question_type] ?? question.question_type}
                </span>
            </div>

            {question.options?.length > 0 && (
                <div className="flex flex-col gap-1.5 pl-7">
                    {question.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                            {opt.option_text}
                        </div>
                    ))}
                </div>
            )}

            {question.question_type === "rating" && (
                <div className="flex gap-2 pl-7">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-xs text-gray-400">
                            {n}
                        </div>
                    ))}
                </div>
            )}

            {(question.question_type === "short_answer" || question.question_type === "paragraph") && (
                <div className="pl-7">
                    <div className={`rounded-md border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400 px-3 py-2 ${question.question_type === "paragraph" ? "h-16" : ""}`}>
                        {question.question_type === "paragraph" ? "Long text response\u2026" : "Short text response\u2026"}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function QuestionsSection({ questions = [] }) {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Questions ({questions.length})
            </h2>

            {questions.length === 0 && (
                <p className="text-sm text-gray-400">No questions found for this survey.</p>
            )}

            {questions.map((question, index) => (
                <QuestionCard key={question.id} question={question} index={index} />
            ))}
        </div>
    );
}
