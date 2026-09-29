import React, { memo, useEffect, useMemo, useRef } from "react";
import { Award, Medal, Calendar, Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import Skeleton from "@/app/_components/skeleton";
import {
    get_upcoming_work_anniversaries_thunk,
} from "@/app/redux/engagement-slice";

const COLORS = [
    "bg-gradient-to-br from-blue-600 to-indigo-800",
    "bg-gradient-to-br from-emerald-500 to-teal-700",
    "bg-gradient-to-br from-orange-500 to-amber-700",
    "bg-gradient-to-br from-purple-600 to-violet-800",
    "bg-gradient-to-br from-pink-500 to-rose-700",
];

const SIZE =
    "w-[130px] sm:w-[160px] md:w-[185px] lg:w-[205px] xl:w-[220px]";

/* -------------------------------------------------------------------------- */
/* Employee Card                                                              */
/* -------------------------------------------------------------------------- */

const EmployeeCard = memo(({ employee, index }) => {
    const image = employee.profile_picture || employee.avatar;

    const date = employee.anniversary_date
        ? new Date(employee.anniversary_date).toLocaleDateString("default", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : null;

    return (
        <Card
            variant="default"
            padding="p-0"
            className={`group relative shrink-0 aspect-square ${SIZE}
                overflow-hidden rounded-2xl border border-slate-200/80
                bg-white shadow-sm transition-all duration-300
                hover:border-indigo-200 hover:shadow-md`}
        >
            <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center sm:p-4">
                {/* Profile */}
                <div className="relative mb-2">
                    {image ? (
                        <img
                            src={image}
                            alt={employee.name}
                            loading="lazy"
                            className="
                                h-11 w-11 rounded-2xl object-cover
                                shadow-sm ring-2 ring-white
                                sm:h-12 sm:w-12
                                md:h-14 md:w-14
                                lg:h-16 lg:w-16
                            "
                        />
                    ) : (
                        <div
                            className={`
                                flex h-11 w-11 items-center justify-center
                                rounded-2xl text-white font-bold
                                sm:h-12 sm:w-12
                                md:h-14 md:w-14
                                lg:h-16 lg:w-16
                                ${COLORS[index % COLORS.length]}
                            `}
                        >
                            {employee.initials || "?"}
                        </div>
                    )}

                    <span className="absolute -bottom-1 -right-1 rounded-xl bg-amber-500 p-1 text-white ring-2 ring-white">
                        <Medal size={11} />
                    </span>
                </div>

                {/* Anniversary Label */}
                {employee.anniversary_label && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-800">
                        🎉 {employee.anniversary_label}
                    </span>
                )}

                {/* Employee Name */}
                <h3
                    title={employee.name}
                    className="
                        mt-2 w-full truncate
                        text-[10px] font-bold text-slate-800
                        sm:text-xs md:text-sm
                    "
                >
                    {employee.name}
                </h3>

                {/* Department */}
                <div
                    className="
                        mt-1 flex w-full items-center justify-center
                        gap-1 truncate text-[8px] text-slate-500
                        sm:text-[9px]
                    "
                >
                    <Building2 size={10} className="shrink-0" />

                    <span className="truncate">
                        {employee.department || "General"}
                    </span>
                </div>

                {/* Anniversary Date */}
                {date && (
                    <div className="mt-2 flex items-center gap-1 text-[8px] text-slate-500 sm:text-[9px]">
                        <Calendar
                            size={10}
                            className="shrink-0 text-indigo-500"
                        />

                        <span>{date}</span>
                    </div>
                )}
            </div>
        </Card>
    );
});

/* -------------------------------------------------------------------------- */
/* Work Anniversary Section                                                   */
/* -------------------------------------------------------------------------- */

export default function WorkAnniversarySection() {
    const dispatch = useDispatch();

    const {
        workAnniversaries = [],
        workAnniversaryMonth,
        workAnniversariesLoading,
        workAnniversaryFilters,
    } = useSelector((state) => state.engagement);

    const firstRowRef = useRef(null);
    const secondRowRef = useRef(null);

    const firstPaused = useRef(false);
    const secondPaused = useRef(false);

    /* ---------------------------------------------------------------------- */
    /* Fetch Anniversaries                                                    */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        dispatch(
            get_upcoming_work_anniversaries_thunk(
                workAnniversaryFilters,
            ),
        );
    }, [dispatch, workAnniversaryFilters]);

    /* ---------------------------------------------------------------------- */
    /* Split Employees                                                        */
    /* ---------------------------------------------------------------------- */

    const { firstRow, secondRow } = useMemo(() => {
        // Less than 15 employees = ONE ROW
        if (workAnniversaries.length < 15) {
            return {
                firstRow: workAnniversaries,
                secondRow: [],
            };
        }

        // 15 or more employees = TWO ROWS
        const midpoint = Math.ceil(workAnniversaries.length / 2);

        return {
            firstRow: workAnniversaries.slice(0, midpoint),
            secondRow: workAnniversaries.slice(midpoint),
        };
    }, [workAnniversaries]);

    /* ---------------------------------------------------------------------- */
    /* Auto Scroll                                                            */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        let frame;

        const animate = () => {
            const first = firstRowRef.current;
            const second = secondRowRef.current;

            /* -------------------------------------------------------------- */
            /* First Row - Move LEFT                                          */
            /* -------------------------------------------------------------- */

            if (first && !firstPaused.current) {
                first.scrollLeft += 0.7;

                if (
                    first.scrollLeft + first.clientWidth >=
                    first.scrollWidth - 1
                ) {
                    first.scrollLeft = 0;
                }
            }

            /* -------------------------------------------------------------- */
            /* Second Row - Move RIGHT                                        */
            /* -------------------------------------------------------------- */

            if (second && !secondPaused.current) {
                second.scrollLeft -= 0.7;

                if (second.scrollLeft <= 0) {
                    second.scrollLeft =
                        second.scrollWidth - second.clientWidth;
                }
            }

            frame = requestAnimationFrame(animate);
        };

        if (workAnniversaries.length > 0) {
            frame = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(frame);
    }, [workAnniversaries]);

    /* ---------------------------------------------------------------------- */
    /* Carousel Row                                                           */
    /* ---------------------------------------------------------------------- */

    const renderRow = (employees, ref, paused) => {
        if (!employees.length) {
            return null;
        }

        return (
            <div
                ref={ref}
                onMouseEnter={() => {
                    paused.current = true;
                }}
                onMouseLeave={() => {
                    paused.current = false;
                }}
                onTouchStart={() => {
                    paused.current = true;
                }}
                onTouchEnd={() => {
                    setTimeout(() => {
                        paused.current = false;
                    }, 800);
                }}
                className="
                    flex
                    gap-3
                    overflow-x-auto
                    overflow-y-hidden
                    select-none
                    sm:gap-4

                    /* Hide scrollbar - Firefox */
                    [scrollbar-width:none]

                    /* Hide scrollbar - IE/old Edge */
                    [-ms-overflow-style:none]

                    /* Hide scrollbar - Chrome/Edge/Safari */
                    [&::-webkit-scrollbar]:hidden
                "
            >
                {employees.map((employee, index) => (
                    <EmployeeCard
                        key={`${employee.user_id}-${index}`}
                        employee={employee}
                        index={index}
                    />
                ))}
            </div>
        );
    };

    const month =
        workAnniversaryMonth ||
        new Date().toLocaleString("default", {
            month: "long",
        });

    /* ---------------------------------------------------------------------- */
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <section className="my-4 w-full">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5 p-2">
                    <div className="rounded-xl bg-indigo-50 p-2 text-indigo-700">
                        <Award size={20} />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                            Work Anniversaries
                        </h2>

                        <p className="text-[10px] text-slate-500 sm:text-xs">
                            Celebrating milestones for {month}
                        </p>
                    </div>
                </div>

                {!workAnniversariesLoading &&
                    workAnniversaries.length > 0 && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                            {workAnniversaries.length}{" "}
                            {workAnniversaries.length === 1
                                ? "Person"
                                : "People"}
                        </span>
                    )}
            </div>

            {/* Loading */}
            {workAnniversariesLoading ? (
                <div
                    className="
                        flex
                        gap-3
                        overflow-hidden
                        sm:gap-4
                    "
                >
                    {[1, 2, 3, 4, 5].map((item) => (
                        <Skeleton
                            key={item}
                            variant="card"
                            className={`shrink-0 aspect-square ${SIZE} rounded-2xl`}
                        />
                    ))}
                </div>
            ) : workAnniversaries.length > 0 ? (
                /*
                 * 1 - 14 employees:
                 *     ONE ROW
                 *
                 * 15+ employees:
                 *     TWO ROWS
                 *
                 * First row  -> moves LEFT
                 * Second row -> moves RIGHT
                 */
                <div className="flex flex-col gap-3 sm:gap-4">
                    {renderRow(
                        firstRow,
                        firstRowRef,
                        firstPaused,
                    )}

                    {workAnniversaries.length >= 15 &&
                        renderRow(
                            secondRow,
                            secondRowRef,
                            secondPaused,
                        )}
                </div>
            ) : (
                /* Empty State */
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <Award
                        className="mx-auto mb-3 text-slate-400"
                        size={24}
                    />

                    <p className="text-sm font-semibold text-slate-700">
                        No Anniversaries Found
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        There are no work anniversaries scheduled for{" "}
                        {month}.
                    </p>
                </div>
            )}
        </section>
    );
}