import React from 'react';
import { useSelector } from 'react-redux';
import { Users, BarChart2, Crown, Flag } from 'lucide-react';
import Card from '@/app/_components/card';
import Skeleton from '@/app/_components/skeleton';

export default function CardSection() {
  const {
    rewardChallengeEmployeeProfiles,
    rewardChallengeEmployeeProfilesLoading,
  } = useSelector((state) => state.engagement);

  const summary = rewardChallengeEmployeeProfiles?.summary ?? {
    total_employees: 0,
    avg_points: 0,
    top_engager: null,
    at_risk_count: 0,
  };

  const statsData = [
    {
      icon: Users,
      iconBg: 'bg-indigo-50 text-indigo-600',
      value: String(summary.total_employees),
      title: 'Total Employees',
      subtitle: 'in RnR program',
    },
    {
      icon: BarChart2,
      iconBg: 'bg-amber-50 text-amber-600',
      value: summary.avg_points.toLocaleString(),
      title: 'Avg. Points',
      subtitle: 'per employee',
    },
    {
      icon: Crown,
      iconBg: 'bg-pink-50 text-pink-600',
      value: summary.top_engager?.name ?? '—',
      title: 'Top Engager',
      subtitle: summary.top_engager
        ? `${summary.top_engager.points.toLocaleString()} pts · ${summary.top_engager.department}`
        : 'No activity yet',
    },
    {
      icon: Flag,
      iconBg: 'bg-rose-50 text-rose-500',
      value: String(summary.at_risk_count),
      title: 'At Risk',
      subtitle: 'joined but 0 points earned',
    },
  ];

  if (rewardChallengeEmployeeProfilesLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <Skeleton variant="avatar" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
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