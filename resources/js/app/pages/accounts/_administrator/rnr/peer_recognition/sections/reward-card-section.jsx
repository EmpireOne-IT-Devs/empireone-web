import Card from "@/app/_components/card";
import Modal from "@/app/_components/modal";
import Skeleton from "@/app/_components/skeleton";
import CertificateRewardSection from "./certificate-reward-section";
import {
    Heart,
    Share2,
    Briefcase,
    Lightbulb,
    ArrowRight,
    HeartHandshake,
    Star,
    Trophy,
    Sparkles,
    Quote,
    Award,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_engagement_reward_recognitions_thunk } from "@/app/redux/engagement-thunk";
import { syncRewardRecognitionInteraction } from "@/app/redux/engagement-slice";
import { toggle_reward_recognition_reaction_service } from "@/app/services/engagement-service";
import moment from "moment";

// ── Color theme per category variant ─────────────────────────────────────
// One place controls the chip, the top accent bar, the tinted message
// panel, the quote icon, and the card's hover glow — so every element on
// a card stays visually tied to its category.
const VARIANT_THEME = {
    primary: {
        chip: "border-blue-200 bg-blue-50 text-blue-700",
        bar: "from-blue-500 via-sky-500 to-cyan-400",
        panel: "bg-blue-50/60",
        quote: "text-blue-300",
        glow: "hover:shadow-blue-200/60",
        ring: "ring-blue-100",
    },
    warning: {
        chip: "border-amber-200 bg-amber-50 text-amber-700",
        bar: "from-amber-400 via-orange-400 to-yellow-400",
        panel: "bg-amber-50/60",
        quote: "text-amber-300",
        glow: "hover:shadow-amber-200/60",
        ring: "ring-amber-100",
    },
    purple: {
        chip: "border-purple-200 bg-purple-50 text-purple-700",
        bar: "from-purple-500 via-fuchsia-500 to-pink-500",
        panel: "bg-purple-50/60",
        quote: "text-purple-300",
        glow: "hover:shadow-purple-200/60",
        ring: "ring-purple-100",
    },
    success: {
        chip: "border-green-200 bg-green-50 text-green-700",
        bar: "from-emerald-500 via-green-500 to-lime-400",
        panel: "bg-green-50/60",
        quote: "text-green-300",
        glow: "hover:shadow-green-200/60",
        ring: "ring-green-100",
    },
    info: {
        chip: "border-cyan-200 bg-cyan-50 text-cyan-700",
        bar: "from-cyan-500 via-teal-500 to-sky-400",
        panel: "bg-cyan-50/60",
        quote: "text-cyan-300",
        glow: "hover:shadow-cyan-200/60",
        ring: "ring-cyan-100",
    },
    secondary: {
        chip: "border-slate-200 bg-slate-50 text-slate-700",
        bar: "from-slate-500 via-slate-400 to-slate-300",
        panel: "bg-slate-50/60",
        quote: "text-slate-300",
        glow: "hover:shadow-slate-200/60",
        ring: "ring-slate-100",
    },
};

const DEFAULT_THEME = VARIANT_THEME.primary;

// Vivid gradient avatar backgrounds, cycled by name so the same person
// always renders the same color without needing extra data from the API.
const AVATAR_GRADIENTS = [
    "bg-gradient-to-br from-orange-400 to-pink-500",
    "bg-gradient-to-br from-purple-500 to-indigo-500",
    "bg-gradient-to-br from-cyan-400 to-blue-500",
    "bg-gradient-to-br from-emerald-400 to-teal-500",
    "bg-gradient-to-br from-amber-400 to-orange-500",
    "bg-gradient-to-br from-pink-500 to-rose-500",
    "bg-gradient-to-br from-sky-400 to-indigo-500",
    "bg-gradient-to-br from-lime-400 to-green-500",
];

