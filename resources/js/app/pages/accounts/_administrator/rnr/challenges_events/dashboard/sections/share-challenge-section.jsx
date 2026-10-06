import React, { useEffect, useRef, useState } from "react";
import { Link2, Check } from "lucide-react";

export default function ShareChallengeSection({ challenge }) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleCopy = async () => {
        const url = `${window.location.origin}/accounts/employee/rnr/challenge_event?challenge=${challenge.id}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt("Copy challenge link:", url);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`p-1 rounded-full transition-colors ${
                copied
                    ? "bg-emerald-50 text-emerald-500"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            aria-label="Copy challenge link"
            title={copied ? "Link copied!" : "Copy challenge link"}
        >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
        </button>
    );
}
