import { Link, usePage } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";
import {
    FiAward,
    FiBarChart2,
    FiLayout,
    FiSettings,
    FiUser,
} from "react-icons/fi";
import CreateNewChallenge from "./create-new-challenge";
import ChallengeEventSection from "@/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-event-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function TabsSection({ children }) {
    const { isReady, isContentManager: canManageChallenges } =
        useCurrentEmployee();

    // usePage().url re-renders on every Inertia visit and is SSR-safe.
    const { url } = usePage();
    const pathname = url.split("?")[0].split("#")[0];
    const segments = pathname.split("/").filter(Boolean);
    const currentPath = segments.at(-1);
    const isAdministratorRoute = segments[1] === "administrator";

    const activeTabRef = useRef(null);

    const tabs = [
        {
            label: "Join Challenges",
            icon: FiUser,
            path: "/accounts/administrator/rnr/challenges_events/join",
            active: currentPath === "join",
        },
        {
            label: "Dashboard",
            icon: FiLayout,
            managementOnly: true,
            path: "/accounts/administrator/rnr/challenges_events/dashboard",
            active: currentPath === "dashboard",
        },
        {
            label: "Manage",
            icon: FiSettings,
            managementOnly: true,
            path: "/accounts/administrator/rnr/challenges_events/manage",
            active: ["manage", "participants"].includes(currentPath),
        },
        {
            label: "Submissions",
            icon: FiBarChart2,
            managementOnly: true,
            path: "/accounts/administrator/rnr/challenges_events/submissions",
            active: currentPath === "submissions",
        },
        {
            label: "Leaderboard",
            icon: FiAward,
            managementOnly: true,
            path: "/accounts/administrator/rnr/challenges_events/leaderboard",
            active: currentPath === "leaderboard",
        },
        // {
        //     label: "Reports",
        //     icon: FiFileText,
        //     managementOnly: true,
        //     path: "/accounts/administrator/rnr/challenges_events/report",
        //     active: currentPath === "report",
        // },
    ].filter((tab) => !tab.managementOnly || canManageChallenges);

    // On small screens the nav scrolls horizontally; keep the active tab
    // visible (e.g. "Leaderboard" would otherwise be off-screen on load).
    useEffect(() => {
        activeTabRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [currentPath, isReady]);

    // Wait until employee data is available.
    if (!isReady) {
        return (
            <div className="mt-4 space-y-4 px-4 sm:mt-6 sm:px-6 lg:px-8">
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 sm:h-12" />
                <div className="h-48 w-full animate-pulse rounded-lg bg-gray-200 sm:h-64" />
            </div>
        );
    }

    // Employee / non-content-manager view.
    if (!canManageChallenges && !isAdministratorRoute) {
        return (
            <div className="mt-4 w-full min-w-0 px-0 sm:px-0">
                <ChallengeEventSection />
            </div>
        );
    }

    // Administrators keep their dashboard and join view; only content
    // managers receive the management navigation.
    return (
        <div className="w-full min-w-0">
            {/*
              Mobile: tabs scroll on top (with their own bottom border),
                      the "Add new challenge" button sits below them.
              md+:    tabs on the left, button on the right, single row
                      sharing one bottom border.
            */}
            <div className="mt-4 flex flex-col px-4 sm:mt-6 sm:px-6 md:flex-row md:items-stretch md:justify-between md:gap-4 md:border-b md:border-gray-200 lg:px-8">
                <nav
                    aria-label="Challenges navigation"
                    className="no-scrollbar -mx-4 flex min-w-0 snap-x snap-mandatory items-stretch gap-1 overflow-x-auto overscroll-x-contain whitespace-nowrap border-b border-gray-200 px-4 [-webkit-overflow-scrolling:touch] sm:-mx-6 sm:gap-4 sm:px-6 md:mx-0 md:flex-1 md:gap-6 md:border-b-0 md:px-0 lg:gap-8"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.label}
                                ref={tab.active ? activeTabRef : null}
                                href={tab.path}
                                aria-current={tab.active ? "page" : undefined}
                                className={`relative flex min-h-[44px] shrink-0 snap-start items-center gap-1.5 px-3 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 sm:min-h-[48px] sm:px-1 sm:text-base ${
                                    tab.active
                                        ? "text-blue-800"
                                        : "text-gray-600 hover:text-blue-700"
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{tab.label}</span>

                                {tab.active && (
                                    <span className="absolute -bottom-px left-0 right-0 z-10 h-0.5 w-full rounded bg-blue-800" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {canManageChallenges && (
                    <div className="w-full shrink-0 py-3 md:w-auto md:self-center md:py-0 [&>*]:w-full md:[&>*]:w-auto">
                        <CreateNewChallenge />
                    </div>
                )}
            </div>

            <div className="w-full min-w-0">{children}</div>
        </div>
    );
}