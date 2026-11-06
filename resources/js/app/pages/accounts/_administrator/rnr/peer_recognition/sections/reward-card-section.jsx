import Card from "@/app/_components/card";
import Modal from "@/app/_components/modal";
import Skeleton from "@/app/_components/skeleton";
import CertificateRewardSection from "./certificate-reward-section";
import {
    FiHeart as Heart,
    FiShare2 as Share2,
    FiBriefcase as Briefcase,
    FiArrowRight as ArrowRight,
    FiStar as Star,
    FiStar as Sparkles,
    FiMessageSquare as Quote,
    FiAward as Award,
} from "react-icons/fi";
import {
    FaLightbulb as Lightbulb,
    FaHandshake as HeartHandshake,
    FaTrophy as Trophy,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_engagement_reward_recognitions_thunk } from "@/app/redux/engagement-thunk";
import { syncRewardRecognitionInteraction } from "@/app/redux/engagement-slice";
import { toggle_reward_recognition_reaction_service } from "@/app/services/engagement-service";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";
import moment from "moment";

// ── Color theme per category variant ─────────────────────────────────────
const VARIANT_THEME = {
    primary: {
        chip: "border-blue-200/80 bg-blue-50/80 text-blue-700",
        bar: "from-blue-600 via-sky-500 to-cyan-400",
        panel: "bg-blue-50/40 border-blue-100/60",
        quote: "text-blue-400/70",
        glow: "hover:shadow-blue-500/10 hover:border-blue-200",
        ring: "ring-blue-100",
    },
    warning: {
        chip: "border-amber-200/80 bg-amber-50/80 text-amber-700",
        bar: "from-amber-500 via-orange-400 to-yellow-400",
        panel: "bg-amber-50/40 border-amber-100/60",
        quote: "text-amber-400/70",
        glow: "hover:shadow-amber-500/10 hover:border-amber-200",
        ring: "ring-amber-100",
    },
    purple: {
        chip: "border-purple-200/80 bg-purple-50/80 text-purple-700",
        bar: "from-purple-600 via-fuchsia-500 to-pink-500",
        panel: "bg-purple-50/40 border-purple-100/60",
        quote: "text-purple-400/70",
        glow: "hover:shadow-purple-500/10 hover:border-purple-200",
        ring: "ring-purple-100",
    },
    success: {
        chip: "border-emerald-200/80 bg-emerald-50/80 text-emerald-700",
        bar: "from-emerald-600 via-green-500 to-teal-400",
        panel: "bg-emerald-50/40 border-emerald-100/60",
        quote: "text-emerald-400/70",
        glow: "hover:shadow-emerald-500/10 hover:border-emerald-200",
        ring: "ring-emerald-100",
    },
    info: {
        chip: "border-cyan-200/80 bg-cyan-50/80 text-cyan-700",
        bar: "from-cyan-600 via-teal-500 to-sky-400",
        panel: "bg-cyan-50/40 border-cyan-100/60",
        quote: "text-cyan-400/70",
        glow: "hover:shadow-cyan-500/10 hover:border-cyan-200",
        ring: "ring-cyan-100",
    },
    secondary: {
        chip: "border-slate-200/80 bg-slate-100/80 text-slate-700",
        bar: "from-slate-600 via-slate-500 to-slate-400",
        panel: "bg-slate-50/60 border-slate-200/60",
        quote: "text-slate-400/70",
        glow: "hover:shadow-slate-500/10 hover:border-slate-300",
        ring: "ring-slate-100",
    },
};

const DEFAULT_THEME = VARIANT_THEME.primary;

