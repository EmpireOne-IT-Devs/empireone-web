import React, { useState } from 'react';
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import {
    Award,
    Download,
    Printer,
    Share2,
    Sparkles,
    CheckCircle2,
    Calendar,
    User,
    Building2,
    ShieldCheck,
    Search,
    Filter,
    ExternalLink
} from "lucide-react";
import moment from "moment";

// Sample Certificate Data (Replace or pass as props / connect to Redux)
const SAMPLE_CERTIFICATES = [
    {
        id: "cert_01",
        certificateNumber: "CERT-2026-8841",
        recipientName: "Sarah Jenkins",
        recipientRole: "Senior Product Designer",
        department: "UX & Design Team",
        issuerName: "Marcus Vance",
        issuerTitle: "VP of Engineering",
        awardTitle: "Excellence in Innovation",
        category: "Innovation & Creativity",
        pointsAwarded: 250,
        issueDate: "2026-03-15",
        message: "For exceptional leadership during the Q1 UI Redesign project and driving human-centered design principles across all squads.",
        companyName: "EmpireOneCX",
        badgeVariant: "warning"
    },
    {
        id: "cert_02",
        certificateNumber: "CERT-2026-4912",
        recipientName: "Alex Rivera",
        recipientRole: "Full Stack Developer",
        department: "Engineering",
        issuerName: "Elena Rostova",
        issuerTitle: "Head of People",
        awardTitle: "Star Performer of the Month",
        category: "Excellence",
        pointsAwarded: 500,
        issueDate: "2026-02-28",
        message: "Recognized for outstanding technical contribution and resolving critical infrastructure performance bottlenecks under extreme deadlines.",
        companyName: "EmpireOneCX",
        badgeVariant: "primary"
    }
];

