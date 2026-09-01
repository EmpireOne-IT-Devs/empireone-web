import React from "react";

export default function HeaderSection() {
  return (
    <div className="bg-slate-100 p-6 rounded-lg font-sans text-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Overall Completion Rate Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Overall Completion Rate
              </h2>
              <span className="text-2xl font-bold text-emerald-500">58%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: "58%" }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-slate-400 font-medium">
            7 completed out of 12 participants
          </p>
        </div>

        {/* Challenge Status Breakdown Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Challenge Status Breakdown
          </h2>

          <div className="space-y-3">
            {/* Active */}
            <div className="flex items-center text-sm font-medium">
              <span className="w-24 text-slate-400">Active</span>
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full mx-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-3/4"></div>
              </div>
              <span className="w-4 text-right font-bold text-slate-700">3</span>
            </div>

            {/* Upcoming */}
            <div className="flex items-center text-sm font-medium">
              <span className="w-24 text-slate-400">Upcoming</span>
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full mx-3 overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full w-1/4"></div>
              </div>
              <span className="w-4 text-right font-bold text-slate-700">1</span>
            </div>

            {/* Completed */}
            <div className="flex items-center text-sm font-medium">
              <span className="w-24 text-slate-400">Completed</span>
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full mx-3 overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full w-1/4"></div>
              </div>
              <span className="w-4 text-right font-bold text-slate-700">1</span>
            </div>

            {/* Archived */}
            <div className="flex items-center text-sm font-medium">
              <span className="w-24 text-slate-400">Archived</span>
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full mx-3 overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full w-0"></div>
              </div>
              <span className="w-4 text-right font-bold text-slate-700">0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}