import { Upload, Paperclip } from "lucide-react";
import React from "react";

// ── Icon helpers ──────────────────────────────────────────────────────────────
export const PersonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

// ── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, value, icon, type = "text", options, editing, onChange }) {
    const base =
        "w-full bg-white/60 border border-white/80 rounded-xl px-3 py-2.5 text-sm text-slate-800 " +
        "placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 " +
        "transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</label>
            <div className="relative flex items-center">
                {icon && (
                    <span className="absolute left-3 text-slate-400 pointer-events-none">{icon}</span>
                )}
                {options ? (
                    <select
                        disabled={!editing}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`${base} ${icon ? "pl-8" : "pl-3"} appearance-none`}
                    >
                        <option value="">Select…</option>
                        {options.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        disabled={!editing}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter ${label.replace(" *", "").toLowerCase()}`}
                        className={`${base} ${icon ? "pl-8" : "pl-3"}`}
                    />
                )}
            </div>
        </div>
    );
}

// ── FileUploadField ───────────────────────────────────────────────────────────
export function FileUploadField({ label, description, accept, editing, fileName, onChange }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</label>
            <div
                className={`relative flex items-center gap-3 border rounded-xl px-3 py-2.5 transition-all duration-200
                    ${editing
                        ? "bg-white/60 border-dashed border-indigo-300 hover:border-indigo-400"
                        : "bg-white/40 border-white/80 opacity-60 cursor-not-allowed"
                    }`}
            >
                <Paperclip size={14} className="text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                    {fileName
                        ? <span className="text-sm text-slate-700 font-medium truncate block">{fileName}</span>
                        : <span className="text-sm text-slate-400">{description}</span>
                    }
                </div>
                {editing && (
                    <label className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1 cursor-pointer hover:bg-indigo-100 transition-colors shrink-0">
                        <Upload size={11} />
                        Browse
                        <input
                            type="file"
                            accept={accept}
                            className="hidden"
                            onChange={(e) => onChange(e.target.files?.[0]?.name || "")}
                        />
                    </label>
                )}
            </div>
        </div>
    );
}

// ── SectionCard ───────────────────────────────────────────────────────────────
const accents = {
    indigo:  "from-indigo-50/80 to-white/60 border-indigo-100",
    emerald: "from-emerald-50/80 to-white/60 border-emerald-100",
    violet:  "from-violet-50/80 to-white/60 border-violet-100",
    amber:   "from-amber-50/80 to-white/60 border-amber-100",
    sky:     "from-sky-50/80 to-white/60 border-sky-100",
    rose:    "from-rose-50/80 to-white/60 border-rose-100",
};
const iconColors = {
    indigo:  "text-indigo-600",
    emerald: "text-emerald-600",
    violet:  "text-violet-600",
    amber:   "text-amber-600",
    sky:     "text-sky-600",
    rose:    "text-rose-600",
};

export function SectionCard({ title, icon, accent, children }) {
    return (
        <div className={`rounded-2xl border bg-gradient-to-br ${accents[accent]} backdrop-blur-sm p-6 shadow-sm`}>
            <div className="flex items-center gap-2 mb-5">
                <span className={iconColors[accent]}>{icon}</span>
                <h3 className="text-sm font-bold text-slate-700 tracking-tight">{title}</h3>
            </div>
            {children}
        </div>
    );
}