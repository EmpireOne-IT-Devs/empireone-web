import React, { useEffect } from 'react';
import Card from "@/app/_components/card";
import { useDispatch, useSelector } from "react-redux";
import { get_upcoming_birthdays_thunk, get_upcoming_events_thunk } from "@/app/redux/activities-thunk";

const TYPE_STYLE = {
  birthday: {
    textColor: "text-pink-500",
    pillBg:    "bg-pink-50 text-pink-500 hover:bg-pink-100",
    status:    "BIRTHDAY 🎂",
  },
  general: {
    textColor: "text-indigo-600",
    pillBg:    "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    status:    "SCHEDULED",
  },
};

export default function UpcomingEventSection() {
  const dispatch = useDispatch();
  const { birthdayMonth, birthdayCount, birthdays, upcomingEvents } = useSelector((state) => state.activities);

  useEffect(() => {
    dispatch(get_upcoming_birthdays_thunk());
    dispatch(get_upcoming_events_thunk());
  }, [dispatch]);

  const today = new Date().getDate();
  // Nearest birthday on or after today; fall back to first if all are past
  const nextBirthday = birthdays.find((b) => b.birthday_day >= today) ?? birthdays[0];
  const isToday = nextBirthday?.is_today ?? false;

  const birthdayEvents = birthdayCount > 0 && nextBirthday ? [{
    id:        "birthdays-month",
    month:     birthdayMonth?.substring(0, 3).toUpperCase() ?? "",
    day:       String(nextBirthday.birthday_day),
    title:     `${birthdayMonth} Birthday Celebrants`,
    time:      isToday ? "Today 🎉" : nextBirthday.birthday_label,
    location:  `${birthdayCount} celebrant${birthdayCount !== 1 ? "s" : ""}`,
    iconType:  "location",
    status:    isToday ? "TODAY 🎉" : "UPCOMING",
    accentBg:  "bg-pink-500",
    textColor: "text-pink-500",
    pillBg:    isToday
      ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
      : "bg-pink-50 text-pink-500 hover:bg-pink-100",
  }] : [];

  // ── Scheduled posts from DB ───────────────────────────────────────────────
  const dbEvents = upcomingEvents.map((e) => {
    const style = TYPE_STYLE[e.type] ?? TYPE_STYLE.general;
    return {
      id:        `db-${e.id}`,
      month:     e.month.toUpperCase(),
      day:       String(e.day),
      title:     e.headline,
      time:      e.time,
      location:  e.publish_to,
      iconType:  "location",
      status:    style.status,
      accentBg:  e.type === "birthday" ? "bg-pink-500" : "bg-indigo-600",
      textColor: style.textColor,
      pillBg:    style.pillBg,
    };
  });

  const events = [
    
    
  ];

  const allEvents = [...birthdayEvents, ...dbEvents, ...events];

  return (
    <Card variant="default" padding="p-5" className="max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Upcoming Events
        </h2>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition tracking-wider">
          SEE ALL
        </button>
      </div>

      {/* Event Cards List */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 ">
        {allEvents.map((event) => (
          <div
            key={event.id}
            className="group flex items-center justify-between bg-gray-50/60 hover:bg-gray-50 p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-100"
          >
            {/* Left Content: Date + Details */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              
              {/* Modern Minimal Date Pill */}
              <div className="flex flex-col items-center justify-center bg-white rounded-xl w-14 h-16 shadow-[0_2px_8px_rgba(0,0,0,0,04)] border border-gray-100/80 flex-shrink-0 transition-transform group-hover:scale-105">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {event.month}
                </span>
                <span className={`text-xl font-bold mt-0.5 tracking-tight ${event.textColor}`}>
                  {event.day}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 tracking-tight truncate group-hover:text-black transition">
                  {event.title}
                </h3>

                {/* Metadata Row */}
                <div className="flex items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500 font-medium flex-wrap">
                  {/* Time */}
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>

                  
                  <div className="flex items-center gap-1">
                    {event.iconType === "location" ? (
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                      </svg>
                    )}
                    <span className="truncate max-w-[100px]">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <button className={`text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg transition-colors duration-150 uppercase ${event.pillBg}`}>
                {event.status}
              </button>
            </div>

          </div>
        ))}
      </div>
    </Card>
  );
}