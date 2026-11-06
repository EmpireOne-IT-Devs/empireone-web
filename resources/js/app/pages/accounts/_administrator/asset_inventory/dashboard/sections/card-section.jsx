import React from 'react'
import Card from '@/app/_components/card'
import { Monitor, Cpu, Smartphone, Printer } from 'lucide-react'

const cardData = [
  {
    title: 'Monitors',
    count: 0,
    activeText: '0 active',
    cardBg: 'bg-[#d5faf2] border-[#b0f3e3]',
    titleColor: 'text-teal-700',
    iconBg: 'bg-white text-teal-600',
    badgeBg: 'bg-[#b6f0e2] text-teal-800',
    icon: Monitor,
  },
  {
    title: 'System Units',
    count: 0,
    activeText: '0 active',
    cardBg: 'bg-[#dbe9ff] border-[#b8d4ff]',
    titleColor: 'text-blue-700',
    iconBg: 'bg-white text-blue-600',
    badgeBg: 'bg-[#c4ddff] text-blue-800',
    icon: Cpu,
  },
  {
    title: 'Peripherals',
    count: 0,
    activeText: '0 active',
    cardBg: 'bg-[#ffe4e8] border-[#ffccd5]',
    titleColor: 'text-rose-700',
    iconBg: 'bg-white text-rose-600',
    badgeBg: 'bg-[#ffd0d9] text-rose-800',
    icon: Smartphone,
  },
  {
    title: 'Stations',
    count: 0,
    activeText: '0 active',
    cardBg: 'bg-[#fef3cb] border-[#fde68a]',
    titleColor: 'text-amber-800',
    iconBg: 'bg-white text-amber-700',
    badgeBg: 'bg-[#fce79a] text-amber-900',
    icon: Printer,
  },
]

export default function CardSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 ">
      {cardData.map((item, index) => {
        const Icon = item.icon

        return (
          <Card
            key={index}
            padding="p-4"
            className={`rounded-2xl ${item.cardBg}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-sm font-semibold ${item.titleColor}`}>
                  {item.title}
                </span>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {item.count}
                </div>
              </div>

              <div className={`p-2.5 rounded-xl shadow-sm ${item.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.badgeBg}`}
              >
                {item.activeText}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}