function gradientForName(name = "") {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function RewardCard({ item, reacting, onReact }) {
    const CategoryIcon = item.category?.icon || Award;
    const theme = VARIANT_THEME[item.category?.variant] || DEFAULT_THEME;
    const authorGradient = item.author?.avatarColor || gradientForName(item.author?.name);
    const recipientGradient = item.recipient?.avatarColor || gradientForName(item.recipient?.name);

    return (
        <Card
            className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-xl ${theme.glow}`}
        >
            {/* Colorful top accent bar, themed to the award category */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${theme.bar}`} />

            <div className="flex h-full flex-col p-5">
                {/* Header: author + date */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white shadow-sm ring-2 ring-white ${authorGradient}`}
                        >
                            {item.author?.avatar ? (
                                <img
                                    className="h-full w-full object-cover"
                                    src={item.author.avatar}
                                    alt={item.author?.name || "Author avatar"}
                                />
                            ) : (
                                <span>{item.author?.initials || "?"}</span>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                {item.author?.name || "Anonymous"}
                            </h3>
                            {item.author?.department && (
                                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                    <Briefcase size={12} />
                                    {item.author.department}
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="whitespace-nowrap text-xs text-gray-400">
                        {moment(item.createdAt).format("MMM D, YYYY")}
                    </span>
                </div>

                {/* Category + company value chips — bold, saturated pills */}
                <div className="mt-3 flex flex-wrap gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${theme.chip}`}
                    >
                        <CategoryIcon size={13} />
                        {item.category?.name || "Recognition"}
                    </span>
                    {item.company_value && (
                        <span className="inline-flex items-center rounded-full border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-indigo-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
                            {item.company_value}
                        </span>
                    )}
                </div>

                {/* Author -> Recipient flow, tinted to match the category */}
                <div
                    className={`mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white px-3 py-2.5 ${theme.panel}`}
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 text-xs font-medium text-gray-500">
                            Recognized
                        </span>
                        <ArrowRight size={14} className="shrink-0 text-gray-400" />
                        <div className="flex min-w-0 items-center gap-2">
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold text-white ring-2 ring-white ${recipientGradient}`}
                            >
                                {item.recipient?.avatar ? (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={item.recipient.avatar}
                                        alt={item.recipient?.name || "Recipient avatar"}
                                    />
                                ) : (
                                    <span>{item.recipient?.initials || "?"}</span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                    {item.recipient?.name || "Team Member"}
                                </p>
                                {item.recipient?.department && (
                                    <p className="truncate text-xs text-gray-500">
                                        {item.recipient.department}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message, tinted panel matching the category theme */}
                <div className={`relative mt-4 flex-1 rounded-2xl px-4 py-3 ${theme.panel}`}>
                    <Quote
                        size={14}
                        className={`mb-1 rotate-180 ${theme.quote}`}
                        fill="currentColor"
                    />
                    <p className="text-sm leading-relaxed text-gray-700">
                        {item.message}
                    </p>
                </div>

                <div className="my-4 border-t border-gray-100" />

                {/* Footer actions */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={(e) => onReact(e, item)}
                        disabled={reacting}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 transition-colors ${
                            item.user_has_reacted
                                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white ring-rose-300"
                                : "bg-white text-gray-600 ring-gray-200 hover:bg-rose-50 hover:text-rose-500 hover:ring-rose-200"
                        }`}
                    >
                        <Heart
                            size={14}
                            className={item.user_has_reacted ? "fill-white text-white" : ""}
                        />
                        {item.likes}
                    </button>

                    <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 hover:text-white hover:ring-indigo-300"
                    >
                        <Share2 size={14} />
                        Share
                    </button>
                </div>
            </div>
        </Card>
    );
}

