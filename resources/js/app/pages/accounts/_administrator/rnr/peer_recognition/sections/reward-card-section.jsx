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

// Chip colors kept in the same soft, bordered "pill" language as the
// company-value / award-point chips in the Recognize Someone modal.
const VARIANT_CHIP_COLORS = {
    primary: "border-blue-200 bg-blue-50 text-blue-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    success: "border-green-200 bg-green-50 text-green-700",
    info: "border-cyan-200 bg-cyan-50 text-cyan-700",
    secondary: "border-slate-200 bg-slate-50 text-slate-700",
};

function RewardCard({ item, reacting, onReact }) {
    const CategoryIcon = item.category?.icon || Award;
    const chipColorClasses =
        VARIANT_CHIP_COLORS[item.category?.variant] ||
        "border-gray-200 bg-gray-50 text-gray-700";

    return (
        <Card className="group relative flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg">
            {/* Header: author + date */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white shadow-sm ${item.author?.avatarColor}`}
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

            {/* Category + company value chips, styled like the modal's
               "Company Value" pill picker */}
            <div className="mt-3 flex flex-wrap gap-2">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${chipColorClasses}`}
                >
                    <CategoryIcon size={13} />
                    {item.category?.name || "Recognition"}
                </span>
                {item.company_value && (
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        {item.company_value}
                    </span>
                )}
            </div>

            {/* Author -> Recipient flow, same soft rounded-2xl surface used
               for the selected-employee confirmation in the modal */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 text-xs font-medium text-gray-400">
                        Recognized
                    </span>
                    <ArrowRight size={14} className="shrink-0 text-gray-300" />
                    <div className="flex min-w-0 items-center gap-2">
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold text-white ${item.recipient?.avatarColor}`}
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
                            <p className="truncate text-sm font-medium text-gray-900">
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

                {/* Points pill — matches the award-point preset chips
                   (border-amber-500 bg-amber-100) from the modal */}
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-amber-500 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 shadow-sm">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>+{item.award_point || 0} pts</span>
                </div>
            </div>

            {/* Message, in the same soft rounded surface as the modal's
               text inputs rather than a hard left-rule quote block */}
            <div className="relative mt-4 flex-1 rounded-2xl bg-gray-50 px-4 py-3">
                <Quote
                    size={14}
                    className="mb-1 rotate-180 text-gray-300"
                    fill="currentColor"
                />
                <p className="text-sm leading-relaxed text-gray-700">
                    {item.message}
                </p>
            </div>

            <div className="my-4 border-t border-gray-100" />

            {/* Footer actions as rounded-full pill buttons, matching the
               "Change selection" button style in the modal */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={(e) => onReact(e, item)}
                    disabled={reacting}
                    className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-red-50 hover:text-red-500 hover:ring-red-200 ${
                        item.user_has_reacted ? "text-red-500 ring-red-200" : "text-gray-600"
                    }`}
                >
                    <Heart
                        size={14}
                        className={item.user_has_reacted ? "fill-red-500 text-red-500" : ""}
                    />
                    {item.likes}
                </button>

                <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                    <Share2 size={14} />
                    Share
                </button>
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

        const avatarColor = "bg-orange-400";
        const avatarColor1 = "bg-purple-400";

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
                name: `${author.first_name || ""} ${author.last_name || ""}`.trim(),
                initials: initials(
                    `${author.first_name || ""} ${author.last_name || ""}`,
                ),
                avatar: author.profile_image || author.avatar || null,
                department: authorDepartment,
                avatarColor,
            },
            recipient: {
                name: `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
                initials: initials(
                    `${employee.first_name || ""} ${employee.last_name || ""}`,
                ),
                avatar: employee.profile_image || employee.avatar || null,
                department: recipientDepartment,
                avatarColor: avatarColor1,
            },
            category: {
                name: cat.name,
                icon: cat.icon,
                variant: cat.variant,
            },
            // Shown as a secondary indigo chip, separate from award_category,
            // mirroring the two distinct fields in the Recognize Someone form.
            company_value:
                r.company_value && r.company_value !== r.award_category
                    ? r.company_value
                    : null,
            message: r.message,
            createdAt: r.published_at || r.created_at,
            likes: r.reaction_count || 0,
            user_has_reacted: r.user_has_reacted || false,
            award_point: r.award_point || 0,
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
        certificateNumber: `REC-${item.id}`,
        recipientName: item.recipient?.name,
        recipientRole: item.recipient?.department || "",
        department: item.recipient?.department || "",
        issuerName: item.author?.name,
        issuerTitle: item.author?.department || "Colleague",
        awardTitle: item.category?.name,
        category: item.category?.name,
        pointsAwarded: item.award_point,
        issueDate: item.createdAt,
        message: item.message,
        companyName: "EmpireOne",
        badgeVariant: item.category?.variant,
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