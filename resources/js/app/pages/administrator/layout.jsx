"use client";
import { useState, Fragment } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import SidebarSection from "./_sections/sidebar-section";
import { setDesktopCollapsed, setSidebarOpen } from "@/app/redux/app-slice";
import { useDispatch, useSelector } from "react-redux";
import TopbarSection from "./_sections/topbar-section";

const navigation = [
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    { name: "Team", href: "#", icon: UsersIcon, current: false },
    { name: "Projects", href: "#", icon: FolderIcon, current: false },
    { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    {
        name: "Documents",
        href: "#",
        icon: DocumentDuplicateIcon,
        current: false,
    },
    { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
const teams = [
    { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
    { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
    { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Layout() {
    const dispatch = useDispatch();
    const { desktopCollapsed } = useSelector((store) => store.app);

    return (
        <div className="h-full bg-white dark:bg-gray-900">
            {/* Mobile sidebar */}
            <SidebarSection />

            {/* Top bar and main content */}
            <div
                className={`${
                    desktopCollapsed ? "lg:pl-20" : "lg:pl-72"
                } flex flex-col min-h-screen transition-all duration-300`}
            >
                <TopbarSection />

                <main
                    className={`flex-1 p-6 ${desktopCollapsed ? "ml-20" : ""}`}
                >
                    {/* Your main content here */}
                    asssssssssssssssssssssssssssssssssssssssssssss
                </main>
            </div>
        </div>
    );
}
