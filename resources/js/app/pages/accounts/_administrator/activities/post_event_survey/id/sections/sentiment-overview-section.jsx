

import React from 'react'

export default function SentimentOverviewSection({ sentimentStats }) {
  const stats = sentimentStats ?? {
    average_rating: 0,
    positive: { count: 0, percentage: 0 },
    neutral: { count: 0, percentage: 0 },
    negative: { count: 0, percentage: 0 },
  };

  return (
    <div>
       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-gray-700">Survey Sentiment Overview</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-mono">Based on submitted survey responses</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-amber-500">
                            <span className="text-lg">⭐</span>
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Average Rating</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">
                            {Number(stats.average_rating ?? 0).toFixed(1)}
                            <span className="ml-1 text-sm font-medium text-gray-400">/ 5</span>
                        </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide">Positive</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">{stats.positive?.percentage ?? 0}%</p>
                        <p className="text-sm text-gray-500">{stats.positive?.count ?? 0} Responses</p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-amber-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide">Neutral</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">{stats.neutral?.percentage ?? 0}%</p>
                        <p className="text-sm text-gray-500">{stats.neutral?.count ?? 0} Responses</p>
                    </div>

                    <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-rose-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                            <p className="text-xs font-semibold uppercase tracking-wide">Negative</p>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-800">{stats.negative?.percentage ?? 0}%</p>
                        <p className="text-sm text-gray-500">{stats.negative?.count ?? 0} Responses</p>
                    </div>
                </div>
            </div>
    </div>
  )
}
    