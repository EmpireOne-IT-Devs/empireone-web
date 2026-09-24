import React, { useEffect } from "react";
import { Award, Medal, Calendar, Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import Skeleton from "@/app/_components/skeleton";
import { get_upcoming_work_anniversaries_thunk } from "@/app/redux/engagement-slice";

const AVATAR_COLORS = [
  "bg-gradient-to-br from-blue-600 to-indigo-800",
  "bg-gradient-to-br from-emerald-500 to-teal-700",
  "bg-gradient-to-br from-orange-500 to-amber-700",
  "bg-gradient-to-br from-purple-600 to-violet-800",
  "bg-gradient-to-br from-pink-500 to-rose-700",
];

export default function WorkAnniversarySection() {
  const dispatch = useDispatch();
  const {
    workAnniversaries,
    workAnniversaryMonth,
    workAnniversariesLoading,
    workAnniversaryFilters,
  } = useSelector((state) => state.engagement);

  useEffect(() => {
    dispatch(get_upcoming_work_anniversaries_thunk(workAnniversaryFilters));
  }, [dispatch, workAnniversaryFilters]);

  const anniversaries = workAnniversaries ?? [];
  const displayMonth =
    workAnniversaryMonth ||
    new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="w-full flex flex-col font-sans antialiased my-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60">
            <Award size={20} className="stroke-[2.25]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Work Anniversaries
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Celebrating milestones for {displayMonth}
            </p>
          </div>
        </div>
        {anniversaries.length > 0 && !workAnniversariesLoading && (
          <span className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100">
            {anniversaries.length} {anniversaries.length === 1 ? 'Person' : 'People'}
          </span>
        )}
      </div>

      {/* Loading Skeleton */}
      {workAnniversariesLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton variant="card" className="h-44 rounded-2xl" />
          <Skeleton variant="card" className="h-44 rounded-2xl" />
          <Skeleton variant="card" className="h-44 rounded-2xl" />
        </div>
      )}

      {/* Empty State */}
      {!workAnniversariesLoading && anniversaries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Award size={22} />
          </div>
          <p className="text-sm font-semibold text-slate-700">No Anniversaries Found</p>
          <p className="text-xs text-slate-500 mt-1">
            There are no work anniversaries scheduled for {displayMonth}.
          </p>
        </div>
      )}

      {/* Card Grid */}
      {!workAnniversariesLoading && anniversaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anniversaries.map((employee, index) => {
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const anniversaryDateLabel = employee.anniversary_date
              ? new Date(employee.anniversary_date).toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            return (
              <Card
                key={employee.user_id}
                className="group relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                {/* Decorative top accent gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Top Header Row within Card */}
                  <div className="flex items-start justify-between gap-3">
                    {/* Avatar with Ribbon Badge */}
                    <div className="relative shrink-0">
                      {employee.profile_picture || employee.avatar ? (
                        <img
                          src={employee.profile_picture ?? employee.avatar}
                          alt={employee.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                        />
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-2xl ${avatarColor} flex items-center justify-center text-white font-bold text-base tracking-wide ring-2 ring-white shadow-sm`}
                        >
                          {employee.initials || "?"}
                        </div>
                      )}
                      
                      {/* Badge Icon Overlay */}
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-600 text-white p-1.5 rounded-xl ring-2 ring-white shadow-sm flex items-center justify-center">
                        <Medal size={12} className="stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Milestone Highlight Badge */}
                    {employee.anniversary_label && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 shadow-2xs">
                        🎉 {employee.anniversary_label}
                      </span>
                    )}
                  </div>

                  {/* Employee Details */}
                  <div className="mt-3.5">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-indigo-950 transition-colors truncate">
                      {employee.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                      <Building2 size={12} className="text-slate-400 shrink-0" />
                      <span className="uppercase tracking-wider truncate">
                        {employee.department ?? "General"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Section: Date Info */}
                {anniversaryDateLabel && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={13} className="text-indigo-500 shrink-0" />
                      <span>{anniversaryDateLabel}</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}