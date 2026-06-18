import React from 'react';
import Card from "@/app/_components/card";

export default function UpcomingEventSection() {
  const events = [
    {
      id: 1,
      month: "OCT",
      day: "12",
      title: "HR Training: Modern Leadership",
      time: "10:00 AM",
      location: "Room 4B",
      iconType: "location",
      status: "RSVP NOW",
      accentBg: "bg-blue-600",
      textColor: "text-blue-600",
      pillBg: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      id: 2,
      month: "OCT",
      day: "15",
      title: "Team Lunch & Learn",
      time: "12:30 PM",
      location: "Roof Garden",
      iconType: "food",
      status: "ATTENDING",
      accentBg: "bg-purple-600",
      textColor: "text-purple-600",
      pillBg: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      id: 3,
      month: "OCT",
      day: "18",
      title: "Design Sync & Review",
      time: "02:00 PM",
      location: "Zoom",
      iconType: "location",
      status: "ATTENDING",
      accentBg: "bg-purple-600",
      textColor: "text-purple-600",
      pillBg: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      id: 4,
      month: "OCT",
      day: "22",
      title: "All-Hands Quarterly",
      time: "09:00 AM",
      location: "Main Hall",
      iconType: "location",
      status: "RSVP NOW",
      accentBg: "bg-blue-600",
      textColor: "text-blue-600",
      pillBg: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },  
    {
      id: 4,
      month: "OCT",
      day: "22",
      title: "All-Hands Quarterly",
      time: "09:00 AM",
      location: "Main Hall",
      iconType: "location",
      status: "RSVP NOW",
      accentBg: "bg-blue-600",
      textColor: "text-blue-600",
      pillBg: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      id: 4,
      month: "OCT",
      day: "22",
      title: "All-Hands Quarterly",
      time: "09:00 AM",
      location: "Main Hall",
      iconType: "location",
      status: "RSVP NOW",
      accentBg: "bg-blue-600",
      textColor: "text-blue-600",
      pillBg: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    }
  ];

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
        {events.map((event) => (
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

                  {/* Location / Food Icon */}
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

            {/* Right Content: Modern Status Action Button */}
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