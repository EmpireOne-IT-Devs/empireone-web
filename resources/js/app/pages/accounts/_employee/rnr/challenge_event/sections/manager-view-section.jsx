import React, { useState } from "react";
import {
    LayoutDashboard,
    Settings,
    Trophy,
    BarChart3,
    FileText,
    LayoutGrid,
    Archive,
} from "lucide-react";

import CreateNewChallenge from "@/app/pages/accounts/_administrator/rnr/challenges_events/sections/create-new-challenge";
import HeaderSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/header-section";
import AllChallengesSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/all-challenges-section";
import ArchiveSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/archive-section";
import ChallengeTableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/manage/sections/challenge-table-section";
import ParticipantsTableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/manage/sections/participants-table-section";
import FilterChallengeLeaderboardSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/filter-challenge-leaderboard-section";
import TopParticipantSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/top-participant-section";
import ParticipantTableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/participant-table-section";
import CardSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/card-section";
import SearchSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/search-section";
import TableSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/table-section";
import ExportChallengeSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/report/sections/export-challenge-section";
import HistoricalTrendSection from "@/app/pages/accounts/_administrator/rnr/challenges_events/report/sections/historical-trend-section";

// Mirrors the admin "Challenges & Events" tab bar, but keeps everything on this
// one employee route via local tab state instead of navigating to the
// /accounts/administrator/* pages (those are locked to real admin accounts and
// would bounce department 1/11 employees back, which looked like a glitch).
const TABS = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "manage", label: "Manage", icon: Settings },
    { key: "leaderboard", label: "Leaderboard", icon: Trophy },
    { key: "submissions", label: "Submissions", icon: BarChart3 },
    { key: "report", label: "Reports", icon: FileText },
];

const DASHBOARD_VIEW_TABS = [
    { label: "All Challenges", icon: LayoutGrid, archived: false },
    { label: "Archive", icon: Archive, archived: true },
];

export default function ManagerViewSection() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const [showArchived, setShowArchived] = useState(false);
    const [selectedManageChallengeId, setSelectedManageChallengeId] = useState(null);
    const [selectedLeaderboardChallengeId, setSelectedLeaderboardChallengeId] = useState(null);
    const [leaderboardLimit, setLeaderboardLimit] = useState(10);

    return (
        <div>
            <div className="mt-6 flex items-center border-b border-gray-200 px-4 sm:px-6 lg:px-8">
                <nav className="no-scrollbar flex min-w-0 flex-1 justify-start gap-4 overflow-x-auto whitespace-nowrap sm:gap-8">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative flex items-center gap-1.5 px-2 py-3 text-sm font-medium outline-none transition-colors sm:px-0 sm:py-4 sm:text-base ${
                                    active
                                        ? "text-blue-800"
                                        : "text-gray-600 hover:text-blue-700"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                                {active && (
                                    <span className="absolute -bottom-px left-0 right-0 z-10 mx-auto h-0.5 w-full rounded bg-blue-800" />
                                )}
                            </button>
                        );
                    })}
                </nav>
                <div className="shrink-0 pl-4">
                    <CreateNewChallenge />
                </div>
            </div>

            <div className="mt-6 space-y-4">
                {activeTab === "dashboard" && (
                    <div>
                        <HeaderSection />
                        <div className="mb-2 mt-4 flex items-center gap-2 px-4 sm:px-6 lg:px-8">
                            {DASHBOARD_VIEW_TABS.map((tab) => {
                                const Icon = tab.icon;
                                const active = showArchived === tab.archived;
                                return (
                                    <button
                                        key={tab.label}
                                        type="button"
                                        onClick={() => setShowArchived(tab.archived)}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                            active
                                                ? "bg-blue-800 text-white"
                                                : "bg-white text-slate-600 hover:bg-slate-200"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {showArchived ? <ArchiveSection /> : <AllChallengesSection />}
                    </div>
                )}

                {activeTab === "manage" && (
                    <div className="px-4 sm:px-6 lg:px-8">
                        {selectedManageChallengeId ? (
                            <ParticipantsTableSection
                                challengeId={selectedManageChallengeId}
                                onBack={() => setSelectedManageChallengeId(null)}
                            />
                        ) : (
                            <ChallengeTableSection
                                onSelectChallenge={setSelectedManageChallengeId}
                            />
                        )}
                    </div>
                )}

                {activeTab === "leaderboard" && (
                    <div className="space-y-2 px-4 sm:px-6 lg:px-8">
                        <FilterChallengeLeaderboardSection
                            selectedChallengeId={selectedLeaderboardChallengeId}
                            onSelectChallenge={setSelectedLeaderboardChallengeId}
                            limit={leaderboardLimit}
                            onSelectLimit={setLeaderboardLimit}
                        />
                        <TopParticipantSection challengeId={selectedLeaderboardChallengeId} />
                        <ParticipantTableSection
                            challengeId={selectedLeaderboardChallengeId}
                            limit={leaderboardLimit}
                        />
                    </div>
                )}

                {activeTab === "submissions" && (
                    <SubmissionsTab />
                )}

                {activeTab === "report" && (
                    <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 xl:grid-cols-2">
                        <ExportChallengeSection />
                        <HistoricalTrendSection />
                    </div>
                )}
            </div>
        </div>
    );
}

// Submissions tab keeps its own `filters` state, matching the admin submissions page.
function SubmissionsTab() {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        challenge_id: "",
        location_id: "",
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <CardSection />
            <SearchSection filters={filters} setFilters={setFilters} />
            <TableSection filters={filters} />
        </div>
    );
}
