import React, { useState, useRef } from "react";
import { Award, Printer, Download, ShieldCheck, Search, Loader2 } from "lucide-react";

// Sample Certificate Data
const SAMPLE_CERTIFICATES = [
    {
        id: "cert_01",
        certificate_number: "CERT-2026-8841",
        recipient_name: "Sarah Jenkins",
        recipient_role: "Senior Product Designer",
        department: "UX & Design Team",
        award_title: "Excellence in Innovation",
        category: "Innovation & Creativity",
        pointsAwarded: 250,
        message:
            "For exceptional leadership during the Q1 UI Redesign project and driving human-centered design principles across all squads.",
        company_name: "EMPIREONECX",
        badge_variant: "warning",
        left_side_name: "Giovanni Yap",
        left_side_title: "Executive Director",
        right_side_name: "Fawad Nasir",
        right_side_title: "CEO",
    },
    {
        id: "cert_02",
        certificate_number: "CERT-2026-4912",
        recipient_name: "Alex Rivera",
        recipient_role: "Full Stack Developer",
        department: "Engineering",
        award_title: "Star Performer of the Month",
        category: "Excellence",
        pointsAwarded: 500,
        message:
            "Recognized for outstanding technical contribution and resolving critical infrastructure performance bottlenecks under extreme deadlines.",
        company_name: "EMPIREONECX",
        badge_variant: "primary",
        left_side_name: "Giovanni Yap",
        left_side_title: "Executive Director",
        right_side_name: "Fawad Nasir",
        right_side_title: "CEO",
    },
];

// Print CSS injected once, as a plain <style> tag (no styled-jsx dependency needed).
const PRINT_STYLES = `
@media print {
    body * {
        visibility: hidden;
    }
    #printable-certificate,
    #printable-certificate * {
        visibility: visible;
    }
    #printable-certificate {
        position: absolute;
        left: 0;
        top: 0;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: avoid;
    }
    @page {
        size: A4 landscape;
        margin: 0;
    }
}
`;

