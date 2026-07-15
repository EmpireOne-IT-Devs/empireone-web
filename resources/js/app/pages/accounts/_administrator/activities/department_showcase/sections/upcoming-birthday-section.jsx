import React, { useEffect, useMemo, useRef } from "react";
import { Cake } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";

import { get_upcoming_birthdays_thunk } from "@/app/redux/engagement-slice";
import CreateBirthdayPost from "./create-birthday-post";
import ViewBirthdaySection from "./view-birthday-section";

const CARD_COLORS = [
    {
        card: "bg-[#EEEDFE] border-[#AFA9EC]",
        avatar: "bg-[#7F77DD]",
        badge: "bg-[#534AB7]",
        name: "text-[#3C3489]",
        dept: "text-[#534AB7]",
        pill: "bg-[#7F77DD] text-[#EEEDFE]",
        pillToday: "bg-[#534AB7] text-[#EEEDFE]",
    },
    {
        card: "bg-[#E1F5EE] border-[#5DCAA5]",
        avatar: "bg-[#1D9E75]",
        badge: "bg-[#0F6E56]",
        name: "text-[#085041]",
        dept: "text-[#0F6E56]",
        pill: "bg-[#1D9E75] text-[#E1F5EE]",
        pillToday: "bg-[#0F6E56] text-[#E1F5EE]",
    },
    {
        card: "bg-[#FAECE7] border-[#F0997B]",
        avatar: "bg-[#D85A30]",
        badge: "bg-[#993C1D]",
        name: "text-[#712B13]",
        dept: "text-[#993C1D]",
        pill: "bg-[#D85A30] text-[#FAECE7]",
        pillToday: "bg-[#993C1D] text-[#FAECE7]",
    },
    {
        card: "bg-[#E6F1FB] border-[#85B7EB]",
        avatar: "bg-[#378ADD]",
        badge: "bg-[#185FA5]",
        name: "text-[#0C447C]",
        dept: "text-[#185FA5]",
        pill: "bg-[#378ADD] text-[#E6F1FB]",
        pillToday: "bg-[#185FA5] text-[#E6F1FB]",
    },
    {
        card: "bg-[#FAEEDA] border-[#EF9F27]",
        avatar: "bg-[#BA7517]",
        badge: "bg-[#854F0B]",
        name: "text-[#633806]",
        dept: "text-[#854F0B]",
        pill: "bg-[#BA7517] text-[#FAEEDA]",
        pillToday: "bg-[#854F0B] text-[#FAEEDA]",
    },
];

export default function UpcomingBirthdaySection() {
    const dispatch = useDispatch();

    const { birthdays, birthdayMonth, birthdayCount, birthdaysLoading: loading } = useSelector((state) => state.engagement);

    const birthdayPosts = birthdays ?? [];

    const carouselRef = useRef(null);
    const isPausedRef = useRef(false);

    // Duplicate items so the carousel loops seamlessly
    const scrollingItems = useMemo(
        () => [...birthdayPosts, ...birthdayPosts],
        [birthdayPosts],
    );

    // Dynamic current month formatting for the header
    const currentMonthLabel = useMemo(() => {
        return new Date().toLocaleString("default", { month: "long" });
    }, []);

    useEffect(() => {
        dispatch(get_upcoming_birthdays_thunk());
    }, [dispatch]);

    // Carousel autoscrolling animation
    useEffect(() => {
        const carousel = carouselRef.current;

        if (!carousel || scrollingItems.length === 0) {
            return undefined;
        }

        let animationFrameId;

        const animate = () => {
            if (isPausedRef.current) {
                animationFrameId = window.requestAnimationFrame(animate);
                return;
            }

            const halfwayPoint = carousel.scrollWidth / 2;
            carousel.scrollLeft += 0.6;

            if (carousel.scrollLeft >= halfwayPoint) {
                carousel.scrollLeft = 0;
            }

            animationFrameId = window.requestAnimationFrame(animate);
        };

        animationFrameId = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [scrollingItems]);

    return (
        <div className="w-full font-sans antialiased mt-2">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <Cake size={18} className="text-[#0b2265]" />
                <h2 className="text-sm font-bold text-gray-800 tracking-tight">
                    Upcoming {birthdayMonth} Birthdays
                </h2>
                <span className="inline-flex items-center justify-center bg-[#0b2265] text-white font-bold text-[11px] px-2 py-0.5 rounded-full min-w-[20px]">
                    {birthdayCount}
                </span>
                <div className="ml-auto flex items-center gap-2">
                    <ViewBirthdaySection />
                    <CreateBirthdayPost />
                </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="flex gap-4 overflow-hidden pb-3 pt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="shrink-0 w-[260px] h-[210px] bg-gray-100 rounded-2xl animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && birthdayPosts.length === 0 && (
                <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                    No active birthday posts found.
                </div>
            )}

            {/* Carousel */}
            {!loading && scrollingItems.length > 0 && (
                <div
                    ref={carouselRef}
                    onMouseEnter={() => {
                        isPausedRef.current = true;
                    }}
                    onMouseLeave={() => {
                        isPausedRef.current = false;
                    }}
                    className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                    {scrollingItems.map((person, index) => {
                        const color = CARD_COLORS[index % CARD_COLORS.length];

                        return (
                            <Card
                                key={`${person.user_id}-${index}`}
                                variant="default"
                                padding="p-4"
                                className={`shrink-0 w-[260px] ${color.card} border rounded-2xl shadow-sm flex flex-col items-center justify-between text-center relative group hover:brightness-95 transition-all duration-200`}
                            >
                                <div className="flex flex-col items-center w-full">
                                    <div className="relative mb-2">
                                        {person.profile_picture || person.avatar ? (
                                            <img
                                                src={person.profile_picture ?? person.avatar}
                                                alt={person.name}
                                                className="w-14 h-14 rounded-full object-cover shadow-sm"
                                            />
                                        ) : (
                                            <div
                                                className={`w-14 h-14 rounded-full ${color.avatar} flex items-center justify-center text-white font-bold text-base tracking-wide shadow-sm`}
                                            >
                                                {person.initials || "?"}
                                            </div>
                                        )}
                                        <div
                                            className={`absolute -top-1 -right-1 ${color.badge} text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center`}
                                        >
                                            <Cake size={10} className="stroke-[2.5]" />
                                        </div>
                                    </div>

                                    {/* Name & Department */}
                                    <div className="flex flex-col items-center">
                                        <span className={`text-sm font-bold ${color.name} tracking-tight line-clamp-1`}>
                                            {person.name}
                                        </span>
                                        <span className={`text-[11px] font-medium mt-0.5 ${color.dept} line-clamp-1`}>
                                            {person.department ?? "General"}
                                        </span>
                                    </div>

                                    {/* Date pill */}
                                    <div className="mt-2">
                                        <span
                                            className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wide shadow-sm ${
                                                person.is_today ? color.pillToday : color.pill
                                            }`}
                                        >
                                            {person.birthday_label || "This Month"}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}