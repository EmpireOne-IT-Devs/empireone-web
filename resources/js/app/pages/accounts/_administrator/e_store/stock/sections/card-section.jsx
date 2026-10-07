import React from "react";
import Card from "@/app/_components/card";

export default function CardSection() {
  const STATS_DATA = [
    {
      id: 1,
      value: "13",
      label: "TOTAL REWARDS",
    },
    {
      id: 2,
      value: "4",
      label: "NEEDS ATTENTION",
    },
    {
      id: 3,
      value: "264",
      label: "TOTAL UNITS",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {STATS_DATA.map((stat) => (
        <Card
          key={stat.id}
          className="w-full md:w-1/3 flex-col gap-2 p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {stat.label}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stat.value}
          </div>
        </Card>
      ))}
    </div>
  );
}