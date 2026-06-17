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
      themeColor: "border-blue-600 text-blue-600 bg-blue-50",
      pillBg: "bg-blue-100 text-blue-700 hover:bg-blue-200",
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
      themeColor: "border-purple-700 text-purple-700 bg-purple-50",
      pillBg: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
    {
      id: 3,
      month: "OCT",
      day: "15",
      title: "Team Lunch & Learn",
      time: "12:30 PM",
      location: "Roof Garden",
      iconType: "food",
      status: "ATTENDING",
      themeColor: "border-purple-700 text-purple-700 bg-purple-50",
      pillBg: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
    {
      id: 4,
      month: "OCT",
      day: "15",
      title: "Team Lunch & Learn",
      time: "12:30 PM",
      location: "Roof Garden",
      iconType: "food",
      status: "ATTENDING",
      themeColor: "border-purple-700 text-purple-700 bg-purple-50",
      pillBg: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    }
  ];

  return (
    // Outer UI wrapper using your provided Card component
    <Card variant="default" padding="p-6" className="max-w-md bg-white rounded-3xl border-none shadow-sm overflow-hidden">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-light text-gray-800 tracking-wide">
          Upcoming Events
        </h2>
        <button className="text-sm font-semibold text-blue-600 tracking-wider hover:underline">
          SEE ALL
        </button>
      </div>

      {/* Event Cards List with Scroll Overflow:
        - max-h-[340px] neatly fits roughly 2.3 items, hinting to users that more content exists below.
        - custom scrollbar rules hidden/styled dynamically can clean this up further depending on your global CSS setup.
      */}
      <div className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative flex items-center bg-[#f7f9fc] rounded-2xl p-4 pl-6 overflow-hidden flex-shrink-0"
          >
            {/* Colored Left Accent Border */}
            <div className={`absolute left-0 top-0 bottom-0 w-[5px] rounded-r-full ${event.id === 1 ? 'bg-blue-600' : 'bg-purple-700'}`} />

            {/* Date Pill */}
            <div className="flex flex-col items-center justify-center bg-white rounded-full w-20 h-28 shadow-sm border border-gray-100 flex-shrink-0">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                {event.month}
              </span>
              <span className={`text-2xl font-semibold mt-0.5 ${event.id === 1 ? 'text-blue-600' : 'text-purple-700'}`}>
                {event.day}
              </span>
            </div>

            {/* Event Details */}
            <div className="ml-5 flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-700 leading-snug">
                  {event.title}
                </h3>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[13px] text-gray-500 font-medium">
                  {/* Time */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="leading-none">{event.time}</span>
                  </div>

                  {/* Location / Food Icon */}
                  <div className="flex items-center gap-1.5">
                    {event.iconType === "location" ? (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                      </svg>
                    )}
                    <span className="leading-none">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Button / Pill */}
              <div className="mt-3">
                <button className={`text-[11px] font-bold tracking-wider px-4 py-1.5 rounded-full transition ${event.pillBg}`}>
                  {event.status}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </Card>
  );
}