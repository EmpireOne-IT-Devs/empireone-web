import React from 'react';
import { Users, BarChart2, Crown, Flag } from 'lucide-react';
import Card from '@/app/_components/card';

const STATS_DATA = [
  {
    icon: Users,
    iconBg: 'bg-indigo-50 text-indigo-600',
    value: '12',
    title: 'Total Employees',
    subtitle: 'in RnR program',
  },
  {
    icon: BarChart2,
    iconBg: 'bg-amber-50 text-amber-600',
    value: '782',
    title: 'Avg. Points',
    subtitle: 'per employee',
  },
  {
    icon: Crown,
    iconBg: 'bg-pink-50 text-pink-600',
    value: 'Emily',
    title: 'Top Engager',
    subtitle: '1240 pts · Sales',
  },
  {
    icon: Flag,
    iconBg: 'bg-rose-50 text-rose-500',
    value: '1',
    title: 'At Risk',
    subtitle: 'below Bronze threshold',
  },
];

export default function CardSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_DATA.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl flex items-start justify-start shrink-0 ${stat.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-tight">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {stat.title}
              </p>
              <p className="text-xs text-slate-400">
                {stat.subtitle}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}