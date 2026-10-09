import { useEffect } from "react";
import { captureLeadAttribution } from "@/lib/leadAttribution";

export default function LeadAttributionTracker() {
    useEffect(() => {
        captureLeadAttribution();
    }, []);

    return null;
}
