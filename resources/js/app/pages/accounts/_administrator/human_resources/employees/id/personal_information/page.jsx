import React, { useEffect, useRef, useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    User,
    Briefcase,
    BookOpen,
    Shield,
    QrCode,
    PenLine,
    AlertCircle,
} from "lucide-react";
import EmployeeLayout from "../layout";
import Layout from "../../../../../layout";
import { useSelector } from "react-redux";
import moment from "moment";
import { QRCodeSVG } from "qrcode.react";

const CARD_THEMES = {
    purple: {
        bg: "bg-purple-50",
        border: "border-purple-100",
        icon: "bg-purple-100 text-purple-600",
        title: "text-purple-700",
        dot: "bg-purple-400",
        line: "bg-purple-100",
        badge: "bg-purple-100 text-purple-700",
    },
    blue: {
        bg: "bg-blue-50",
        border: "border-blue-100",
        icon: "bg-blue-100 text-blue-600",
        title: "text-blue-700",
        dot: "bg-blue-400",
        line: "bg-blue-100",
        badge: "bg-blue-100 text-blue-700",
    },
    orange: {
        bg: "bg-orange-50",
        border: "border-orange-100",
        icon: "bg-orange-100 text-orange-600",
        title: "text-orange-700",
        dot: "bg-orange-400",
        line: "bg-orange-100",
        badge: "bg-orange-100 text-orange-700",
    },
};

// ─── Dummy org data (shown when no real relations exist) ─────────────────────
const DUMMY_ORG = {
    manager: {
        id: null,
        name: "Apple Loraine Mag-Usara",
        position: "Operations Manager",
        account_employee: { position: "Operations Manager" },
        personal_information: {
            first_name: "Apple",
            middle_name: "Loraine",
            last_name: "Mag-Usara",
        },
    },
    directReports: [
        {
            id: null,
            name: "Juan Dela Cruz",
            account_employee: { position: "Senior Agent" },
            personal_information: {
                first_name: "Juan",
                middle_name: null,
                last_name: "Dela Cruz",
            },
        },
        {
            id: null,
            name: "Maria Santos",
            account_employee: { position: "Team Lead" },
            personal_information: {
                first_name: "Maria",
                middle_name: null,
                last_name: "Santos",
            },
        },
        {
            id: null,
            name: "Rodel Bautista",
            account_employee: { position: "Quality Analyst" },
            personal_information: {
                first_name: "Rodel",
                middle_name: null,
                last_name: "Bautista",
            },
        },
    ],
};

