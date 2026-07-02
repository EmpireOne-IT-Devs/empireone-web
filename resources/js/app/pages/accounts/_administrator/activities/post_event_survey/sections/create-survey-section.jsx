import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import Textarea from "@/app/_components/textarea";
import { create_post_event_survey_thunk } from "@/app/redux/post-event-survey-slice";
import { get_activity_posts_thunk } from "@/app/redux/activities-slice";
import { Folder, PlusCircleIcon, Trash2, GripVertical, Plus, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const QUESTION_TYPES = [
    { value: "short_answer", label: "Short Answer" },
    { value: "paragraph", label: "Paragraph" },
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "checkboxes", label: "Checkboxes" },
    { value: "dropdown", label: "Dropdown" },
    { value: "rating", label: "Rating (1–5)" },
];

const HAS_OPTIONS = new Set(["multiple_choice", "checkboxes", "dropdown"]);

const makeQuestion = () => ({
    id: Date.now(),
    question_type: "multiple_choice",
    question_text: "",
    is_required: false,
    options: ["Option 1"],
});

export default function CreateSurveySection() {
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.activities);
    const { creating, createError } = useSelector((state) => state.post_event_surveys);

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [activityPostId, setActivityPostId] = useState("");
    const [questions, setQuestions] = useState([makeQuestion()]);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (isOpen) dispatch(get_activity_posts_thunk());
    }, [isOpen, dispatch]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setActivityPostId("");
        setQuestions([makeQuestion()]);
        setFormError("");
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const addQuestion = () => setQuestions((prev) => [...prev, makeQuestion()]);

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

    const handleSubmit = async () => {
        setFormError("");
        if (!activityPostId) return setFormError("Please select an event.");
        if (!title.trim())   return setFormError("Survey title is required.");

        const payload = {
            activity_post_id: parseInt(activityPostId, 10),
            title,
            description,
            questions: questions.map((q, i) => ({
                question_text: q.question_text,
                question_type: q.question_type,
                is_required:   q.is_required,
                sort_order:    i,
                options:       HAS_OPTIONS.has(q.question_type) ? q.options : [],
            })),
        };

        const result = await dispatch(create_post_event_survey_thunk(payload));
        if (!result.error) handleClose();
    };

    // Only show published general/event type posts in dropdown
    const eventOptions = [
        { value: "", label: "Select an event" },
        ...posts
            .filter((p) => p.type === "general")
            .map((p) => ({ value: String(p.id), label: p.headline })),
    ];

    return (
        <div>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
                <PlusCircleIcon size={16} className="mr-2" />
                Create Survey
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
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
                            name="activity_post_id"
                            value={activityPostId}
                            onChange={(value) => setActivityPostId(value)}
                            options={eventOptions}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        {questions.map((q, index) => (
                            <div
                                key={q.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-4 shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <GripVertical size={16} className="text-gray-300 shrink-0" />
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Question {index + 1}
                                    </span>
                                    <div className="ml-auto flex items-center gap-2">
                                        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={q.is_required}
                                                onChange={(e) => updateQuestion(q.id, "is_required", e.target.checked)}
                                                className="rounded"
                                            />
                                            Required
                                        </label>
                                        {questions.length > 1 && (
                                            <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600 transition">
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <Input
                                            label="Question"
                                            name={`question_text_${q.id}`}
                                            value={q.question_text}
                                            onChange={(e) => updateQuestion(q.id, "question_text", e.target.value)}
                                        />
                                    </div>
                                    <div className="sm:w-48">
                                        <Select
                                            label="Answer Type"
                                            name={`question_type_${q.id}`}
                                            value={q.question_type}
                                            onChange={(value) => updateQuestion(q.id, "question_type", value)}
                                            options={QUESTION_TYPES}
                                        />
                                    </div>
                                </div>

                                {HAS_OPTIONS.has(q.question_type) && (
                                    <div className="flex flex-col gap-2 pl-2">
                                        {q.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => updateOption(q.id, i, e.target.value)}
                                                    className="flex-1 text-sm border-b border-gray-200 focus:border-blue-400 outline-none py-1 bg-transparent"
                                                    placeholder={`Option ${i + 1}`}
                                                />
                                                {q.options.length > 1 && (
                                                    <button onClick={() => removeOption(q.id, i)} className="text-gray-300 hover:text-red-400 transition">
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button onClick={() => addOption(q.id)} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1 transition">
                                            <Plus size={13} /> Add option
                                        </button>

                                        {/* Preview: show how the question will appear to respondents */}
                                        <div className="pt-3">
                                            {q.question_type === "multiple_choice" && (
                                                <div className="flex flex-col gap-2 text-sm text-gray-700">
                                                    {q.options.map((opt, i) => (
                                                        <label key={i} className="flex items-center gap-2">
                                                            <input type="radio" disabled className="accent-blue-500" />
                                                            {opt}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {q.question_type === "checkboxes" && (
                                                <div className="flex flex-col gap-2 text-sm text-gray-700">
                                                    {q.options.map((opt, i) => (
                                                        <label key={i} className="flex items-center gap-2">
                                                            <input type="checkbox" disabled className="accent-blue-500 rounded" />
                                                            {opt}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {q.question_type === "dropdown" && (
                                                <div>
                                                    <select disabled className="w-full rounded-lg border px-3 py-2 text-sm bg-white border-gray-200">
                                                        <option value="">Select an option</option>
                                                        {q.options.map((opt, i) => (
                                                            <option key={i} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {q.question_type === "rating" && (
                                    <div className="flex gap-2 pl-2">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <div key={n} className="w-8 h-8 rounded-md flex items-center justify-center text-gray-300">
                                                <Star size={16} />
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

                    {(formError || createError) && (
                        <p className="text-sm text-red-500">{formError || createError?.message || "Failed to publish survey."}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <Button variant="secondary" outlined onClick={handleClose} disabled={creating}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>
                            Publish Survey
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