export default function CertificateRewardSection({ certificates = SAMPLE_CERTIFICATES, hideList = false }) {
    const [selectedCert, setSelectedCert] = useState(certificates[0] || null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCertificates = certificates.filter(cert =>
        cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.awardTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls Section */}
            {!hideList && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Award className="text-orange-500" size={24} />
                        Reward Certificates
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        View, print, and verify issued achievement certificates
                    </p>
                </div>

                {/* Quick Search */}
                <div className="relative min-w-[260px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                {/* Certificate List (Left Side) */}
                {!hideList && (
                <div className="lg:col-span-4 space-y-3 max-h-[720px] overflow-y-auto pr-1">
                    {filteredCertificates.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                            <Award className="mx-auto text-gray-300 mb-2" size={32} />
                            <p className="text-sm font-medium text-gray-600">No certificates found</p>
                            <p className="text-xs text-gray-400 mt-1">Try tweaking your search term</p>
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
                                            ? "border-purple-500 bg-purple-50/30 shadow-sm"
                                            : "border-gray-100 bg-white hover:border-purple-200 hover:shadow-xs"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 font-bold border border-orange-200">
                                                <Award size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                    {cert.awardTitle}
                                                </h4>
                                                <p className="text-xs text-gray-500">{cert.recipientName}</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-mono font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                            {moment(cert.issueDate).format("MMM YYYY")}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-500">
                                        <span className="truncate">{cert.department}</span>
                                        <span className="font-semibold text-orange-600">+{cert.pointsAwarded} pts</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                )}

                {/* Certificate Preview Viewer (Right Side) */}
                <div className={hideList ? "lg:col-span-12" : "lg:col-span-8"}>
                    {selectedCert ? (
                        <div className="space-y-4">
                            {/* Actions Header */}
                            <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-gray-100 shadow-xs">
                                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                                    <ShieldCheck size={16} className="text-purple-500" />
                                    <span>ID: {selectedCert.certificateNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrint}
                                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-2xs"
                                    >
                                        <Printer size={14} />
                                        Print / PDF
                                    </button>
                                    <button
                                        className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-purple-700 cursor-pointer shadow-xs"
                                    >
                                        <Download size={14} />
                                        Download Image
                                    </button>
                                </div>
                            </div>

                            {/*
                             * ─────────────────────────────────────────────────────────────────
                             * PRINTABLE CERTIFICATE — A4 size (210mm × 297mm)
                             * Color scheme: Purple dominant, Orange accents
                             * Company: EmpireOneCX
                             * ─────────────────────────────────────────────────────────────────
                             */}
                            <div
                                className="relative overflow-hidden shadow-2xl"
                                style={{
                                    /* A4 landscape proportions: 297mm × 210mm → aspect ratio ~1.414:1 */
                                    width: '100%',
                                    aspectRatio: '297 / 210',
                                    background: 'linear-gradient(145deg, #2d1b69 0%, #1a0f3e 40%, #0f0826 70%, #1e0d4a 100%)',
                                    border: '10px solid #1a0f3e',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                {/* Outer decorative border ring */}
                                <div style={{
                                    position: 'absolute',
                                    inset: '10px',
                                    border: '2px solid rgba(251,146,60,0.35)',
                                    borderRadius: '2px',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                }} />

                                {/* Inner thin border */}
                                <div style={{
                                    position: 'absolute',
                                    inset: '16px',
                                    border: '1px solid rgba(251,146,60,0.15)',
                                    borderRadius: '1px',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                }} />

                                {/* Corner ornaments — orange */}
                                {[
                                    { top: 20, left: 20 },
                                    { top: 20, right: 20 },
                                    { bottom: 20, left: 20 },
                                    { bottom: 20, right: 20 },
                                ].map((pos, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        width: 28,
                                        height: 28,
                                        borderTop: i < 2 ? '2.5px solid rgba(251,146,60,0.7)' : undefined,
                                        borderBottom: i >= 2 ? '2.5px solid rgba(251,146,60,0.7)' : undefined,
                                        borderLeft: (i === 0 || i === 2) ? '2.5px solid rgba(251,146,60,0.7)' : undefined,
                                        borderRight: (i === 1 || i === 3) ? '2.5px solid rgba(251,146,60,0.7)' : undefined,
                                        zIndex: 2,
                                        ...pos,
                                    }} />
                                ))}

                                {/* Background radial glow */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60%',
                                    height: '40%',
                                    background: 'radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)',
                                    pointerEvents: 'none',
                                    zIndex: 0,
                                }} />

                                {/* Watermark Award icon */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.04,
                                    pointerEvents: 'none',
                                    zIndex: 0,
                                }}>
                                    <Award size={360} color="#fb923c" />
                                </div>

                                {/* ── CERTIFICATE CONTENT ── */}
                                <div style={{
                                    position: 'relative',
                                    zIndex: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                    padding: '5% 8%',
                                    textAlign: 'center',
                                    color: '#fff',
                                    boxSizing: 'border-box',
                                }}>

                                    {/* ── TOP: Logo + Company ── */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>

                                        {/*
                                         * ┌─────────────────────────────────────────┐
                                         * │  LOGO PLACEHOLDER                        │
                                         * │  Replace the <div> below with:           │
                                         * │  <img src={yourLogoUrl} alt="EmpireOneCX logo" style={{ height: 48, objectFit: 'contain' }} />
                                         * └─────────────────────────────────────────┘
                                         */}
                                        <div>
                                            {/* ADD YOUR LOGO HERE — replace this Award icon */}
                                            <img src="/images/E1Icon.png"
                                            alt="EmpireOneCX logo" 
                                            style={{ height: 48, objectFit: 'contain' }} />
                                        </div>

                                        <p style={{
                                            fontSize: '0.6em',
                                            letterSpacing: '0.25em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(251,146,60,0.9)',
                                            fontWeight: 700,
                                            marginTop: 2,
                                        }}>
                                            {selectedCert.companyName}
                                        </p>

                                        {/* Thin orange divider under company name */}
                                        <div style={{ width: 48, height: 1.5, background: 'linear-gradient(90deg, transparent, #fb923c, transparent)', marginTop: 2 }} />
                                    </div>

                                    {/* ── MIDDLE: Certificate Title + Recipient ── */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>

                                        <p style={{
                                            fontSize: '0.5em',
                                            letterSpacing: '0.18em',
                                            color: 'rgba(196,181,253,0.7)',
                                            textTransform: 'uppercase',
                                            fontStyle: 'italic',
                                        }}>
                                            This certificate is proudly presented to
                                        </p>

                                        <h1 style={{
                                            fontSize: 'clamp(1rem, 3.5vw, 2.2em)',
                                            fontWeight: 800,
                                            fontFamily: 'Georgia, "Times New Roman", serif',
                                            background: 'linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 40%, #fb923c 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            lineHeight: 1.15,
                                            letterSpacing: '0.04em',
                                            margin: 0,
                                        }}>
                                            Certificate of Recognition
                                        </h1>

                                        {/* Ornamental rule */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '60%' }}>
                                            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.5))' }} />
                                            <Sparkles size={12} color="#fb923c" />
                                            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(251,146,60,0.5), transparent)' }} />
                                        </div>

                                        {/* Recipient Name */}
                                        <h2 style={{
                                            fontSize: 'clamp(1.2rem, 4vw, 2.6em)',
                                            fontWeight: 900,
                                            fontFamily: 'Georgia, "Times New Roman", serif',
                                            color: '#ffffff',
                                            margin: 0,
                                            letterSpacing: '0.03em',
                                            textShadow: '0 0 30px rgba(124,58,237,0.6)',
                                        }}>
                                            {selectedCert.recipientName}
                                        </h2>

                                        <p style={{
                                            fontSize: '0.5em',
                                            color: 'rgba(251,146,60,0.85)',
                                            fontWeight: 600,
                                            letterSpacing: '0.08em',
                                            margin: 0,
                                        }}>
                                            {selectedCert.recipientRole} &bull; {selectedCert.department}
                                        </p>

                                        {/* Horizontal rule below recipient */}
                                        <div style={{ width: '50%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)', marginTop: 4 }} />

                                        {/* Award Title */}
                                        <p style={{
                                            fontSize: '0.65em',
                                            fontWeight: 700,
                                            color: '#fb923c',
                                            letterSpacing: '0.05em',
                                            margin: '4px 0 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}>
                                            <Sparkles size={10} color="#fb923c" />
                                            {selectedCert.awardTitle}
                                            <Sparkles size={10} color="#fb923c" />
                                        </p>

                                        {/* Message / Reason */}
                                        <p style={{
                                            fontSize: '0.42em',
                                            color: 'rgba(196,181,253,0.75)',
                                            fontStyle: 'italic',
                                            lineHeight: 1.6,
                                            maxWidth: '75%',
                                            margin: '4px auto 0',
                                        }}>
                                            "{selectedCert.message}"
                                        </p>
                                    </div>

                                    {/* ── BOTTOM: Signature + Date + Points ── */}
                                    <div style={{
                                        width: '100%',
                                        borderTop: '1px solid rgba(124,58,237,0.35)',
                                        paddingTop: '3%',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '8px',
                                        textAlign: 'left',
                                    }}>
                                        {/* Issuer / Signature */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <p style={{ fontSize: '0.5em', fontWeight: 700, color: '#e9d5ff', margin: 0, fontFamily: 'Georgia, serif' }}>
                                                {selectedCert.issuerName}
                                            </p>
                                            <p style={{ fontSize: '0.38em', color: 'rgba(196,181,253,0.6)', margin: 0 }}>
                                                {selectedCert.issuerTitle}
                                            </p>
                                            <div style={{ width: 60, height: 1.5, background: 'linear-gradient(90deg, #fb923c, transparent)', marginTop: 4 }} />
                                            <p style={{ fontSize: '0.33em', color: 'rgba(156,163,175,0.6)', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Authorized Signature
                                            </p>
                                        </div>

                                        {/* Date + Points */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.5em', fontWeight: 700, color: '#e9d5ff', margin: 0 }}>
                                                {moment(selectedCert.issueDate).format("MMMM D, YYYY")}
                                            </p>
                                            <p style={{ fontSize: '0.42em', color: '#fb923c', fontWeight: 700, margin: 0 }}>
                                                +{selectedCert.pointsAwarded} Reward Points
                                            </p>
                                            <div style={{ width: 60, height: 1.5, background: 'linear-gradient(270deg, #fb923c, transparent)', marginTop: 4, marginLeft: 'auto' }} />
                                            <p style={{ fontSize: '0.33em', color: 'rgba(156,163,175,0.6)', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Date of Issuance
                                            </p>
                                        </div>
                                    </div>

                                    {/* Certificate ID footer */}
                                    <p style={{
                                        fontSize: '0.32em',
                                        color: 'rgba(124,58,237,0.5)',
                                        fontFamily: 'monospace',
                                        letterSpacing: '0.12em',
                                        marginTop: '2%',
                                    }}>
                                        {selectedCert.certificateNumber}
                                    </p>

                                </div>
                            </div>
                            {/* END CERTIFICATE */}

                        </div>
                    ) : (
                        <div className="flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                            <p className="text-sm text-gray-500">Select a certificate from the left to preview</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}