export default function RewardCardSection({ selectedCategory = "All Awards" }) {
    const dispatch = useDispatch();
    const { rewardRecognitions, rewardRecognitionsLoading } = useSelector(
        (state) => state.engagement,
    );
    const reactingIds = useRef(new Set());
    const [, forceUpdate] = useState(0);
    const [selectedCertificateItem, setSelectedCertificateItem] = useState(null);

    useEffect(() => {
        dispatch(get_engagement_reward_recognitions_thunk());
    }, [dispatch]);

    async function handleReact(e, item) {
        e.stopPropagation();
        if (reactingIds.current.has(item.id)) return;

        reactingIds.current.add(item.id);
        forceUpdate((n) => n + 1);

        const wasReacted = item.user_has_reacted;
        const prevCount = item.likes;

        dispatch(
            syncRewardRecognitionInteraction({
                id: item.id,
                reaction_count: wasReacted ? prevCount - 1 : prevCount + 1,
                user_has_reacted: !wasReacted,
            }),
        );

        try {
            const res = await toggle_reward_recognition_reaction_service(item.id);
            const { reaction_count, user_has_reacted } = res.data.data;
            dispatch(syncRewardRecognitionInteraction({ id: item.id, reaction_count, user_has_reacted }));
        } catch {
            dispatch(
                syncRewardRecognitionInteraction({
                    id: item.id,
                    reaction_count: prevCount,
                    user_has_reacted: wasReacted,
                }),
            );
        } finally {
            reactingIds.current.delete(item.id);
            forceUpdate((n) => n + 1);
        }
    }

    const mapCategory = (cat) => {
        const name = (cat || "").toString().trim();
        const key = name.toLowerCase();

        if (!name) {
            return { name: "Recognition", icon: Award, variant: "primary" };
        }

        if (key.includes("star") || key.includes("excellence")) {
            return { name, icon: Star, variant: "primary" };
        }
        if (key.includes("innovat") || key.includes("creativ") || key.includes("idea")) {
            return { name, icon: Lightbulb, variant: "warning" };
        }
        if (key.includes("team") || key.includes("collaboration") || key.includes("together")) {
            return { name, icon: HeartHandshake, variant: "purple" };
        }
        if (key.includes("customer") || key.includes("champion") || key.includes("client")) {
            return { name, icon: Sparkles, variant: "success" };
        }
        if (key.includes("lead") || key.includes("mentor") || key.includes("trophy")) {
            return { name, icon: Trophy, variant: "info" };
        }
        if (key.includes("integrity") || key.includes("trust")) {
            return { name, icon: Trophy, variant: "secondary" };
        }

        return { name, icon: Award, variant: "primary" };
    };

    const filteredRecognitions =
        selectedCategory === "All Awards"
            ? rewardRecognitions
            : (rewardRecognitions || []).filter((r) => {
                  const awardCat = (r.award_category || "").toLowerCase().trim();
                  const compVal = (r.company_value || "").toLowerCase().trim();
                  const target = selectedCategory.toLowerCase().trim();

                  return awardCat === target || compVal === target;
              });

    const mapped = (filteredRecognitions || []).map((r) => {
        const author = r.user || {};
        const employee = r.employee || {};

        const initials = (name) => {
            if (!name) return "";
            return name
                .trim()
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
        };

        const authorFullName = `${author.first_name || ""} ${author.last_name || ""}`.trim();
        const recipientFullName = `${employee.first_name || ""} ${employee.last_name || ""}`.trim();

        const categoryText = r.award_category || r.company_value || "Recognition";
        const cat = mapCategory(categoryText);

        const authorDepartment =
            (typeof author.department === "string"
                ? author.department
                : author.department?.name) ||
            author.account?.name ||
            "";
        const recipientDepartment =
            (typeof employee.department === "string"
                ? employee.department
                : employee.department?.name) ||
            employee.account?.name ||
            "";

        return {
            id: r.id,
            author: {
                name: authorFullName,
                initials: initials(authorFullName),
                avatar: author.profile_image || author.avatar || null,
                department: authorDepartment,
                // Deterministic gradient per person instead of one fixed color for everyone
                avatarColor: gradientForName(authorFullName),
            },
            recipient: {
                name: recipientFullName,
                initials: initials(recipientFullName),
                avatar: employee.profile_image || employee.avatar || null,
                department: recipientDepartment,
                avatarColor: gradientForName(recipientFullName || "recipient"),
            },
            category: {
                name: cat.name,
                icon: cat.icon,
                variant: cat.variant,
            },
            // Shown as a secondary chip, separate from award_category,
            // mirroring the two distinct fields in the Recognize Someone form.
            company_value:
                r.company_value && r.company_value !== r.award_category
                    ? r.company_value
                    : null,
            message: r.message,
            createdAt: r.published_at || r.created_at,
            likes: r.reaction_count || 0,
            user_has_reacted: r.user_has_reacted || false,
        };
    });

    const loadingCards = Array.from({ length: 6 }, (_, index) => (
        <div key={index}>
            <Skeleton variant="card" />
        </div>
    ));

    // Maps a mapped recognition item into the shape CertificateRewardSection expects.
    const toCertificate = (item) => ({
        id: item.id,
        certificate_number: `REC-${item.id}`,
        recipient_name: item.recipient?.name,
        recipient_role: item.recipient?.department || "",
        department: item.recipient?.department || "",
        award_title: item.category?.name,
        category: item.category?.name,
        message: item.message,
        company_name: "",
        badge_variant: item.category?.variant,
    });

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rewardRecognitionsLoading
                ? loadingCards
                : mapped.map((item) => (
                      <div
                          key={item.id}
                          onClick={() => setSelectedCertificateItem(item)}
                          className="cursor-pointer"
                      >
                          <RewardCard
                              item={item}
                              reacting={reactingIds.current.has(item.id)}
                              onReact={handleReact}
                          />
                      </div>
                  ))}

            <Modal
                isOpen={!!selectedCertificateItem}
                onClose={() => setSelectedCertificateItem(null)}
                width="max-w-4xl"
                title="Reward Certificate"
            >
                {selectedCertificateItem && (
                    <CertificateRewardSection
                        certificates={[toCertificate(selectedCertificateItem)]}
                        hideList
                    />
                )}
            </Modal>
        </div>
    );
}