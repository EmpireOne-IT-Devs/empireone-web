import React, { useEffect, useMemo, useRef } from "react";
import { Cake } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import ViewBirthdaySection from "./view-birthday-section";
import { get_upcoming_birthdays_thunk } from "@/app/redux/activities-slice";

export default function UpcomingBirthdaySection() {
    const CARD_COLORS = [
        { card: "bg-[#EEEDFE] border-[#AFA9EC]", avatar: "bg-[#7F77DD]", badge: "bg-[#534AB7]", name: "text-[#3C3489]", dept: "text-[#534AB7]", pill: "bg-[#7F77DD] text-[#EEEDFE]", pillToday: "bg-[#534AB7] text-[#EEEDFE]" },
        { card: "bg-[#E1F5EE] border-[#5DCAA5]", avatar: "bg-[#1D9E75]", badge: "bg-[#0F6E56]", name: "text-[#085041]", dept: "text-[#0F6E56]", pill: "bg-[#1D9E75] text-[#E1F5EE]", pillToday: "bg-[#0F6E56] text-[#E1F5EE]" },
        { card: "bg-[#FAECE7] border-[#F0997B]", avatar: "bg-[#D85A30]", badge: "bg-[#993C1D]", name: "text-[#712B13]", dept: "text-[#993C1D]", pill: "bg-[#D85A30] text-[#FAECE7]", pillToday: "bg-[#993C1D] text-[#FAECE7]" },
        { card: "bg-[#E6F1FB] border-[#85B7EB]", avatar: "bg-[#378ADD]", badge: "bg-[#185FA5]", name: "text-[#0C447C]", dept: "text-[#185FA5]", pill: "bg-[#378ADD] text-[#E6F1FB]", pillToday: "bg-[#185FA5] text-[#E6F1FB]" },
        { card: "bg-[#FAEEDA] border-[#EF9F27]", avatar: "bg-[#BA7517]", badge: "bg-[#854F0B]", name: "text-[#633806]", dept: "text-[#854F0B]", pill: "bg-[#BA7517] text-[#FAEEDA]", pillToday: "bg-[#854F0B] text-[#FAEEDA]" },
    ];

    const dispatch = useDispatch();
    const { birthdays, birthdayMonth, birthdayCount, loading } = useSelector(
        (state) => state.activities,
    );

    const carouselRef = useRef(null);
    const isPausedRef = useRef(false);
    const scrollingItems = useMemo(() => [...birthdays, ...birthdays], [birthdays]);

    useEffect(() => {
        dispatch(get_upcoming_birthdays_thunk());
    }, [dispatch]);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel || scrollingItems.length === 0) return undefined;

        let animationFrameId;
        const animate = () => {
            if (isPausedRef.current) {
                animationFrameId = window.requestAnimationFrame(animate);
                return;
            }
            const halfwayPoint = carousel.scrollWidth / 2;
            carousel.scrollLeft += 0.6;
            if (carousel.scrollLeft >= halfwayPoint) carousel.scrollLeft = 0;
            animationFrameId = window.requestAnimationFrame(animate);
        };
        animationFrameId = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(animationFrameId);
    }, [scrollingItems]);

    return (
        <div className="w-full font-sans antialiased mt-2">
            <div className="flex items-center gap-2 mb-2">
                <Cake size={18} className="text-[#0b2265]" />
                <h2 className="text-sm font-bold text-gray-800 tracking-tight">
                    Upcoming {birthdayMonth} Birthdays
                </h2>
                <span className="inline-flex items-center justify-center bg-[#0b2265] text-white font-bold text-[11px] px-2 py-0.5 rounded-full min-w-[20px]">
                    {birthdayCount}
                </span>
                <div className="ml-auto">
                    <ViewBirthdaySection />
                </div>
            </div>

            {loading && (
                <div className="flex gap-4 overflow-hidden pb-3 pt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-[260px] h-[180px] bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && birthdays.length === 0 && (
                <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                    No birthdays this month.
                </div>
            )}

            {!loading && scrollingItems.length > 0 && (
                <div
                    ref={carouselRef}
                    onMouseEnter={() => { isPausedRef.current = true; }}
                    onMouseLeave={() => { isPausedRef.current = false; }}
                    className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                    {scrollingItems.map((employee, index) => {
                        const color = CARD_COLORS[index % CARD_COLORS.length];
                        return (
                            <Card
                                key={`${employee.user_id}-${index}`}
                                variant="default"
                                padding="p-6"
                                className={`shrink-0 w-[260px] ${color.card} border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center relative group hover:brightness-95 transition-all duration-200`}
                            >
                                <div className="relative mb-3">
                                    {employee.profile_picture || employee.avatar ? (
                                        <img
                                            src={employee.profile_picture ?? employee.avatar}
                                            alt={employee.name}
                                            className="w-16 h-16 rounded-full object-cover shadow-sm"
                                        />
                                    ) : (
                                        <div className={`w-16 h-16 rounded-full ${color.avatar} flex items-center justify-center text-white font-bold text-base tracking-wide shadow-sm`}>
                                            {employee.initials}
                                        </div>
                                    )}
                                    <div className={`absolute -top-1 -right-1 ${color.badge} text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center`}>
                                        <Cake size={11} className="stroke-[2.5]" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className={`text-sm font-bold ${color.name} tracking-tight`}>{employee.name}</span>
                                    <span className={`text-xs font-medium mt-0.5 mb-3 ${color.dept}`}>{employee.department}</span>
                                </div>
                                <div className="mt-auto">
                                    <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm ${employee.is_today ? color.pillToday : color.pill}`}>
                                        {employee.birthday_label}
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
