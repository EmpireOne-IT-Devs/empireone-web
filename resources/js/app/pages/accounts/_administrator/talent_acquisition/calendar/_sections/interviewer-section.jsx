import React, { useState } from "react";

export default function InterviewerSection() {
    // 1. Manage the list of interviewers in state
    const [interviewers, setInterviewers] = useState([
        { id: 1, name: "Juna", schedule: "Monday to Friday 1pm - 9pm" },
        { id: 2, name: "Johanna", schedule: "Monday to Friday 8am - 5pm" },
    ]);

    // 2. State for the "Add New" form
    const [isAdding, setIsAdding] = useState(false);
    const [newInterviewer, setNewInterviewer] = useState({
        name: "",
        schedule: "",
    });

    // 3. Handlers for interaction
    const handleDelete = (id) => {
        setInterviewers(interviewers.filter((person) => person.id !== id));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newInterviewer.name || !newInterviewer.schedule) return;

        const newEntry = {
            id: Date.now(), // Generate a simple unique ID
            name: newInterviewer.name,
            schedule: newInterviewer.schedule,
        };

        setInterviewers([...interviewers, newEntry]);
        setNewInterviewer({ name: "", schedule: "" }); // Reset form
        setIsAdding(false); // Close form
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Header Area */}
            <div className="flex flex-col  justify-between items-start sm:items-center  gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Interviewer Schedule
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage interviewer availability slots or assign upcoming
                        interviews.
                    </p>
                </div>
            </div>

            <div className="flex w-full items-end justify-end">
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 w-52 text-center justify-center py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        ></path>
                    </svg>
                    {isAdding ? "Cancel" : "Add Interviewer"}
                </button>
            </div>
            {/* Inline Add Form */}
            {isAdding && (
                <form
                    onSubmit={handleAdd}
                    className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-2"
                >
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Marcus"
                            value={newInterviewer.name}
                            onChange={(e) =>
                                setNewInterviewer({
                                    ...newInterviewer,
                                    name: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            required
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Schedule
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Mon to Wed 9am - 3pm"
                            value={newInterviewer.schedule}
                            onChange={(e) =>
                                setNewInterviewer({
                                    ...newInterviewer,
                                    schedule: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full md:w-auto"
                    >
                        Save
                    </button>
                </form>
            )}

            {/* List Area */}
            <div className="flex flex-col gap-3">
                {interviewers.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                        No interviewers scheduled.
                    </div>
                ) : (
                    interviewers.map((person) => (
                        <div
                            key={person.id}
                            className="group flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center">
                                    {person.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        {person.name}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                        <svg
                                            className="w-3.5 h-3.5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                        </svg>
                                        {person.schedule}
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button (appears on hover on desktop) */}
                            <button
                                onClick={() => handleDelete(person.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                                title="Remove interviewer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
