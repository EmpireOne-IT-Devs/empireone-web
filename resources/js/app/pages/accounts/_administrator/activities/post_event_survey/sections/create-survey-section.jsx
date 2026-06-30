import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import Textarea from "@/app/_components/textarea";
import { Folder, PlusCircleIcon, Trash2, GripVertical, Plus } from "lucide-react";
import React, { useState } from "react";

const QUESTION_TYPES = [
    { value: "short_answer", label: "Short Answer" },
    { value: "paragraph", label: "Paragraph" },
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "checkboxes", label: "Checkboxes" },
    { value: "dropdown", label: "Dropdown" },
    { value: "rating", label: "Rating (1–5)" },
];

const defaultQuestion = () => ({
    id: Date.now(),
    type: "multiple_choice",
    question: "",
    required: false,
    options: ["Option 1"],
});

export default function CreateSurveySection() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [event, setEvent] = useState("");
    const [questions, setQuestions] = useState([defaultQuestion()]);

    const addQuestion = () => setQuestions((prev) => [...prev, defaultQuestion()]);

    const removeQuestion = (id) =>
        setQuestions((prev) => prev.filter((q) => q.id !== id));

    const updateQuestion = (id, field, value) =>
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
        );

    const addOption = (id) =>
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id
                    ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
                    : q
            )
        );

    const updateOption = (id, index, value) =>
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id
                    ? { ...q, options: q.options.map((o, i) => (i === index ? value : o)) }
                    : q
            )
        );

    const removeOption = (id, index) =>
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id
                    ? { ...q, options: q.options.filter((_, i) => i !== index) }
                    : q
            )
        );

    const hasOptions = (type) =>
        ["multiple_choice", "checkboxes", "dropdown"].includes(type);

    return (
        <div>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
                <PlusCircleIcon size={16} className="mr-2" />
                Create Survey
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                width="max-w-3xl"
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 shrink-0">
                            <Folder size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Activities / Post Event Survey
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Event Survey Creation
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col gap-5 overflow-y-auto pb-4">
            
                    <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-4 bg-gray-50">
                        <Input
                            label="Survey Title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <Textarea
                            label="Description (optional)"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />
                        <Select
                            label="Link to Event"
                            name="event"
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                            options={[
                                { value: "", label: "Select an event" },
                                { value: "1", label: "Q3 Townhall Meeting" },
                                { value: "2", label: "New Health Benefits Rollout" },
                                { value: "3", label: "Annual Company Picnic" },
                                { value: "4", label: "Return to Office Preferences" },
                                { value: "5", label: "Engineering Team Hackathon" },
                            ]}
                        />
                    </div>

                    {/* Questions */}
                    <div className="flex flex-col gap-3">
                        {questions.map((q, index) => (
                            <div
                                key={q.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-4 shadow-sm"
                            >
                                {/* Question Header */}
                                <div className="flex items-center gap-2">
                                    <GripVertical size={16} className="text-gray-300 shrink-0" />
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Question {index + 1}
                                    </span>
                                    <div className="ml-auto flex items-center gap-2">
                                        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={q.required}
                                                onChange={(e) =>
                                                    updateQuestion(q.id, "required", e.target.checked)
                                                }
                                                className="rounded"
                                            />
                                            Required
                                        </label>
                                        {questions.length > 1 && (
                                            <button
                                                onClick={() => removeQuestion(q.id)}
                                                className="text-red-400 hover:text-red-600 transition"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Question Text + Type */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <Input
                                            label="Question"
                                            name={`question_${q.id}`}
                                            value={q.question}
                                            onChange={(e) =>
                                                updateQuestion(q.id, "question", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="sm:w-48">
                                        <Select
                                            label="Answer Type"
                                            name={`type_${q.id}`}
                                            value={q.type}
                                            onChange={(e) =>
                                                updateQuestion(q.id, "type", e.target.value)
                                            }
                                            options={QUESTION_TYPES}
                                        />
                                    </div>
                                </div>

                                {hasOptions(q.type) && (
                                    <div className="flex flex-col gap-2 pl-2">
                                        {q.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) =>
                                                        updateOption(q.id, i, e.target.value)
                                                    }
                                                    className="flex-1 text-sm border-b border-gray-200 focus:border-blue-400 outline-none py-1 bg-transparent"
                                                    placeholder={`Option ${i + 1}`}
                                                />
                                                {q.options.length > 1 && (
                                                    <button
                                                        onClick={() => removeOption(q.id, i)}
                                                        className="text-gray-300 hover:text-red-400 transition"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addOption(q.id)}
                                            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1 transition"
                                        >
                                            <Plus size={13} /> Add option
                                        </button>
                                    </div>
                                )}

                                {/* Rating preview */}
                                {q.type === "rating" && (
                                    <div className="flex gap-2 pl-2">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <div
                                                key={n}
                                                className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-xs text-gray-400"
                                            >
                                                {n}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addQuestion}
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition"
                    >
                        <Plus size={16} /> Add Question
                    </button>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <Button variant="secondary" outlined onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary">
                            Publish Survey
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