const AVATAR_GRADIENTS = [
    "bg-gradient-to-br from-orange-400 to-pink-500",
    "bg-gradient-to-br from-purple-500 to-indigo-600",
    "bg-gradient-to-br from-cyan-400 to-blue-600",
    "bg-gradient-to-br from-emerald-400 to-teal-600",
    "bg-gradient-to-br from-amber-400 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-rose-600",
    "bg-gradient-to-br from-sky-400 to-indigo-600",
    "bg-gradient-to-br from-lime-500 to-emerald-600",
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
            className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.glow}`}
        >
            {/* Top Accent Gradient Bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${theme.bar}`} />

            <div className="flex h-full flex-col p-6">
                {/* Header: Author + Timestamp */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xs font-bold text-white shadow-xs ring-2 ring-white ${authorGradient}`}
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
                            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                                {item.author?.name || "Anonymous"}
                            </h3>
                            {item.author?.department && (
                                <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                    <Briefcase size={11} className="text-slate-400" />
                                    <span className="truncate max-w-[160px]">{item.author.department}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-400 border border-slate-100">
                        {moment(item.createdAt).format("MMM D, YYYY")}
                    </span>
                </div>

                {/* Category & Company Value Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-2xs ${theme.chip}`}
                    >
                        <CategoryIcon size={13} />
                        {item.category?.name || "Recognition"}
                    </span>
                    {item.company_value && (
                        <span className="inline-flex items-center rounded-lg border border-fuchsia-200/80 bg-fuchsia-50/80 px-2.5 py-1 text-xs font-semibold text-fuchsia-700">
                            {item.company_value}
                        </span>
                    )}
                </div>

                {/* Recognition Flow Pill */}
                <div
                    className={`mt-4 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${theme.panel}`}
                >
                    <div className="flex min-w-0 items-center gap-2.5">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            To
                        </span>
                        <ArrowRight size={13} className="text-slate-400 shrink-0" />
                        <div className="flex min-w-0 items-center gap-2.5">
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[11px] font-bold text-white ring-2 ring-white ${recipientGradient}`}
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
                                <p className="truncate text-xs font-bold text-slate-900">
                                    {item.recipient?.name || "Team Member"}
                                </p>
                                {item.recipient?.department && (
                                    <p className="truncate text-[11px] text-slate-500">
                                        {item.recipient.department}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Body Box */}
                <div className="relative mt-4 flex-1 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors group-hover:bg-slate-50">
                    <Quote
                        size={16}
                        className={`absolute top-3 right-3 opacity-40 ${theme.quote}`}
                    />
                    <p
                        className="text-xs leading-relaxed text-slate-600 line-clamp-4 pr-3"
                    >
                        {item.message}
                    </p>
                </div>

                <div className="my-4 border-t border-slate-100" />

                {/* Footer Interactions */}
                <div className="flex items-center justify-between pt-1">
                    <button
                        type="button"
                        onClick={(e) => onReact(e, item)}
                        disabled={reacting}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all active:scale-95 ${
                            item.user_has_reacted
                                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        }`}
                    >
                        <Heart
                            size={14}
                            className={`transition-transform duration-200 ${item.user_has_reacted ? "fill-white text-white scale-110" : "text-slate-400"}`}
                        />
                        <span>{item.likes}</span>
                    </button>

                    <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95"
                    >
                        <Share2 size={13} />
                        <span>Share</span>
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
    const { user, isContentManager } = useCurrentEmployee();
    const currentUserId = user?.id != null ? Number(user.id) : null;
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
            authorId: author.id != null ? Number(author.id) : null,
            recipientId: employee.id != null ? Number(employee.id) : null,
            author: {
                name: authorFullName,
                initials: initials(authorFullName),
                avatar: author.profile_image || author.avatar || null,
                department: authorDepartment,
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

    const toCertificate = (item) => ({
        id: item.id,
        certificate_number: `REC-${item.id}`,
        recipient_name: item.recipient?.name,
        recipient_role: item.recipient?.department || "",
        department: item.recipient?.department || "",
        award_title: item.category?.name,
        category: item.category?.name,
        message: item.message,
        created_at: item.createdAt,
        pointsAwarded: item.pointsAwarded ?? 0,
        company_name: "",
        badge_variant: item.category?.variant,
    });

    // Only content managers (dept 1/11), the recipient who was recognized,
    // or the author who sent the recognition may open the certificate.
    // Everyone else sees the card but it is not clickable.
    const canViewCertificate = (item) => {
        if (isContentManager) return true;
        if (currentUserId === null) return false;

        return (
            item.recipientId === currentUserId ||
            item.authorId === currentUserId
        );
    };

    const handleCardClick = (item) => {
        if (canViewCertificate(item)) {
            setSelectedCertificateItem(item);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rewardRecognitionsLoading
                ? loadingCards
                : mapped.map((item) => {
                      const clickable = canViewCertificate(item);

                      return (
                          <div
                              key={item.id}
                              onClick={() => handleCardClick(item)}
                              className={clickable ? "cursor-pointer" : "cursor-default"}
                              title={
                                  clickable
                                      ? undefined
                                      : "Only the recipient, the sender, or an administrator can view this certificate"
                              }
                          >
                              <RewardCard
                                  item={item}
                                  reacting={reactingIds.current.has(item.id)}
                                  onReact={handleReact}
                              />
                          </div>
                      );
                  })}

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