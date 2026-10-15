import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { get_applicants_thunk } from "@/app/redux/job-posting-thunk";
import { add_notes_application_service } from "@/app/services/employee-relation-service";
import store from "@/app/store/store";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    FcApproval,
    FcBriefcase,
    FcDocument,
    FcManager,
    FcRules
} from "react-icons/fc";
import { FiCheck, FiCopy, FiExternalLink, FiEye, FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";

export default function ShowApplicantDetailsSection({ data }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [selectedStage, setSelectedStage] = useState("Initial Interview");
    const [submitting, setSubmitting] = useState(false);

    const dispatch = useDispatch();

    const personal = data?.applicant?.personal_information;
    const jobReq = data?.job_posting?.job_requisition;
    const resume = data?.applicant?.resume;

    // Synchronize dynamic notes from backend whenever 'data' changes or modal opens
    useEffect(() => {
        if (data?.notes) {
            try {
                const parsedNotes = typeof data.notes === "string" ? JSON.parse(data.notes) : data.notes;
                setNotes(Array.isArray(parsedNotes) ? parsedNotes : []);
            } catch (e) {
                setNotes([]);
            }
        } else {
            setNotes([]);
        }
    }, [data]);

    const handleCopyEmail = () => {
        if (data?.applicant?.email) {
            navigator.clipboard.writeText(data.applicant.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim() || submitting) return;

        setSubmitting(true);

        try {
            await add_notes_application_service({
                id: data?.id,
                stage: selectedStage,
                text: newNote,
            });

            // Refresh applicants state across the Redux store
            await store.dispatch(get_applicants_thunk());

            setNewNote("");

            dispatch(
                setAlert({
                    type: "success",
                    title: "Note Added",
                    message: "Interview note saved successfully.",
                    open: true,
                })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to Add Note",
                    message:
                        error?.response?.data?.message ||
                        error?.message ||
                        "Something went wrong",
                    open: true,
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Button
                className="w-full transition-all duration-200 hover:shadow-md"
                outlined
                onClick={() => setOpen(true)}
            >
                <FiEye className="w-4 h-4 mr-2" />
                SHOW
            </Button>

            <Modal
                width="max-w-7xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 shrink-0">
                            <FcManager size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                                Applicant Dossier
                            </p>
                            <h2 className="text-lg font-bold text-gray-800 leading-snug">
                                {personal?.first_name} {personal?.middle_name || ""}{" "}
                                {personal?.last_name}
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300 max-h-[75vh] overflow-y-auto pr-1">
                    {/* Left Column (4/6): Applicant Details */}
                    <div className="w-full lg:w-4/6 space-y-5 text-sm text-gray-700">
                        {/* Position Details */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold uppercase text-xs tracking-wider">
                                <FcBriefcase size={20} />
                                <span>Position Details</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Job Title</span>
                                    <p className="font-semibold text-gray-800">{jobReq?.title || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Department</span>
                                    <p className="font-semibold text-gray-800">{jobReq?.department?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Location</span>
                                    <p className="font-semibold text-gray-800">{jobReq?.location?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Source / Referral</span>
                                    <p className="font-semibold text-gray-800">
                                        {data?.source || "Direct"}{" "}
                                        {data?.referral && `- ${data.referral.first_name} ${data.referral.last_name}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Personal & Contact Info */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold uppercase text-xs tracking-wider">
                                <FcApproval size={20} />
                                <span>Personal & Contact Details</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Gender & Age</span>
                                    <p className="font-semibold text-gray-800">
                                        {personal?.gender || "N/A"} •{" "}
                                        {personal?.date_of_birth
                                            ? `${moment().diff(personal.date_of_birth, "years")} yrs`
                                            : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Date of Birth</span>
                                    <p className="font-semibold text-gray-800">
                                        {personal?.date_of_birth
                                            ? moment(personal.date_of_birth).format("LL")
                                            : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Email</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-800 truncate">{data?.applicant?.email || "N/A"}</span>
                                        {data?.applicant?.email && (
                                            <button
                                                onClick={handleCopyEmail}
                                                className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                                                title="Copy email"
                                            >
                                                {copied ? <FiCheck className="w-3.5 h-3.5 text-green-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Contact Number</span>
                                    <p className="font-semibold text-gray-800">{personal?.contact || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">BPO Experience</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {data?.applicant?.account_employee?.with_bpo ? "With Experience" : "No Experience"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Marital Status</span>
                                    <p className="font-semibold text-gray-800">{personal?.marital_status || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address & Extra Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {personal?.previous_employee_status && (
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-1">
                                        Previous Employee Dept
                                    </span>
                                    <p className="font-medium capitalize text-gray-800">
                                        {personal.previous_employee_status}
                                    </p>
                                </div>
                            )}

                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-1">
                                    Birth Place
                                </span>
                                <p className="font-medium capitalize text-gray-800">
                                    {personal?.birth_place || "N/A"}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm sm:col-span-2">
                                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-1">
                                    Current Address
                                </span>
                                <p className="font-medium capitalize text-gray-800">
                                    {[personal?.street, personal?.city, personal?.province, personal?.zip_code, personal?.region]
                                        .filter(Boolean)
                                        .join(", ") || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Resume / CV Download Card */}
                        {resume?.url && (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={resume.url}
                                className="group bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-400 p-4 rounded-2xl flex items-center justify-between transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                                        <FcDocument size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                                            Attached Resume / CV
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[280px]">
                                            {resume.name || "Download Resume"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                                    <span>View File</span>
                                    <FiExternalLink className="w-4 h-4" />
                                </div>
                            </a>
                        )}
                    </div>

                    {/* Right Column (2/6): Dynamic Recruiter Evaluation Notes */}
                    <div className="w-full lg:w-2/6 flex flex-col bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                            <div className="flex items-center gap-2 text-gray-800 font-bold">
                                <FcRules size={20} />
                                <span>Recruiter Evaluation</span>
                            </div>
                            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                Internal Tracking
                            </span>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">
                            Document and maintain interview feedback at every recruitment stage.
                        </p>

                        {/* Note Input Form */}
                        <form onSubmit={handleAddNote} className="space-y-3 mb-5">
                            <div>
                                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                                    Interview Stage
                                </label>
                                <select
                                    value={selectedStage}
                                    onChange={(e) => setSelectedStage(e.target.value)}
                                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <option value="Initial Interview">Initial Interview</option>
                                    <option value="Technical Assessment">Technical Assessment</option>
                                    <option value="Final Interview">Final Interview</option>
                                    <option value="General Note">General Note</option>
                                </select>
                            </div>

                            <div>
                                <textarea
                                    rows="3"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Type evaluation notes here..."
                                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                <FiPlus className="w-4 h-4" />
                                {submitting ? "Saving..." : "Add Note Entry"}
                            </button>
                        </form>

                        {/* Dynamic Notes List */}
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
                            {notes.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                                    <p className="text-xs text-gray-400 font-medium">No interview notes recorded yet.</p>
                                </div>
                            ) : (
                                notes.map((note, index) => (
                                    <div
                                        key={note.id || index}
                                        className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs space-y-1.5 hover:border-blue-200 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md text-[10px]">
                                                {note.stage}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {note.created_at || note.createdAt
                                                    ? moment(note.created_at || note.createdAt).format("MMM D, h:mm a")
                                                    : "Just now"}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{note.text}</p>
                                        {note.author && (
                                            <p className="text-[10px] text-gray-400 italic text-right">
                                                — {note.author}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}