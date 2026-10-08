import { Link } from "@inertiajs/react";
import React from "react";
import {
    LayoutDashboard,
    Settings,
    Trophy,
    BarChart3,
    FileText,
} from "lucide-react";
import CreateNewChallenge from "./create-new-challenge";
import ChallengeEventSection from "@/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-event-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function TabsSection({ children }) {
    const {
        isReady,
        isContentManager: canManageChallenges,
    } = useCurrentEmployee();

    const currentPath = window.location.pathname
        .split("/")
        .filter(Boolean)
        .at(-1);

    const tabs = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/accounts/administrator/rnr/challenges_events/dashboard",
            active: currentPath === "dashboard",
        },
        {
            label: "Manage",
            icon: Settings,
            path: "/accounts/administrator/rnr/challenges_events/manage",
            active: ["manage", "participants"].includes(currentPath),
        },
        {
            label: "Leaderboard",
            icon: Trophy,
            path: "/accounts/administrator/rnr/challenges_events/leaderboard",
            active: currentPath === "leaderboard",
        },
        {
            label: "Submissions",
            icon: BarChart3,
            path: "/accounts/administrator/rnr/challenges_events/submissions",
            active: currentPath === "submissions",
        },
        {
            label: "Reports",
            icon: FileText,
            path: "/accounts/administrator/rnr/challenges_events/report",
            active: currentPath === "report",
        },
    ];

    // Wait until employee data is available.
    if (!isReady) {
        return (
            <div className="mt-6 space-y-4 px-4 sm:px-6 lg:px-8">
                <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
                <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />
            </div>
        );
    }

    // Employee / non-content-manager view.
    // Only show ChallengeEventSection when the user is ready
    // and is NOT a content manager.
    if (isReady && !canManageChallenges) {
        return (
            <div className="mt-4">
                <ChallengeEventSection />
            </div>
        );
    }

    // Content manager / administrator view.
    // ChallengeEventSection is NOT rendered here.
    return (
        <div>
            <div className="mt-6 flex items-center border-b border-gray-200 px-4 sm:px-6 lg:px-8">
                <nav className="no-scrollbar flex min-w-0 flex-1 justify-start gap-4 overflow-x-auto whitespace-nowrap sm:gap-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.label}
                                href={tab.path}
                                className={`relative flex items-center gap-1.5 px-2 py-3 text-sm font-medium outline-none transition-colors sm:px-0 sm:py-4 sm:text-base ${
                                    tab.active
                                        ? "text-blue-800"
                                        : "text-gray-600 hover:text-blue-700"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>

                                {tab.active && (
                                    <span className="absolute -bottom-px left-0 right-0 z-10 mx-auto h-0.5 w-full rounded bg-blue-800" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="shrink-0 pl-4">
                    {canManageChallenges && <CreateNewChallenge />}
                </div>
            </div>

            <div>{children}</div>
        </div>
    );
}