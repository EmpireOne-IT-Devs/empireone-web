import React, { useRef, useState } from "react";
import { Download } from "lucide-react";
import Button from "@/app/_components/button";

export function LiabilityDownload({ form }) {
    const inFlight = useRef(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const download = async () => {
        if (inFlight.current) return;
        inFlight.current = true;
        setLoading(true);
        setError("");
        try {
            const [{ pdf }, { LiabilityPdf }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("./liability-pdf"),
            ]);
            const blob = await pdf(<LiabilityPdf form={form} logo={`${window.location.origin}/images/eo-full-logo.png`} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${form.id}-${form.source === "paper" ? "paper-transcription" : "asset-accountability"}.pdf`;
            document.body.append(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
            setError("Unable to generate the PDF. Please try again.");
        } finally {
            inFlight.current = false;
            setLoading(false);
        }
    };

    return (
        <div>
            <Button type="button" variant="secondary" outlined loading={loading} onClick={download}>
                <Download size={16} aria-hidden="true" />
                {form.source === "paper" ? "Download transcription PDF" : "Download PDF"}
            </Button>
            {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        </div>
    );
}
