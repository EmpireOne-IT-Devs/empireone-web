import React from "react";
import Table from "@/app/_components/table";
import { CheckCircle2, Medal, Trophy, Circle } from "lucide-react";

const participants = [
  {
    rank: 1,
    name: "Carlos Mendoza",
    role: "Ops Manager",
    initials: "CM",
    avatar: "bg-orange-500",
    department: "Operations",
    points: 300,
    completed: "Jun 30 11:45 PM",
    duration: "18 min/day",
    progress: 100,
    badge: "🏅",
    prize: "Eligible",
    verified: true,
  },
  {
    rank: 2,
    name: "Grace Okonkwo",
    role: "Brand Strategist",
    initials: "GO",
    avatar: "bg-blue-500",
    department: "Marketing",
    points: 300,
    completed: "Jun 30 9:12 PM",
    duration: "22 min/day",
    progress: 100,
    badge: "🏅",
    prize: "Eligible",
    verified: true,
  },
  {
    rank: 3,
    name: "Michael Chen",
    role: "Lead Engineer",
    initials: "MC",
    avatar: "bg-indigo-700",
    department: "Engineering",
    points: 300,
    completed: "Jun 30 10:30 PM",
    duration: "15 min/day",
    progress: 100,
    badge: "💪",
    prize: "Eligible",
    verified: true,
  },
  {
    rank: 4,
    name: "Nina Kowalski",
    role: "Product Manager",
    initials: "NK",
    avatar: "bg-indigo-500",
    department: "Product",
    points: 180,
    completed: "In Progress",
    completedClass: "text-orange-500",
    duration: "20 min/day",
    progress: 83,
    badge: "—",
    prize: "—",
    verified: false,
  },
  {
    rank: 5,
    name: "Sarah Johnson",
    role: "Sr. Designer",
    initials: "SJ",
    avatar: "bg-pink-600",
    department: "Marketing",
    points: 120,
    completed: "In Progress",
    completedClass: "text-orange-500",
    duration: "12 min/day",
    progress: 60,
    badge: "—",
    prize: "—",
    verified: false,
  },
];

function RankCell({ rank }) {
  if (rank <= 3) {
    const medalColor =
      rank === 1 ? "text-amber-500" : rank === 2 ? "text-sky-500" : "text-orange-500";

    return (
      <div className="flex flex-col items-center justify-center gap-0.5">
        <Medal className={`h-5 w-5 ${medalColor}`} />
        <span className="text-xs font-bold text-gray-500">{rank}</span>
      </div>
    );
  }

  return <span className="text-lg font-bold text-black">#{rank}</span>;
}

function ParticipantCell({ initials, name, role, avatar }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatar}`}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-gray-900">
          {name}
        </div>
        <div className="truncate text-xs text-gray-400">{role}</div>
      </div>
    </div>
  );
}

function ProgressCell({ progress }) {
  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600">{progress}%</span>
    </div>
  );
}

function PrizeCell({ prize }) {
  if (prize === "Eligible") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
        ✓ Eligible
      </span>
    );
  }

  return <span className="text-gray-400">—</span>;
}

function VerifiedCell({ verified }) {
  return verified ? (
    <CheckCircle2 className="h-5 w-5 text-green-500" />
  ) : (
    <Circle className="h-5 w-5 text-gray-300" />
  );
}

export default function ParticipantTableSection() {
  const columns = [
    { header: "RANK", accessor: "rank" },
    { header: "PARTICIPANT", accessor: "participant" },
    { header: "DEPARTMENT", accessor: "department" },
    { header: "POINTS", accessor: "points" },
    { header: "COMPLETED", accessor: "completed" },
    { header: "DURATION", accessor: "duration" },
    { header: "% DONE", accessor: "progress" },
    { header: "BADGE", accessor: "badge" },
    { header: "PRIZE", accessor: "prize" },
    { header: "VERIFIED", accessor: "verified" },
  ];

  const data = participants.map((participant) => ({
    id: participant.rank,
    rank: <RankCell rank={participant.rank} />,
    participant: (
      <ParticipantCell
        initials={participant.initials}
        name={participant.name}
        role={participant.role}
        avatar={participant.avatar}
      />
    ),
    department: <span className="text-sm text-gray-600">{participant.department}</span>,
    points: <span className="text-sm font-semibold text-green-600">{participant.points}</span>,
    completed: (
      <span
        className={`text-sm ${participant.completedClass || "text-gray-600"}`}
      >
        {participant.completed}
      </span>
    ),
    duration: <span className="text-sm text-gray-600">{participant.duration}</span>,
    progress: <ProgressCell progress={participant.progress} />,
    badge: (
      <span className="text-lg leading-none" aria-label="badge">
        {participant.badge}
      </span>
    ),
    prize: <PrizeCell prize={participant.prize} />,
    verified: <VerifiedCell verified={participant.verified} />,
  }));

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Challenge Leaderboard
            </h2>
            <p className="text-sm text-gray-500">
              Participants ranked by progress and completion
            </p>
          </div>
        </div>
      </div>

      <Table columns={columns} data={data} />
    </section>
  );
}
