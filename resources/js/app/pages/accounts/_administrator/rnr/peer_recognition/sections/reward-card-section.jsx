import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import Skeleton from "@/app/_components/skeleton";
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
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_engagement_reward_recognitions_thunk } from "@/app/redux/engagement-thunk";
import moment from "moment";

const VARIANT_BORDER_COLORS = {
    primary: "border-blue-200 hover:border-blue-300",
    warning: "border-amber-200 hover:border-amber-300",
    purple: "border-purple-200 hover:border-purple-300",
    success: "border-green-200 hover:border-green-300",
    info: "border-cyan-200 hover:border-cyan-300",
    secondary: "border-slate-200 hover:border-slate-300",
};

const VARIANT_BADGE_COLORS = {
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-cyan-50 text-cyan-700 border-cyan-200",
    secondary: "bg-slate-50 text-slate-700 border-slate-200",
};

function RewardCard({ item }) {
    const CategoryIcon = item.category.icon;
    const borderColorClasses =
        VARIANT_BORDER_COLORS[item.category.variant] ||
        "border-gray-200 hover:border-gray-300";
    const badgeColorClasses =
        VARIANT_BADGE_COLORS[item.category.variant] ||
        "bg-gray-50 text-gray-700 border-gray-200";

    return (
        <Card
            className={`group relative w-full h-full rounded-2xl border-2 ${borderColorClasses} bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
        >
            <Badge
                label={item.category.name}
                icon={CategoryIcon}
                variant={item.category.variant}
                className={`absolute -top-3 right-6 shadow-sm ring-1 ring-black/5 border ${badgeColorClasses}`}
            />

            <div className="flex items-start justify-between pt-1">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white  shadow-sm ${item.author.avatarColor}`}
                    >
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={
                                item?.author?.avatar || "/images/E1icon.png"
                            }
                            alt={item?.author?.name || "Author avatar"}
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {item.author.name}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                            <Briefcase size={12} />
                            {item.author.department}
                        </div>
                    </div>
                </div>

                <span className="whitespace-nowrap text-xs text-gray-400">
                    {moment(item.createdAt).format("MMM D, YYYY")}
                </span>
            </div>

            {/* Author -> Recipient flow */}
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                <span className="text-xs font-medium text-gray-400">
                    Recognized
                </span>
                <ArrowRight size={14} className="shrink-0 text-gray-300" />
                <div className="flex min-w-0 items-center gap-2">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${item.recipient.avatarColor}`}
                    >
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={
                                item?.recipient?.avatar ||
                                "/images/E1icon.png"
                            }
                            alt={item?.recipient?.name || "Recipient avatar"}
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                            {item.recipient.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                            {item.recipient.department}
                        </p>
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="relative mt-4 border-l-2 border-gray-200 pl-4">
                <Quote
                    size={16}
                    className="absolute -left-[9px] -top-1 rotate-180 text-gray-300"
                    fill="currentColor"
                />
                <p className="text-sm leading-relaxed text-gray-700">
                    {item.message}
                </p>
            </div>

            <div className="my-5 border-t border-gray-100" />

            {/* Footer */}
            <div className="flex items-center justify-between text-gray-500">
                <div className="flex items-center gap-1">
                    <button className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-red-50 hover:text-red-500">
                        <Heart size={16} />
                        {item.likes}
                    </button>
                </div>

                <button className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900">
                    <Share2 size={16} />
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

    useEffect(() => {
        dispatch(get_engagement_reward_recognitions_thunk());
    }, [dispatch]);

    const mapCategory = (cat) => {
        const name = (cat || "").toString();
        const key = name.toLowerCase();

        // Match award_category values
        if (key === "employee of the month") {
            return { name, icon: Star, variant: "primary" };
        }
        if (key === "innovation award" || key === "innovation") {
            return { name, icon: Lightbulb, variant: "warning" };
        }
        if (key === "rising star award") {
            return { name, icon: Star, variant: "primary" };
        }
        if (key === "team excellence award" || key.includes("team")) {
            return { name, icon: HeartHandshake, variant: "purple" };
        }
        if (key === "customer champion award" || key.includes("customer")) {
            return { name, icon: Sparkles, variant: "success" };
        }
        if (key === "mentor of the quarter" || key.includes("mentor")) {
            return { name, icon: Trophy, variant: "info" };
        }
        if (key === "innovation")
            return { name, icon: Lightbulb, variant: "warning" };
        if (key === "teamwork")
            return { name, icon: HeartHandshake, variant: "purple" };
        if (key === "excellence")
            return { name, icon: Star, variant: "primary" };
        if (key === "leadership")
            return { name, icon: Trophy, variant: "info" };
        if (key === "customer focus")
            return { name, icon: Sparkles, variant: "success" };
        if (key === "integrity")
            return { name, icon: Trophy, variant: "secondary" };
        if (key === "resilience")
            return { name, icon: Lightbulb, variant: "info" };
        if (key === "creativity")
            return { name, icon: Lightbulb, variant: "warning" };

        return { name, icon: Lightbulb, variant: "primary" };
    };

    const filteredRecognitions =
        selectedCategory === "All Awards"
            ? rewardRecognitions
            : (rewardRecognitions || []).filter((r) => {
                  const awardCategory = (r.award_category || "").toLowerCase();
                  return awardCategory === selectedCategory.toLowerCase();
              });

    const mapped = (filteredRecognitions || []).map((r) => {
        const author = r.user || {};
        const employee = r.employee || {};

        const initials = (name) => {
            if (!name) return "";
            return name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
        };

        const avatarColor = "bg-orange-400";
        const avatarColor1 = "bg-purple-400";

        const cat = mapCategory(r.award_category || r.company_value);
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
            message: r.message,
            createdAt: r.published_at || r.created_at,
            likes: r.reaction_count || 0,
        };
    });

    const loadingCards = Array.from({ length: 6 }, (_, index) => (
        <div key={index}>
            <Skeleton variant="card" />
        </div>
    ));

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 ">
            {rewardRecognitionsLoading
                ? loadingCards
                : mapped.map((item) => (
                      <RewardCard key={item.id} item={item} />
                  ))}
        </div>
    );
}