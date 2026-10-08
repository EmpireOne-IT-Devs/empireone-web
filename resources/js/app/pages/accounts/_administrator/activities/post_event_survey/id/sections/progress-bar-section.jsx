


import React from 'react'

export default function ProgressBarSection({
  totalEmployees = 0,
  totalResponses = 0,
  participationRate = 0,
}) {
  return (
    <div>
       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Completion Progress</span>
                    <span>{totalResponses} / {totalEmployees}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${participationRate}%` }}
                    />
                </div>
            </div>
    </div>
  )
}
