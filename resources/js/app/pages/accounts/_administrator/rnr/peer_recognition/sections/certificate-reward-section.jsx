import React, { useState, useRef, useMemo } from "react";
import {
    Award,
    Printer,
    Download,
    ShieldCheck,
    Search,
    Loader2,
} from "lucide-react";


export const AWARD_MESSAGES = {
    // ── VALUES AWARDS ──

    Reliability: [
        "In recognition of your steadfast reliability, unwavering commitment, and consistent dedication to honoring every promise you make.",
        "You have demonstrated that trust is built through actions—by showing up, following through, delivering with consistency, and remaining dependable when it matters most.",
        "Your commitment to excellence and your ability to be counted on by colleagues, clients, and partners exemplify the Trust & Reliability values of EmpireOneCX.",
        "You remind us that meaningful relationships are built one commitment at a time, and that when people can count on you, trust follows.",
        "With sincere appreciation for being someone others can rely on and for consistently turning commitments into results.",
    ],

    Excellence: [
        "In recognition of your exceptional commitment to excellence, outstanding performance, and unwavering dedication to the highest standards of quality.",
        "Through your professionalism, discipline, and continuous pursuit of improvement, you have distinguished yourself as an individual who raises the bar, inspires others, and exemplifies what excellence means at EmpireOneCX.",
        "Your contribution is not only recognized—it is celebrated as a standard for others to aspire to.",
        "With appreciation for your pursuit of excellence and your lasting impact on our success.",
    ],

    Adaptability: [
        "In recognition of your remarkable adaptability, agility, and unwavering ability to embrace change with confidence and purpose.",
        "You consistently respond to new challenges with an open mind, turn uncertainty into opportunity, and find innovative ways to navigate evolving demands.",
        "Your resilience, flexibility, and willingness to learn exemplify the Adaptability values of EmpireOneCX, enabling our teams to move forward, evolve, and thrive in an ever-changing environment.",
        "You remind us that progress belongs to those who are willing to embrace change, challenge the familiar, and create new possibilities.",
        "With sincere appreciation for your resilience, flexibility, and ability to help others move forward through change.",
    ],

    Collaboration: [
        "In recognition of your exceptional spirit of collaboration, unwavering support for others, and commitment to building a stronger team.",
        "Through your generosity, teamwork, and willingness to lift those around you, you demonstrate that our greatest achievements are made possible when we work together, support one another, and share a common purpose.",
        "Your ability to bring people together, foster trust, and contribute to a culture of collaboration exemplifies the spirit of One Team at EmpireOneCX.",
        "Your impact reminds us that when we work as one, we achieve more together.",
        "With appreciation for your commitment to teamwork and the positive difference you make every day.",
    ],

    Integrity: [
        "In recognition of your unwavering integrity, exceptional sense of responsibility, and steadfast commitment to protecting what matters most.",
        "You consistently demonstrate honesty, accountability, and sound judgment while upholding the highest standards of confidentiality, security, and ethical conduct.",
        "Through your actions, you help safeguard our people, our clients, our customers, and the trust placed in EmpireOneCX. Your commitment to doing what is right—especially when it matters most—sets an example for those around you.",
        "You embody the belief that integrity builds trust, security protects it, and accountability sustains it.",
        "With sincere appreciation for your commitment to protecting our people, our information, and the trust we have earned together.",
    ],

    // ── PEOPLE AWARDS ──

    "The Empathy Award": [
        "In recognition of your genuine compassion, exceptional understanding, and unwavering commitment to putting people first.",
        "Through your kindness, patience, and willingness to listen, you create meaningful connections and make those around you feel heard, valued, and respected.",
        "Your ability to lead with empathy, support others through challenges, and treat every person with dignity exemplifies the People First spirit of EmpireOneCX.",
        "Your actions remind us that while excellence drives what we do, empathy defines how we do it.",
        "With sincere appreciation for the positive impact you make through every interaction, every act of kindness, and every person you inspire.",
    ],

    "The Initiative Award": [
        "In recognition of your exceptional initiative, proactive spirit, and unwavering determination to turn opportunities into action.",
        "You consistently step forward, take ownership, and find ways to make things happen—often going beyond what is expected to create meaningful results and positive change.",
        "Your willingness to act, solve problems, embrace challenges, and inspire others through your example reflects the entrepreneurial spirit and can-do culture of EmpireOneCX.",
        "You remind us that great ideas become great achievements when someone has the courage to take the first step and the determination to see it through.",
        "With sincere appreciation for your drive, resourcefulness, and the positive impact you create through action.",
    ],

    "The Innovation Award": [
        "In recognition of your visionary thinking, creative problem-solving, and unwavering commitment to finding better ways forward.",
        "You challenge the ordinary, question the expected, and transform ideas into meaningful solutions that create value for our people, our clients, and our customers.",
        "Your curiosity, creativity, and courage to explore new possibilities exemplify the innovative spirit of EmpireOneCX and inspire those around you to see challenges as opportunities for improvement.",
        "You remind us that innovation begins with the willingness to think differently, challenge convention, and turn possibilities into progress.",
        "With sincere appreciation for your creativity, ingenuity, and contribution to shaping a smarter, better, and more innovative future.",
    ],

    "The Customer Champion": [
        "In recognition of your exceptional dedication to our customers, unwavering commitment to service excellence, and remarkable willingness to go the extra mile.",
        "Through every interaction, you demonstrate genuine care, professionalism, and a relentless commitment to creating experiences that exceed expectations.",
        "Your ability to listen, understand, anticipate needs, and turn challenges into opportunities reflects the very best of the customer-first spirit of EmpireOneCX.",
        "You remind us that extraordinary service is not simply about meeting expectations—it is about creating moments that customers remember and trust.",
        "Your dedication strengthens our client relationships, elevates the customer experience, and sets a standard of service for others to follow.",
        "With sincere appreciation for making every customer interaction count and for consistently going the extra mile.",
    ],

    "The Ownership Award": [
        "In recognition of your exceptional sense of ownership, unwavering accountability, and steadfast commitment to delivering results.",
        "You take responsibility, follow through on your commitments, and consistently rise to the occasion—turning challenges into opportunities and expectations into results.",
        "Your determination to see things through, coupled with your reliability and proactive approach, exemplifies the ownership mindset of EmpireOneCX.",
        "You demonstrate that true ownership is more than accepting responsibility—it is having the initiative to act, the discipline to follow through, and the commitment to deliver.",
        "With sincere appreciation for your dependability, accountability, and the lasting impact you make through taking ownership of every opportunity.",
    ],
};

