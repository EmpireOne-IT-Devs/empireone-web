import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import {
    Heart,
    MessageSquare,
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

const data = [
    {
        id: 1,
        author: {
            name: "Sarah Johnson",
            initials: "SJ",
            department: "Marketing",
            avatarColor: "bg-pink-500",
        },
        recipient: {
            name: "Michael Chen",
            initials: "MC",
            department: "Engineering",
            avatarColor: "bg-blue-700",
        },
        category: {
            name: " Innovation",
            icon: Lightbulb,
            bgColor: "bg-yellow-500",
            textColor: "text-white",
        },
        message:
            "Michael single-handedly revamped our CI/CD pipeline this sprint. The team's deployment time dropped by 60%. Truly innovative thinking! 🚀",
        createdAt: "2 hours ago",
        likes: 18,
        comments: 4,
    },
    {
        id: 2,
        author: {
            name: "David Wilson",
            initials: "DW",
            department: "Human Resources",
            avatarColor: "bg-green-500",
        },
        recipient: {
            name: "Emily Davis",
            initials: "ED",
            department: "Recruitment",
            avatarColor: "bg-purple-500",
        },
        category: {
            name: "Teamwork",
            icon: HeartHandshake,
            bgColor: "bg-pink-700",
            textColor: "text-pink-700",
        },
        message:
            "Emily went above and beyond by helping the onboarding team during our busiest hiring week. Thank you for always supporting everyone!",
        createdAt: "5 hours ago",
        likes: 26,
        comments: 8,
    },
    {
        id: 3,
        author: {
            name: "John Smith",
            initials: "JS",
            department: "Finance",
            avatarColor: "bg-indigo-500",
        },
        recipient: {
            name: "Olivia Brown",
            initials: "OB",
            department: "Accounting",
            avatarColor: "bg-orange-500",
        },
        category: {
            name: "Excellence",
            icon: Star,
            bgColor: "bg-blue-100",
            textColor: "text-blue-700",
        },
        message:
            "Olivia completed our quarterly financial reports ahead of schedule with outstanding accuracy. Excellent work!",
        createdAt: "Yesterday",
        likes: 41,
        comments: 12,
    },
    {
        id: 4,
        author: {
            name: "Rachel Lee",
            initials: "RL",
            department: "Operations",
            avatarColor: "bg-red-500",
        },
        recipient: {
            name: "Kevin Martinez",
            initials: "KM",
            department: "Logistics",
            avatarColor: "bg-cyan-600",
        },
        category: {
            name: "Leadership",
            icon: Trophy,
            bgColor: "bg-orange-500",
            textColor: "text-orange-700",
        },
        message:
            "Kevin demonstrated exceptional leadership during the warehouse migration and ensured zero operational downtime.",
        createdAt: "2 days ago",
        likes: 55,
        comments: 17,
    },
    {
        id: 5,
        author: {
            name: "Sophia Carter",
            initials: "SC",
            department: "Customer Support",
            avatarColor: "bg-teal-500",
        },
        recipient: {
            name: "Daniel Kim",
            initials: "DK",
            department: "Technical Support",
            avatarColor: "bg-slate-700",
        },
        category: {
            name: "Customer First",
            icon: Sparkles,
            bgColor: "bg-emerald-500",
            textColor: "text-emerald-700",
        },
        message:
            "Daniel consistently receives outstanding customer feedback and resolved over 150 support tickets with a 98% satisfaction rating this month.",
        createdAt: "3 days ago",
        likes: 72,
        comments: 21,
    },
];

function RewardCard({ item }) {
    const CategoryIcon = item.category.icon;

    return (
        <Card className="group relative w-full h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300">
            <Badge
                label={item.category.name}
                icon={CategoryIcon}
             
                className={`absolute -top-3 right-6 shadow-sm ring-1 ring-black/5 ${item.category.bgColor} ${item.category.textColor}`}
            />

            {/* Author + timestamp */}
            <div className="flex items-start justify-between pt-1">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-white shadow-sm ${item.author.avatarColor}`}
                    >
                        {item.author.initials}
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
                    {item.createdAt}
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
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${item.recipient.avatarColor}`}
                    >
                        {item.recipient.initials}
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

                    {/* <button className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-blue-50 hover:text-blue-500">
                        <MessageSquare size={16} />
                        {item.comments}
                    </button> */}
                </div>

                <button className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900">
                    <Share2 size={16} />
                    Share
                </button>
            </div>
        </Card>
    );
}

export default function RewardCardSection() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 ">
            {data.map((item) => (
                <RewardCard key={item.id} item={item} />
            ))}
        </div>
    );
}