export default function CertificateRewardSection({
    certificates = SAMPLE_CERTIFICATES,
    hideList = false,
}) {
    const [selectedCert, setSelectedCert] = useState(certificates[0] || null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const certificateRef = useRef(null);

    const filteredCertificates = certificates.filter(
        (cert) =>
            (cert.recipient_name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (cert.award_title || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (cert.certificate_number || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const handlePrint = () => {
        window.print();
    };

    // Real PDF download: renders the certificate DOM node to a canvas, then
    // drops that image into a landscape A4 PDF and triggers a file download.
    // Requires: npm install html2canvas jspdf
    const handleDownloadPDF = async () => {
        if (!certificateRef.current || !selectedCert) return;
        setIsDownloading(true);
        try {
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import("html2canvas"),
                import("jspdf"),
            ]);

            const canvas = await html2canvas(certificateRef.current, {
                scale: 3, // higher resolution export
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");

            // A4 landscape in mm
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
            pdf.save(
                `${selectedCert.certificate_number || "certificate"}.pdf`,
            );
        } catch (err) {
            console.error("PDF generation failed:", err);
            // Fall back to the browser print dialog if the libraries aren't installed
            window.print();
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <style>{PRINT_STYLES}</style>

            {/* Header & Controls Section */}
            {!hideList && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Award className="text-purple-600" size={24} />
                            Reward Certificates
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            View, print, and verify issued achievement
                            certificates
                        </p>
                    </div>

                    {/* Quick Search */}
                    <div className="relative min-w-[260px]">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search certificate or recipient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 print:block">
                {/* Certificate List (Left Side) */}
                {!hideList && (
                    <div className="lg:col-span-4 space-y-3 max-h-[720px] overflow-y-auto pr-1 print:hidden">
                        {filteredCertificates.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                                <Award
                                    className="mx-auto text-gray-300 mb-2"
                                    size={32}
                                />
                                <p className="text-sm font-medium text-gray-600">
                                    No certificates found
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Try tweaking your search term
                                </p>
                            </div>
                        ) : (
                            filteredCertificates.map((cert) => {
                                const isSelected = selectedCert?.id === cert.id;
                                return (
                                    <div
                                        key={cert.id}
                                        onClick={() => setSelectedCert(cert)}
                                        className={`group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                                            isSelected
                                                ? "border-purple-500 bg-purple-50/50 shadow-sm"
                                                : "border-gray-100 bg-white hover:border-purple-200 hover:shadow-xs"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold border border-purple-200 shrink-0">
                                                    <Award size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                        {cert.award_title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {cert.recipient_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-500">
                                            <span className="truncate">
                                                {cert.department}
                                            </span>
                                            <span className="font-semibold text-amber-600">
                                                +{cert.pointsAwarded} pts
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Certificate Preview Viewer (Right Side) */}
                <div
                    className={
                        hideList
                            ? "lg:col-span-12"
                            : "lg:col-span-8 print:w-full"
                    }
                >
                    {selectedCert ? (
                        <div className="space-y-4">
                            {/* Actions Header */}
                            <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-gray-100 shadow-xs print:hidden">
                                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                                    <ShieldCheck
                                        size={16}
                                        className="text-purple-600"
                                    />
                                    <span>
                                        ID: {selectedCert.certificate_number}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrint}
                                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-2xs"
                                    >
                                        <Printer size={14} />
                                        Print
                                    </button>
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={isDownloading}
                                        className="flex items-center gap-1.5 rounded-lg border border-purple-600 bg-purple-600 px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                                    >
                                        {isDownloading ? (
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Download size={14} />
                                        )}
                                        {isDownloading
                                            ? "Preparing..."
                                            : "Download PDF"}
                                    </button>
                                </div>
                            </div>

                            {/*
                             * ─────────────────────────────────────────────────────────────────
                             * PROFESSIONAL PRINTABLE CERTIFICATE
                             * ─────────────────────────────────────────────────────────────────
                             */}
                            <div
                                id="printable-certificate"
                                ref={certificateRef}
                                className="relative bg-white text-slate-900 overflow-hidden shadow-2xl border-2 border-slate-600 rounded-sm select-none"
                                style={{
                                    aspectRatio: "297 / 210",
                                    width: "100%",
                                }}
                            >
                                {/* Outer Vintage Gold/Bronze Border Ring */}
                                <div className="absolute inset-3 border-2 border-purple-600/40 pointer-events-none z-10" />
                                <div className="absolute inset-4 border border-purple-500/20 pointer-events-none z-10" />

                                {/* Decorative Corner Ornaments */}
                                {[
                                    "top-5 left-5 border-t-2 border-l-2",
                                    "top-5 right-5 border-t-2 border-r-2",
                                    "bottom-5 left-5 border-b-2 border-l-2",
                                    "bottom-5 right-5 border-b-2 border-r-2",
                                ].map((className, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute w-8 h-8 border-purple-600 z-20 pointer-events-none ${className}`}
                                    />
                                ))}

                                {/* ── CERTIFICATE CONTENT CONTAINER ── */}
                                <div className="relative z-30 h-full flex flex-col justify-between p-[6%] text-center box-border">
                                    {/* ── TOP: Logo & Company Header ── */}
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="h-10 flex items-center justify-center mt-4">
                                            <img
                                                src="/images/E1CXlogo.png"
                                                alt="Company Logo"
                                                className="h-full w-full object-contain"
                                                crossOrigin="anonymous"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        </div>

                                        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                                    </div>

                                    {/* ── MIDDLE: Award Title & Recipient ── */}
                                    <div className="flex flex-col items-center my-auto space-y-1 sm:space-y-3">
                                        <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] text-purple-950 uppercase font-medium italic mb-5">
                                            This Certificate is Proudly
                                            Presented to
                                        </p>

                                        {/* Recipient Name */}
                                        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-serif text-slate-900 tracking-wide border-b-2 border-amber-400/60 pb-1 px-8">
                                            {selectedCert.recipient_name}
                                        </h2>

                                        {/* Award Category / Title */}
                                        <div className="pt-2">
                                            <h1 className="text-base sm:text-2xl font-bold font-serif text-purple-900 tracking-normal flex items-center justify-center gap-2">
                                                <span>
                                                    {selectedCert.award_title}
                                                </span>
                                            </h1>
                                        </div>

                                        {/* Citation Message */}
                                        <p className="text-[0.65rem] sm:text-xs italic text-slate-600 max-w-[82%] leading-relaxed mx-auto pt-1">
                                            "{selectedCert.message}"
                                        </p>
                                    </div>

                                    {/* ── BOTTOM: Signatures & Verification Stamp ── */}
                                    <div className="w-full pt-3 border-t border-purple-900/15 grid grid-cols-3 items-end gap-2 text-left">
                                        {/* LEFT SIDE */}
                                        <div className="flex flex-col">
                                            <p className="text-[0.55rem] text-slate-400 uppercase tracking-widest mt-0.5">
                                                Executive Signature
                                            </p>
                                            <p className="text-[0.75rem] font-bold text-slate-900 font-serif">
                                                {selectedCert.left_side_name ||
                                                    "Giovanni Yap"}
                                            </p>

                                            <div className="w-20 h-[1.5px] bg-gradient-to-r from-amber-500 to-transparent mt-1" />
                                            <p className="text-[0.6rem] text-slate-500 font-medium">
                                                {selectedCert.left_side_title ||
                                                    "Executive Director"}
                                            </p>
                                        </div>

                                        {/* Center Medal Stamp Badge */}
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 shadow-md border-2 border-white">
                                                <div className="absolute inset-1 rounded-full border border-dashed border-amber-100/70" />
                                                <Award
                                                    className="text-white drop-shadow-xs"
                                                    size={24}
                                                />
                                            </div>
                                            <span className="text-[0.55rem] font-bold text-amber-800 tracking-wider uppercase mt-1">
                                                Official Award
                                            </span>
                                        </div>

                                        {/* RIGHT SIDE */}
                                        <div className="flex flex-col text-right">
                                            <p className="text-[0.55rem] text-slate-400 uppercase tracking-widest mt-0.5">
                                                Executive Signature
                                            </p>
                                            <p className="text-[0.75rem] font-bold text-slate-900 font-serif">
                                                {selectedCert.right_side_name ||
                                                    "Fawad Nasir"}
                                            </p>

                                            <div className="w-20 h-[1.5px] bg-gradient-to-l from-amber-500 to-transparent mt-1 ml-auto" />
                                            <p className="text-[0.6rem] text-slate-500 font-medium">
                                                {selectedCert.right_side_title ||
                                                    "Chief Executive Officer"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Certificate ID footer */}
                                    <p className="text-[0.5rem] text-purple-900/40 font-mono tracking-widest mt-1">
                                        VERIFICATION CODE:{" "}
                                        {selectedCert.certificate_number}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                            <p className="text-sm text-gray-500">
                                Select a certificate from the left to preview
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}