// ============================================================================
// AWARD MESSAGE ALIASES
// ============================================================================

AWARD_MESSAGES["Trust & Reliability"] = AWARD_MESSAGES.Reliability;
AWARD_MESSAGES["The Excellence Award"] = AWARD_MESSAGES.Excellence;
AWARD_MESSAGES["The One Team Award"] = AWARD_MESSAGES.Collaboration;
AWARD_MESSAGES["The Integrity Award"] = AWARD_MESSAGES.Integrity;
AWARD_MESSAGES["Integrity & Security"] = AWARD_MESSAGES.Integrity;

// ============================================================================
// GET AWARD MESSAGE
// ============================================================================

export function getAwardMessage(cert) {
    if (!cert) return null;

    return (
        AWARD_MESSAGES[cert.award_title] ||
        AWARD_MESSAGES[cert.category] ||
        null
    );
}

// ============================================================================
// FORMAT CERTIFICATE DATE
// ============================================================================
// Supports:
// issued_at
// created_at
// recognition_date
// certificate_date
// date
//
// Output:
// MMDDYYYY
//
// Example:
// October 1, 2026 → 10012026
// ============================================================================

export function formatCertificateDate(cert) {
    if (!cert) return "";

    const rawDate =
        cert.issued_at ||
        cert.created_at ||
        cert.recognition_date ||
        cert.certificate_date ||
        cert.date;

    if (!rawDate) return "";

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}${day}${year}`;
}

// ============================================================================
// GET CERTIFICATE SEQUENCE / COUNT
// ============================================================================
//
// Examples:
//
// REC-19
// ↓
// 0019
//
// REC-123
// ↓
// 0123
//
// CERT-2026-8841
// ↓
// 8841
//
// ============================================================================

export function getCertificateCount(cert) {
    if (!cert) return "";

    const value =
        cert.certificate_number ||
        cert.id ||
        "";

    const match = String(value).match(/(\d+)$/);

    if (!match) return "";

    return String(parseInt(match[1], 10)).padStart(4, "0");
}

// ============================================================================
// PRINT STYLES
// ============================================================================

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CertificateRewardSection({
    certificates = [],
    hideList = false,
}) {
    const [selectedCert, setSelectedCert] = useState(
        certificates[0] || null,
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);

    const certificateRef = useRef(null);

    // ========================================================================
    // FILTER CERTIFICATES
    // ========================================================================

    const filteredCertificates = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return certificates;

        return certificates.filter((cert) =>
            [
                cert.recipient_name,
                cert.award_title,
                cert.certificate_number,
            ].some((field) =>
                (field || "").toLowerCase().includes(term),
            ),
        );
    }, [certificates, searchTerm]);

    // ========================================================================
    // PRINT
    // ========================================================================

    const handlePrint = () => {
        window.print();
    };

    // ========================================================================
    // DOWNLOAD PDF
    // ========================================================================

    const handleDownloadPDF = async () => {
        if (!certificateRef.current || !selectedCert) return;

        setIsDownloading(true);

        try {
            const [{ default: html2canvas }, { jsPDF }] =
                await Promise.all([
                    import("html2canvas"),
                    import("jspdf"),
                ]);

            const canvas = await html2canvas(
                certificateRef.current,
                {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                },
            );

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                pageWidth,
                pageHeight,
            );

            pdf.save(
                `${
                    selectedCert.certificate_number ||
                    "certificate"
                }.pdf`,
            );
        } catch (err) {
            console.error(
                "PDF generation failed:",
                err,
            );

            window.print();
        } finally {
            setIsDownloading(false);
        }
    };

    // ========================================================================
    // SELECTED CERTIFICATE HELPERS
    // ========================================================================

    const awardMessage = getAwardMessage(selectedCert);
    const certificateDate = formatCertificateDate(selectedCert);
    const certificateCount = getCertificateCount(selectedCert);

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="space-y-6">
            <style>{PRINT_STYLES}</style>

            {/* ================================================================
                HEADER & SEARCH
            ================================================================= */}

            {!hideList && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                            <Award
                                className="text-purple-600"
                                size={24}
                            />

                            Reward Certificates
                        </h2>

                        <p className="mt-0.5 text-sm text-gray-500">
                            View, print, and verify issued
                            achievement certificates
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative min-w-[260px]">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                        />

                        <input
                            type="text"
                            placeholder="Search certificate or recipient..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value,
                                )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                py-2
                                pl-9
                                pr-4
                                text-sm
                                transition-all
                                focus:border-purple-500
                                focus:outline-none
                                focus:ring-2
                                focus:ring-purple-100
                            "
                        />
                    </div>
                </div>
            )}

            {/* ================================================================
                MAIN CONTENT
            ================================================================= */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 print:block">

                {/* ============================================================
                    CERTIFICATE LIST
                ============================================================= */}

                {!hideList && (
                    <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1 lg:col-span-4 print:hidden">
                        {filteredCertificates.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                                <Award
                                    className="mx-auto mb-2 text-gray-300"
                                    size={32}
                                />

                                <p className="text-sm font-medium text-gray-600">
                                    No certificates found
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Try tweaking your search term
                                </p>
                            </div>
                        ) : (
                            filteredCertificates.map(
                                (cert) => {
                                    const isSelected =
                                        selectedCert?.id ===
                                        cert.id;

                                    return (
                                        <div
                                            key={cert.id}
                                            onClick={() =>
                                                setSelectedCert(
                                                    cert,
                                                )
                                            }
                                            className={`
                                                group
                                                cursor-pointer
                                                rounded-2xl
                                                border-2
                                                p-4
                                                transition-all
                                                duration-200
                                                ${
                                                    isSelected
                                                        ? "border-purple-500 bg-purple-50/50 shadow-sm"
                                                        : "border-gray-100 bg-white hover:border-purple-200 hover:shadow-xs"
                                                }
                                            `}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-100 font-bold text-purple-700">
                                                        <Award size={20} />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                                                            {
                                                                cert.award_title
                                                            }
                                                        </h4>

                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                cert.recipient_name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-500">
                                                <span className="truncate">
                                                    {
                                                        cert.department
                                                    }
                                                </span>

                                                <span className="font-semibold text-amber-600">
                                                    +
                                                    {
                                                        cert.pointsAwarded
                                                    }{" "}
                                                    pts
                                                </span>
                                            </div>
                                        </div>
                                    );
                                },
                            )
                        )}
                    </div>
                )}

                {/* ============================================================
                    CERTIFICATE PREVIEW
                ============================================================= */}

                <div
                    className={
                        hideList
                            ? "lg:col-span-12"
                            : "lg:col-span-8 print:w-full"
                    }
                >
                    {selectedCert ? (
                        <div className="space-y-4">

                            {/* =================================================
                                ACTION BAR
                            ================================================= */}

                            <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between print:hidden">

                                {/* Certificate Metadata */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck
                                            size={16}
                                            className="text-purple-600"
                                        />

                                        <span>
                                            Issued:
                                        </span>

                                        <span className="font-semibold text-slate-700">
                                            {certificateDate ||
                                                "—"}
                                        </span>
                                    </div>

                                    <span className="hidden h-4 w-px bg-gray-200 sm:block" />

                                    <div className="flex items-center gap-1.5">
                                        <span>
                                            Certificate No.
                                        </span>

                                        <span className="font-semibold text-slate-700">
                                            {certificateCount ||
                                                "—"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={
                                            handlePrint
                                        }
                                        className="
                                            flex
                                            cursor-pointer
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            border
                                            border-gray-200
                                            bg-white
                                            px-3.5
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-gray-700
                                            shadow-2xs
                                            transition-all
                                            hover:border-gray-300
                                            hover:bg-gray-50
                                        "
                                    >
                                        <Printer size={14} />
                                        Print
                                    </button>

                                    <button
                                        onClick={
                                            handleDownloadPDF
                                        }
                                        disabled={
                                            isDownloading
                                        }
                                        className="
                                            flex
                                            cursor-pointer
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            border
                                            border-purple-600
                                            bg-purple-600
                                            px-3.5
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-white
                                            shadow-2xs
                                            transition-all
                                            hover:bg-purple-700
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >
                                        {isDownloading ? (
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Download
                                                size={14}
                                            />
                                        )}

                                        {isDownloading
                                            ? "Preparing..."
                                            : "Download PDF"}
                                    </button>
                                </div>
                            </div>

                            {/* =================================================
                                PRINTABLE CERTIFICATE
                            ================================================= */}

                            <div
                                id="printable-certificate"
                                ref={certificateRef}
                                className="
                                    relative
                                    overflow-hidden
                                    rounded-sm
                                    bg-gradient-to-br
                                    from-white
                                    via-purple-50/20
                                    to-amber-50/20
                                    text-slate-900
                                    shadow-2xl
                                    select-none
                                "
                                style={{
                                    aspectRatio:
                                        "297 / 210",
                                    width: "100%",
                                }}
                            >

                                {/* =================================================
                                    OUTER FRAME
                                ================================================= */}

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-[1.2%]
                                        z-10
                                        border-[3px]
                                        border-purple-700/70
                                    "
                                />

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-[2.4%]
                                        z-10
                                        border
                                        border-amber-500/50
                                    "
                                />

                                {/* =================================================
                                    CORNER ORNAMENTS
                                ================================================= */}

                                {[
                                    "top-[3.2%] left-[2.2%] border-t-2 border-l-2",
                                    "top-[3.2%] right-[2.2%] border-t-2 border-r-2",
                                    "bottom-[3.2%] left-[2.2%] border-b-2 border-l-2",
                                    "bottom-[3.2%] right-[2.2%] border-b-2 border-r-2",
                                ].map(
                                    (
                                        className,
                                        idx,
                                    ) => (
                                        <div
                                            key={idx}
                                            className={`
                                                pointer-events-none
                                                absolute
                                                z-20
                                                aspect-square
                                                w-[3.5%]
                                                border-amber-500/80
                                                ${className}
                                            `}
                                        />
                                    ),
                                )}

                                {/* =================================================
                                    CERTIFICATE CONTENT
                                ================================================= */}

                                <div className="relative z-30 box-border flex h-full flex-col items-center px-[8%] py-[4.5%] text-center">

                                    {/* =================================================
                                        TOP / LOGO
                                    ================================================= */}

                                    <div className="flex shrink-0 flex-col items-center gap-[0.6em]">
                                        <div className="flex h-9 items-center justify-center sm:h-11">
                                            <img
                                                src="/images/E1CXlogo.png"
                                                alt="Company Logo"
                                                className="h-full w-auto object-contain"
                                                crossOrigin="anonymous"
                                                onError={(
                                                    e,
                                                ) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500" />

                                            <div className="h-1.5 w-1.5 rotate-45 bg-amber-500" />

                                            <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500" />
                                        </div>
                                    </div>

                                    {/* =================================================
                                        MIDDLE CONTENT
                                    ================================================= */}

                                    <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">

                                        {/* Award Title */}
                                        <h1
                                            className="
                                                text-center
                                                font-serif
                                                text-lg
                                                font-bold
                                                uppercase
                                                leading-tight
                                                tracking-[0.16em]
                                                text-purple-900
                                                sm:text-2xl
                                                md:text-[1.7rem]
                                            "
                                        >
                                            {
                                                selectedCert.award_title
                                            }
                                        </h1>

                                        {/* Presented To */}
                                        <p
                                            className="
                                                mt-2
                                                text-center
                                                text-[0.6rem]
                                                font-medium
                                                uppercase
                                                tracking-[0.3em]
                                                text-slate-500
                                                sm:text-[0.7rem]
                                            "
                                        >
                                            {awardMessage
                                                ? "Presented with Distinction to"
                                                : "This Certificate is Proudly Presented to"}
                                        </p>

                                        {/* Recipient Name */}
                                        <h2
                                            className="
                                                mt-1
                                                px-10
                                                pb-2
                                                text-center
                                                font-serif
                                                text-2xl
                                                font-extrabold
                                                leading-normal
                                                tracking-wide
                                                text-slate-900
                                                sm:text-4xl
                                                md:text-[2.15rem]
                                            "
                                        >
                                            {
                                                selectedCert.recipient_name
                                            }
                                        </h2>

                                        {/* Recipient Divider */}
                                        <div className="mt-1 h-[2px] w-[38%] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                                        {/* =================================================
                                            CITATION MESSAGE
                                        ================================================= */}

                                        {awardMessage ? (
                                            <div className="mx-auto mt-3 flex w-full max-w-[82%] flex-col items-center">
                                                <div className="w-full max-w-[900px] space-y-[0.55em]">
                                                    {awardMessage.map(
                                                        (
                                                            paragraph,
                                                            idx,
                                                        ) => (
                                                            <p
                                                                key={
                                                                    idx
                                                                }
                                                                className="
                                                                    mx-auto
                                                                    text-center
                                                                    text-[0.55rem]
                                                                    font-normal
                                                                    leading-[1.55]
                                                                    tracking-[0.005em]
                                                                    text-slate-600
                                                                    sm:text-[0.66rem]
                                                                    md:text-[0.7rem]
                                                                "
                                                            >
                                                                {
                                                                    paragraph
                                                                }
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p
                                                className="
                                                    mx-auto
                                                    mt-3
                                                    w-full
                                                    max-w-[78%]
                                                    text-center
                                                    text-[0.65rem]
                                                    italic
                                                    leading-relaxed
                                                    text-slate-600
                                                    sm:text-xs
                                                "
                                            >
                                                "
                                                {
                                                    selectedCert.message
                                                }
                                                "
                                            </p>
                                        )}
                                    </div>

                                    {/* =================================================
                                        BOTTOM / SIGNATURES
                                    ================================================= */}

                                    <div className="grid w-full shrink-0 grid-cols-3 items-end gap-4 pt-[1.5%]">

                                        {/* =================================================
                                            LEFT SIGNATURE
                                        ================================================= */}

                                        <div className="flex flex-col items-center text-center">
                                            <p
                                                className="
                                                    font-serif
                                                    text-[0.8rem]
                                                    font-bold
                                                    leading-none
                                                    text-slate-900
                                                    sm:text-[0.9rem]
                                                "
                                            >
                                                {
                                                    selectedCert.left_side_name ||
                                                    "Giovanni Yap"
                                                }
                                            </p>

                                            <div className="mt-[0.45em] h-px w-full max-w-[160px] bg-slate-400" />

                                            <p
                                                className="
                                                    mt-[0.4em]
                                                    text-[0.55rem]
                                                    uppercase
                                                    tracking-[0.18em]
                                                    text-slate-500
                                                    sm:text-[0.62rem]
                                                "
                                            >
                                                {
                                                    selectedCert.left_side_title ||
                                                    "Executive Director"
                                                }
                                            </p>
                                        </div>

                                        {/* =================================================
                                            CENTER MEDAL / CERTIFICATE NUMBER
                                        ================================================= */}

                                        <div className="flex flex-col items-center justify-end">

                                            {/* Medal */}
                                            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 shadow-md sm:h-14 sm:w-14">
                                                <div className="absolute inset-1 rounded-full border border-dashed border-amber-100/70" />

                                                <Award
                                                    className="h-5 w-5 text-white drop-shadow-xs sm:h-6 sm:w-6"
                                                />
                                            </div>

                                            {/* Certificate Number */}
                                            <div className="mt-[0.6em] flex flex-col items-center leading-none">
                                                <p
                                                    className="
                                                        text-[0.42rem]
                                                        uppercase
                                                        tracking-[0.18em]
                                                        text-slate-400
                                                    "
                                                >
                                                    Certificate No.
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        font-mono
                                                        text-[0.5rem]
                                                        font-semibold
                                                        tracking-[0.15em]
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        certificateCount ||
                                                        "—"
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* =================================================
                                            RIGHT SIGNATURE
                                        ================================================= */}

                                        <div className="flex flex-col items-center text-center">
                                            <p
                                                className="
                                                    font-serif
                                                    text-[0.8rem]
                                                    font-bold
                                                    leading-none
                                                    text-slate-900
                                                    sm:text-[0.9rem]
                                                "
                                            >
                                                {
                                                    selectedCert.right_side_name ||
                                                    "Fawad Nasir"
                                                }
                                            </p>

                                            <div className="mt-[0.45em] h-px w-full max-w-[160px] bg-slate-400" />

                                            <p
                                                className="
                                                    mt-[0.4em]
                                                    text-[0.55rem]
                                                    uppercase
                                                    tracking-[0.18em]
                                                    text-slate-500
                                                    sm:text-[0.62rem]
                                                "
                                            >
                                                {
                                                    selectedCert.right_side_title ||
                                                    "Chief Executive Officer"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                            <p className="text-sm text-gray-500">
                                Select a certificate from the
                                left to preview
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}