function OrgChartPopup({ user, onMouseEnter, onMouseLeave }) {
    const rawManager = user?.subordinate?.leader?.user;
    const rawReports = user?.leader?.subordinates ?? [];
    const isDummy = !rawManager && rawReports.length === 0;

    const manager = isDummy ? DUMMY_ORG.manager : rawManager;
    const directReports = isDummy
        ? DUMMY_ORG.directReports
        : rawReports.map((s) => s.employee).filter(Boolean);
    const basePath = `/accounts/_administrator/human_resources/employees`;

    const fullName = (u) => {
        if (!u) return "N/A";
        const pi = u.personal_information;
        return (
            [pi?.first_name, pi?.middle_name, pi?.last_name]
                .filter(Boolean)
                .join(" ") ||
            u.name ||
            "N/A"
        );
    };

    return (
        <div
            className="absolute left-full top-0 ml-2 z-50 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 text-left max-h-96 overflow-y-auto"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Organization Chart
                </p>
                {isDummy && (
                    <span className="text-[9px] bg-yellow-100 text-yellow-600 font-semibold px-1.5 py-0.5 rounded-full">
                        Preview
                    </span>
                )}
            </div>

            {/* Reports To */}
            {manager && (
                <div className="mb-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                        Reports To
                    </p>
                    {isDummy || !manager.id ? (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">
                                    {fullName(manager).charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                    {fullName(manager)}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {manager.account_employee?.position}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <a
                            href={`${basePath}/${manager.id}/personal_information`}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">
                                    {fullName(manager).charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 leading-tight">
                                    {fullName(manager)}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {manager.account_employee?.position}
                                </p>
                            </div>
                        </a>
                    )}
                    <div className="w-px h-3 bg-gray-200 mx-6" />
                </div>
            )}

            {/* Current */}
            <div className="mb-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                    Current
                </p>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-xs font-bold">
                            {(
                                user?.personal_information?.first_name ||
                                user?.name ||
                                "?"
                            ).charAt(0)}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {fullName(user)}
                        </p>
                        <p className="text-xs text-gray-400">
                            {user?.account_employee?.position || "Employee"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Direct Reports */}
            {directReports.length > 0 && (
                <div>
                    <div className="w-px h-3 bg-gray-200 mx-6" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                        Direct Reports ({directReports.length})
                    </p>
                    <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                        {directReports.map((emp, i) =>
                            isDummy || !emp?.id ? (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                                >
                                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 text-xs font-bold">
                                            {fullName(emp).charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-800 leading-tight">
                                            {fullName(emp)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {emp?.account_employee?.position}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <a
                                    key={emp.id}
                                    href={`${basePath}/${emp.id}/personal_information`}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition-colors group"
                                >
                                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 text-xs font-bold">
                                            {fullName(emp).charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-800 group-hover:text-green-600 leading-tight">
                                            {fullName(emp)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {emp?.account_employee?.position}
                                        </p>
                                    </div>
                                </a>
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const Page = () => {
    const { user } = useSelector((store) => store.app);
    const [showOrgChart, setShowOrgChart] = useState(false);
    const hideTimer = useRef(null);
    console.log("User Data:", user);

    const handleMouseEnter = () => {
        clearTimeout(hideTimer.current);
        setShowOrgChart(true);
    };

    const handleMouseLeave = () => {
        hideTimer.current = setTimeout(() => setShowOrgChart(false), 120);
    };

    return (
        <Layout>
            <EmployeeLayout>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-purple-500 via-blue-500 to-orange-400" />

                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-12 mb-4 ml-1.5">
                                <div
                                    className="relative flex-shrink-0 mb-1.5 group"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <img
                                        src="/images/empireone.png.png"
                                        className="w-28 h-28 rounded-2xl bg-white border-4 border-white shadow-md object-cover cursor-pointer"
                                        alt="Profile"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 pointer-events-none">
                                        <span className="text-white text-[9px] font-semibold bg-black/50 px-2 py-0.5 rounded-full">
                                            Organization Chart
                                        </span>
                                    </div>
                                    {showOrgChart && (
                                        <OrgChartPopup
                                            user={user}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    )}
                                </div>
                                <div className="pb-1 mb-16">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h4 className="text-xl font-bold text-white flex gap-1 flex-wrap leading-tight">
                                            <span>
                                                {
                                                    user?.personal_information
                                                        ?.first_name
                                                }
                                            </span>
                                            <span>
                                                {
                                                    user?.personal_information
                                                        ?.middle_name
                                                }
                                            </span>
                                            <span>
                                                {
                                                    user?.personal_information
                                                        ?.last_name
                                                }
                                            </span>
                                        </h4>
                                        {user?.account_employee?.position && (
                                            <span className="text-xs font-medium text-white bg-purple-600 px-2 py-0.5 rounded-full">
                                                {user.account_employee.position}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-white tracking-widest uppercase ml-0.5 mb-1.5">
                                        EOID:{" "}
                                        <span className="font-bold text-white underline">
                                            {
                                                user?.account_employee
                                                    ?.employee_id
                                            }
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100 mb-4" />

                            {/* Pills row */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                <InfoPill
                                    icon={<User size={12} />}
                                    label={user?.personal_information?.gender}
                                />
                                <InfoPill
                                    icon={<Mail size={12} />}
                                    label={user?.account_employee?.eogs_email}
                                />
                                <InfoPill
                                    icon={<Mail size={12} />}
                                    label={user?.email}
                                />
                                <InfoPill
                                    icon={<Phone size={12} />}
                                    label={user?.personal_information?.contact}
                                />
                            </div>

                            {/* Stats — 2×2 grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <StatBox
                                    label="Place of Birth"
                                    value={
                                        user?.personal_information?.birth_place
                                    }
                                />
                                <StatBox
                                    label="Birth Date"
                                    value={
                                        user?.personal_information
                                            ?.date_of_birth
                                            ? moment(
                                                  user.personal_information
                                                      .date_of_birth,
                                              ).format("MMMM DD, YYYY")
                                            : "—"
                                    }
                                />
                                <StatBox
                                    label="Age"
                                    value={
                                        user?.personal_information
                                            ?.date_of_birth
                                            ? moment().diff(
                                                  user?.personal_information
                                                      ?.date_of_birth,
                                                  "years",
                                              ) + " years old"
                                            : "—"
                                    }
                                />
                                <StatBox
                                    label="Marital Status"
                                    value={
                                        user?.personal_information
                                            ?.marital_status
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Sidebar Column ───────────────────────────────── */}
                    <div className="space-y-5">
                        {/* Address */}
                        <Card
                            title="Address"
                            icon={<MapPin size={15} />}
                            theme={CARD_THEMES.purple}
                        >
                            <div className="text-sm space-y-1">
                                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">
                                    Residential address
                                </p>
                                <p className="text-gray-700 font-medium leading-relaxed">
                                    {[
                                        user?.personal_information?.street,
                                        user?.personal_information?.barangay,
                                        user?.personal_information?.city,
                                        user?.personal_information?.province,
                                        user?.personal_information?.zip_code,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            </div>
                        </Card>

                        {/* Emergency Contact */}
                        <Card
                            title="Emergency Contact"
                            icon={<AlertCircle size={15} />}
                            theme={CARD_THEMES.blue}
                        >
                            <div className="space-y-2 text-sm">
                                <InfoRow
                                    label="Name"
                                    value={
                                        user?.personal_information?.contact_name
                                    }
                                />
                                <InfoRow
                                    label="Relationship"
                                    value={
                                        user?.personal_information
                                            ?.contact_relationship
                                    }
                                />
                                <InfoRow
                                    label="Phone"
                                    value={
                                        user?.personal_information
                                            ?.contact_number
                                    }
                                />
                            </div>
                        </Card>
                    </div>

                    {/* ── Bottom Row ───────────────────────────────────── */}
                    <Card
                        title="Education"
                        icon={<BookOpen size={15} />}
                        theme={CARD_THEMES.orange}
                    >
                        <TimelineItem
                            theme={CARD_THEMES.orange}
                            title={user?.personal_information?.school_name}
                            subtitle={user?.personal_information?.course}
                            metaText={
                                user?.personal_information
                                    ?.highest_level_of_education
                                    ? `Level: ${user?.personal_information?.highest_level_of_education}`
                                    : null
                            }
                            dateText={
                                user?.personal_information?.year_graduated
                            }
                            isLast={true}
                        />
                    </Card>

                    <Card
                        title="Skills"
                        icon={<User size={15} />}
                        theme={CARD_THEMES.purple}
                    >
                        <div className="space-y-4 overflow-y-auto max-h-52">
                            {user?.skills?.map((res, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium text-gray-700">
                                            {res.skill}
                                        </p>
                                        <span
                                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CARD_THEMES.purple.badge}`}
                                        >
                                            {res.percentage}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-400 rounded-full transition-all"
                                            style={{
                                                width: `${res.percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card
                        title="Working Experience"
                        icon={<Briefcase size={15} />}
                        theme={CARD_THEMES.blue}
                    >
                        <div className="space-y-4 overflow-y-auto max-h-52">
                            {user?.working_experience?.map((res, index) => (
                                <TimelineItem
                                    key={index}
                                    theme={CARD_THEMES.blue}
                                    title={res.company_name}
                                    subtitle={res.position}
                                    metaText={res.job_description}
                                    dateText={`${res.start_date} – ${res.end_date}`}
                                    isLast={
                                        index ===
                                        user.working_experience.length - 1
                                    }
                                />
                            ))}
                        </div>
                    </Card>

                    <Card
                        title="Government Information"
                        icon={<Shield size={15} />}
                        theme={CARD_THEMES.orange}
                    >
                        <div className="space-y-2 text-sm">
                            <InfoRow
                                label="Gov't ID Type"
                                value={
                                    user?.personal_information?.government_type
                                }
                            />
                            <InfoRow
                                label="ID Number"
                                value={user?.personal_information?.id_number}
                            />
                            <InfoRow
                                label="SSS"
                                value={user?.personal_information?.sss}
                            />
                            <InfoRow
                                label="PhilHealth"
                                value={user?.personal_information?.philhealth}
                            />
                            <InfoRow
                                label="Pag-Ibig"
                                value={user?.personal_information?.pagibig}
                            />
                            <InfoRow
                                label="TIN #"
                                value={user?.personal_information?.tin}
                            />
                        </div>
                    </Card>

                    <Card
                        title="QR Code"
                        icon={<QrCode size={15} />}
                        theme={CARD_THEMES.purple}
                    >
                        <div className="flex justify-center p-2">
                            <QRCodeSVG
                                className="h-52"
                                value={user?.account_employee?.employee_id}
                                size={400}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                            />
                        </div>
                    </Card>

                    <Card
                        title="E-Signature"
                        icon={<PenLine size={15} />}
                        theme={CARD_THEMES.orange}
                    >
                        <div className="flex justify-center bg-white border border-orange-100 rounded-xl">
                            <img
                                src={user?.account_employee?.signature}
                                className="w-full object-contain h-52"
                                alt="Signature"
                            />
                        </div>
                    </Card>
                </div>
            </EmployeeLayout>
        </Layout>
    );
};

// ─── Reusable Components ──────────────────────────────────────────────────────

const Card = ({ title, icon, theme = CARD_THEMES.blue, children }) => (
    <div
        className={`rounded-2xl border shadow-sm overflow-hidden ${theme.border} bg-white min-h-52`}
    >
        {/* Colored Card Header */}
        <div
            className={`flex items-center gap-2.5 px-5 py-3.5 ${theme.bg} border-b ${theme.border}`}
        >
            <span className={`p-1.5 rounded-lg ${theme.icon}`}>{icon}</span>
            <h3 className={`text-sm font-bold ${theme.title}`}>{title}</h3>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start gap-2 py-1 border-b border-gray-50 last:border-0">
        <p className="text-gray-400 text-xs shrink-0">{label}</p>
        <p className="font-medium text-gray-800 text-xs text-right">{value}</p>
    </div>
);

const InfoPill = ({ icon, label }) =>
    label ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
            {icon}
            {label}
        </span>
    ) : null;

const StatBox = ({ label, value }) => (
    <div className="bg-gray-50 rounded-xl px-3 py-2.5">
        <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">
            {label}
        </p>
        <p className="font-semibold text-gray-800 text-sm mt-0.5 break-words leading-snug">
            {value || "—"}
        </p>
    </div>
);

const TimelineItem = ({
    title,
    subtitle,
    metaText,
    dateText,
    isLast,
    theme = CARD_THEMES.blue,
}) => (
    <div className="relative pl-5 pb-1">
        {!isLast && (
            <div
                className={`absolute left-[5px] top-3 w-[2px] h-full ${theme.line}`}
            />
        )}
        <div
            className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${theme.dot}`}
        />
        <p className="font-semibold text-sm text-gray-800 leading-snug">
            {title}
        </p>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        {metaText && (
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">
                {metaText}
            </p>
        )}
        {dateText && (
            <span
                className={`inline-block text-[11px] font-medium mt-1 px-2 py-0.5 rounded-full ${theme.badge}`}
            >
                {dateText}
            </span>
        )}
    </div>
);

export default Page;
