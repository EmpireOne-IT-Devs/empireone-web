import React from 'react'
import Card from '@/app/_components/card'
import { Box, Wrench, AlertTriangle, Bell, ChevronRight } from 'lucide-react'

const alertsData = [
  {
    icon: Box,
    iconBg: 'bg-rose-50 text-rose-600',
    title: 'Low stock: HDMI Cables',
    subtitle: 'Only 8 units remaining',
  },
  {
    icon: Wrench,
    iconBg: 'bg-amber-50 text-amber-600',
    title: '12 monitors due for maintenance',
    subtitle: 'Scheduled this week',
  },
  {
    icon: AlertTriangle,
    iconBg: 'bg-blue-50 text-blue-600',
    title: '3 assets pending approval',
    subtitle: 'Awaiting manager sign-off',
  },
  {
    icon: Bell,
    iconBg: 'bg-purple-50 text-purple-600',
    title: 'Warranty expiring: 5 CPUs',
    subtitle: 'Expires in 30 days',
  },
]

export default function AlertInventorySection() {
  return (
    <div className="">
      <Card padding="p-6" className="rounded-2xl border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            Alerts &<br />Notifications
          </h3>
          <span className="flex items-center justify-center w-7 h-7 bg-rose-100 text-rose-600 text-xs font-bold rounded-full">
            4
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {alertsData.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${item.iconBg}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}