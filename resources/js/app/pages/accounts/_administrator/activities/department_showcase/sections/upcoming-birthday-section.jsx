import React, { useEffect, useMemo, useRef } from "react";
import { Cake } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import ViewBirthdaySection from "./view-birthday-section";
import CreateBirthdayPost from "./create-birthday-post";
import { get_upcoming_birthdays_thunk } from "@/app/redux/activities-slice";

export default function UpcomingBirthdaySection() {
    const dispatch = useDispatch();
    const { birthdays, birthdayMonth, birthdayCount, loading } = useSelector(
        (state) => state.activities
    );

    const carouselRef = useRef(null);
    const isPausedRef = useRef(false);

    // Duplicate items so the carousel loops seamlessly
    const scrollingItems = useMemo(
        () => [...birthdays, ...birthdays],
        [birthdays]
    );

    useEffect(() => {
        dispatch(get_upcoming_birthdays_thunk());
    }, [dispatch]);

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
                            className="shrink-0 w-[260px] h-[180px] bg-gray-100 rounded-2xl animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && birthdays.length === 0 && (
                <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                    No birthdays this month.
                </div>
            )}

            {/* Carousel */}
            {!loading && scrollingItems.length > 0 && (
                <div
                    ref={carouselRef}
                    onMouseEnter={() => { isPausedRef.current = true; }}
                    onMouseLeave={() => { isPausedRef.current = false; }}
                    className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                    {scrollingItems.map((employee, index) => (
                        <Card
                            key={`${employee.user_id}-${index}`}
                            variant="default"
                            padding="p-6"
                            className="shrink-0 w-[260px] bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center relative group hover:border-gray-200 transition-all duration-200"
                        >
                            {/* Avatar */}
                            <div className="relative mb-3">
                                {employee.profile_picture || employee.avatar ? (
                                    <img
                                        src={employee.profile_picture ?? employee.avatar}
                                        alt={employee.name}
                                        className="w-16 h-16 rounded-full object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-[#0b2265] flex items-center justify-center text-white font-bold text-base tracking-wide shadow-sm">
                                        {employee.initials}
                                    </div>
                                )}
                                {employee.is_today && (
                                    <div className="absolute -top-1 -right-1 bg-[#ff4b91] text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                        <Cake size={11} className="stroke-[2.5]" />
                                    </div>
                                )}
                                {!employee.is_today && (
                                    <div className="absolute -top-1 -right-1 bg-[#0b2265] text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                        <Cake size={11} className="stroke-[2.5]" />
                                    </div>
                                )}
                            </div>

                            {/* Name & Department */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-[#0b2265] transition-colors">
                                    {employee.name}
                                </span>
                                <span className="text-xs text-gray-400 font-medium mt-0.5 mb-3">
                                    {employee.department}
                                </span>
                            </div>

                            {/* Date pill */}
                            <div className="mt-auto">
                                <span className={`inline-block text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm ${employee.is_today ? "bg-[#ff4b91]" : "bg-[#0b2265]"}`}>
                                    {employee.birthday_label}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

