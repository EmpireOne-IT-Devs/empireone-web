import React from 'react'
import Card from '@/app/_components/card'
import { DollarSign } from 'lucide-react'

export default function StatisticCardSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 ">
      {/* 1. Asset Distribution Card */}
      <Card padding="p-6" className="rounded-2xl border-gray-200">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Asset Distribution</h3>
          <p className="text-xs text-gray-400 mt-0.5">2,387 total assets</p>
        </div>

        <div className="flex items-center justify-between mt-6">
          {/* Custom Donut Chart Representation using CSS */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[conic-gradient(#10b981_0deg_144deg,#3b82f6_144deg_237.6deg,#a855f7_237.6deg_295.2deg,#6366f1_295.2deg_334.8deg,#f97316_334.8deg_360deg)] flex items-center justify-center shadow-sm">
              <div className="w-20 h-20 bg-white rounded-full"></div>
            </div>
            {/* Chart segment text overlays matching percentages */}
            <span className="absolute text-[11px] font-bold text-white bottom-8 left-6">40%</span>
            <span className="absolute text-[11px] font-bold text-white top-7 left-10">26%</span>
            <span className="absolute text-[11px] font-bold text-white top-3 right-8">16%</span>
            <span className="absolute text-[10px] font-bold text-white top-10 right-3">11%</span>
            <span className="absolute text-[10px] font-bold text-white bottom-9 right-4">7%</span>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Monitors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              <span>System Units</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500"></span>
              <span>Peripherals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-600"></span>
              <span>Devices</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-orange-500"></span>
              <span>Parts</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Asset Value Growth Card */}
      <Card padding="p-6" className="rounded-2xl border-gray-200">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Asset Value Growth</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
            <span className="text-xs text-gray-500 font-medium">Cumulative Asset Value · 12 Months</span>
          </div>
        </div>

        {/* Chart Graphic Simulation */}
        <div className="mt-8 relative h-40 flex flex-col justify-end">
          {/* Y-Axis Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400">
            <div className="border-b border-gray-100 flex justify-between pr-2"><span>7m+</span></div>
            <div className="border-b border-gray-100 flex justify-between pr-2"><span>6m+</span></div>
            <div className="border-b border-gray-100 flex justify-between pr-2"><span>5m+</span></div>
            <div className="border-b border-gray-100 flex justify-between pr-2"><span>1m+</span></div>
          </div>

          {/* SVG Trend Lines */}
          <div className="relative z-10 w-full h-28">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path d="M 0,70 L 40,55 L 80,65 L 120,50 L 160,52 L 200,35 L 240,25 L 280,20 L 280,100 L 0,100 Z" fill="url(#growthGradient)" />
              {/* Secondary line (Coral/Red) */}
              <path d="M 0,85 L 40,65 L 80,78 L 120,62 L 160,65 L 200,50 L 240,38 L 280,30" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
              {/* Primary line (Purple/Blue) */}
              <path d="M 0,70 L 40,55 L 80,65 L 120,50 L 160,52 L 200,35 L 240,25 L 280,20" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between text-[11px] text-gray-400 mt-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </div>
      </Card>

      {/* 3. Financial Metrics Card */}
      <Card padding="p-6" className="rounded-2xl border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-blue-600 font-bold">$</span>
          <h3 className="text-lg font-bold text-gray-900">Financial Metrics</h3>
        </div>

        <div className="flex flex-col gap-3">
          {/* Metric 1 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/60 border border-rose-100/60">
            <span className="text-xs text-gray-600 font-medium leading-tight">Monthly<br />Depreciation:</span>
            <span className="text-sm font-bold text-rose-600">₱145,650</span>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/60 border border-amber-100/60">
            <span className="text-xs text-gray-600 font-medium leading-tight">Maintenance<br />Budget:</span>
            <span className="text-sm font-bold text-amber-600">₱82,500/mo</span>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
            <span className="text-xs text-gray-600 font-medium leading-tight">Replacement<br />Value:</span>
            <span className="text-sm font-bold text-emerald-600">₱3,842,750</span>
          </div>

          {/* Metric 4 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/60">
            <span className="text-xs text-gray-600 font-medium leading-tight">Cost per<br />Workstation:</span>
            <span className="text-sm font-bold text-blue-600">₱68,250</span>
          </div>
        </div>
      </Card>
    </div>
  )
}