import React from 'react'
import Card from '@/app/_components/card'
import { TrendingUp } from 'lucide-react'

export default function TotalAssetCardSection() {
  return (
    <Card padding="p-6" className="rounded-2xl bg-white border border-gray-100 h-full flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Total Asset Value</h3>
            <div className="text-4xl font-extrabold text-emerald-500 mt-2 tracking-tight">
              ₱6,453,564.42
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.8%</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          Asset value breakdown: Monitors (₱1,322,980.62), Peripherals (₱19,711.99), System Units (₱2,879,002.88), Parts (₱0), Devices (₱2,231,868.93)
        </p>
      </div>

      <div className="flex items-center gap-1.5 mt-5 text-[11px] text-gray-400">
        <span className="text-gray-300">•</span>
        <span>Updated today at 12:51:00 AM</span>
        <span className="text-gray-300">•</span>
        <span>PHP (₱) currency</span>
      </div>
    </Card>
  )
}