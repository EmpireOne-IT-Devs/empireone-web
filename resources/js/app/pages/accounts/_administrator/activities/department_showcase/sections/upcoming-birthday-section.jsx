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

        const { data } = useSelector((store) => store.app);
    const dispatch = useDispatch();

    const {
        birthdays,
        birthdayMonth,
        birthdayCount,
        birthdaysLoading: loading,
    } = useSelector((state) => state.engagement);

    const birthdayPosts = birthdays ?? [];

    const topCarouselRef = useRef(null);
    const bottomCarouselRef = useRef(null);
    const isTopPausedRef = useRef(false);
    const isBottomPausedRef = useRef(false);
    const bottomInitializedRef = useRef(false);

    const { topRowItems, bottomRowItems } = useMemo(() => {
        if (birthdayPosts.length === 0)
            return { topRowItems: [], bottomRowItems: [] };

        const top = birthdayPosts.filter((_, idx) => idx % 2 === 0);
        const bottom = birthdayPosts.filter((_, idx) => idx % 2 !== 0);
        const finalBottom = bottom.length > 0 ? bottom : top;

        return {
            topRowItems: [...top, ...top],
            bottomRowItems: [...finalBottom, ...finalBottom],
        };
    }, [birthdayPosts]);

    useEffect(() => {
        dispatch(get_upcoming_birthdays_thunk());
    }, [dispatch]);

    useEffect(() => {
        bottomInitializedRef.current = false;
    }, [bottomRowItems]);

    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            if (topCarouselRef.current && !isTopPausedRef.current) {
                const top = topCarouselRef.current;
                const halfwayPoint = top.scrollWidth / 2;
                top.scrollLeft += 0.8;
                if (top.scrollLeft >= halfwayPoint) top.scrollLeft = 0;
            }

            if (bottomCarouselRef.current) {
                const bottom = bottomCarouselRef.current;
                const halfwayPoint = bottom.scrollWidth / 2;

                if (!bottomInitializedRef.current && halfwayPoint > 0) {
                    bottom.scrollLeft = halfwayPoint;
                    bottomInitializedRef.current = true;
                }

                if (!isBottomPausedRef.current) {
                    bottom.scrollLeft -= 0.8;
                    if (bottom.scrollLeft <= 0)
                        bottom.scrollLeft = halfwayPoint;
                }
            }

            animationFrameId = window.requestAnimationFrame(animate);
        };

        if (topRowItems.length > 0) {
            animationFrameId = window.requestAnimationFrame(animate);
        }

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [topRowItems, bottomRowItems]);

    const renderCarouselRow = (ref, pausedRef, items) => (
        <div
            ref={ref}
            onMouseEnter={() => {
                pausedRef.current = true;
            }}
            onMouseLeave={() => {
                pausedRef.current = false;
            }}
            onTouchStart={() => {
                pausedRef.current = true;
            }}
            onTouchEnd={() => {
                // Small delay so accidental swipes don't lurch
                setTimeout(() => {
                    pausedRef.current = false;
                }, 800);
            }}
            className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden"
        >
            {items.map((person, index) => {
                const color = CARD_COLORS[index % CARD_COLORS.length];

                return (
                    <Card
                        key={`${person.user_id}-${index}`}
                        variant="default"
                        padding="p-0"
                        className={`
              shrink-0
              w-[130px] h-[130px]
              sm:w-[165px] sm:h-[165px]
              md:w-[195px] md:h-[195px]
              lg:w-[220px] lg:h-[220px]
              ${color.card} border rounded-2xl shadow-sm
              flex items-center justify-center text-center
              relative group hover:brightness-95 active:scale-95
              transition-all duration-200 cursor-pointer
            `}
                    >
                        <div className="flex flex-col items-center justify-center w-full h-full p-2.5 sm:p-3 lg:p-4">
                            {/* Avatar */}
                            <div className="relative mb-1.5 sm:mb-2">
                                {person.profile_picture || person.avatar ? (
                                    <img
                                        src={
                                            person.profile_picture ??
                                            person.avatar
                                        }
                                        alt={person.name}
                                        className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full object-cover shadow-sm"
                                    />
                                ) : (
                                    <div
                                        className={`w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full ${color.avatar} flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-wide shadow-sm`}
                                    >
                                        {person.initials || "?"}
                                    </div>
                                )}
                                {/* Cake badge */}
                                <div
                                    className={`absolute -top-1 -right-1 ${color.badge} text-white p-0.5 sm:p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center`}
                                >
                                    <Cake
                                        size={8}
                                        className="stroke-[2.5] sm:hidden"
                                    />
                                    <Cake
                                        size={11}
                                        className="stroke-[2.5] hidden sm:block"
                                    />
                                </div>
                            </div>

                            {/* Name & Department */}
                            <div className="flex flex-col items-center w-full">
                                <span
                                    className={`text-[11px] sm:text-xs md:text-sm font-bold ${color.name} tracking-tight line-clamp-1 leading-tight`}
                                >
                                    {person.name}
                                </span>
                                <span
                                    className={`text-[9px] sm:text-[10px] md:text-[11px] font-medium mt-0.5 ${color.dept} line-clamp-1`}
                                >
                                    {person.department ?? "General"}
                                </span>
                            </div>

                            {/* Date pill */}
                            <div className="mt-1.5">
                                <span
                                    className={`inline-block text-[8px] sm:text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm whitespace-nowrap ${
                                        person.is_today
                                            ? color.pillToday
                                            : color.pill
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
    );

    return (
        <div className="w-full font-sans antialiased">
            {/* Header */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 min-w-0">
                <Cake
                    size={16}
                    className="text-[#0b2265] shrink-0 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
                />
                <h2 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 tracking-tight truncate">
                    Upcoming{" "}
                    <span className="hidden sm:inline">{birthdayMonth} </span>
                    Birthdays
                </h2>
                <span className="inline-flex items-center justify-center bg-[#0b2265] text-white font-bold text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 rounded-full min-w-[18px] sm:min-w-[20px] shrink-0">
                    {birthdayCount}
                </span>
               
                    {[1, 11].includes(
                        data?.user?.account_employee?.department_id,
                    ) ? (
                        <div className="ml-auto mr-4 flex items-center gap-1 sm:gap-2 shrink-0">
                            <ViewBirthdaySection />
                            <CreateBirthdayPost />
                        </div>
                    ) : null}
                
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="flex flex-col gap-2 sm:gap-3">
                    {[0, 1].map((row) => (
                        <div
                            key={row}
                            className="flex gap-2 sm:gap-3 md:gap-4 overflow-hidden"
                        >
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="shrink-0 w-[130px] h-[130px] sm:w-[165px] sm:h-[165px] md:w-[195px] md:h-[195px] lg:w-[220px] lg:h-[220px] bg-gray-100 rounded-2xl animate-pulse"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && birthdayPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[140px] sm:h-[180px] md:h-[200px] gap-2 text-gray-400">
                    <Cake size={28} className="opacity-30 sm:w-8 sm:h-8" />
                    <p className="text-xs sm:text-sm md:text-base">
                        No active birthday posts found.
                    </p>
                </div>
            )}

            {/* 2 Carousel Rows */}
            {!loading && topRowItems.length > 0 && (
                <div className="flex flex-col gap-2 sm:gap-3">
                    {renderCarouselRow(
                        topCarouselRef,
                        isTopPausedRef,
                        topRowItems,
                    )}
                    {renderCarouselRow(
                        bottomCarouselRef,
                        isBottomPausedRef,
                        bottomRowItems,
                    )}
                </div>
            )}
        </div>
    );
}
