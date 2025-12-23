import { useState, Fragment } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import {
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { setDesktopCollapsed, setSidebarOpen } from "@/app/redux/app-slice";
import {
    FcViewDetails,
    FcBullish,
    FcMultipleSmartphones,
    FcDocument,
    FcOvertime,
    FcSalesPerformance,
    FcConferenceCall,
    FcBarChart,
    FcSettings,
    FcVoicePresentation,
} from "react-icons/fc";
const navigation = [
    { name: "Dashboard", href: "#", icon: FcBullish, current: true },
    { name: "Users", href: "#", icon: FcConferenceCall, current: false },
    { name: "Ticketing", href: "#", icon: FcViewDetails, current: false },
    {
        name: "Asset Management",
        href: "#",
        icon: FcMultipleSmartphones,
        current: false,
    },
    { name: "Job Posting", href: "#", icon: FcDocument, current: false },
    { name: "Time Keeping", href: "#", icon: FcOvertime, current: false },
    { name: "Finance", href: "#", icon: FcSalesPerformance, current: false },
    { name: "Reports", href: "#", icon: FcBarChart, current: false },
    { name: "Messages", href: "#", icon: FcVoicePresentation, current: false },
    { name: "Settings", href: "#", icon: FcSettings, current: false },
];
const teams = [
    { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
    { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
    { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function SidebarSection() {
    const { desktopCollapsed, sidebarOpen } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    //  const [sidebarOpen, setSidebarOpen] = useState(false);
    //  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

    const sidebarWidth = desktopCollapsed
        ? "w-20 flex items-center justify-center"
        : "w-72";
    const sidebarText = desktopCollapsed ? "hidden" : "block";

    function open_sidebar(params) {
        dispatch(setSidebarOpen());
    }

    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={open_sidebar}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-80"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-80"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900 dark:bg-black" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-900">
                                <div className="absolute top-0 right-0 pt-4 pr-4">
                                    <button
                                        type="button"
                                        onClick={() => open_sidebar()}
                                        className="text-gray-700 dark:text-white"
                                    >
                                        <XMarkIcon
                                            className="w-6 h-6"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="flex flex-col h-full p-6">
                                    <div className="flex h-16 items-center">
                                        <img
                                            alt="Logo"
                                            src="/images/logo.png"
                                            className="h-16 w-full dark:hidden"
                                        />
                                        <img
                                            alt="Logo"
                                            src="/images/logo.png"
                                            className="h-16 w-full hidden dark:block"
                                        />
                                    </div>
                                    <nav className="flex-1 mt-6 overflow-y-auto">
                                        <ul className="space-y-4">
                                            {navigation.map((item) => (
                                                <li key={item.name}>
                                                    <a
                                                        href={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? "bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white"
                                                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                                                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                                                        )}
                                                    >
                                                        <item.icon
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                item.current
                                                                    ? "text-indigo-600 dark:text-white"
                                                                    : "text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white",
                                                                "w-6 h-6 shrink-0"
                                                            )}
                                                        />
                                                        {item.name}
                                                    </a>
                                                </li>
                                            ))}
                                            <li className="mt-6">
                                                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                                                    Your teams
                                                </div>
                                                <ul className="mt-2 space-y-1">
                                                    {teams.map((team) => (
                                                        <li key={team.id}>
                                                            <a
                                                                href={team.href}
                                                                className={classNames(
                                                                    team.current
                                                                        ? "bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white"
                                                                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                                                                    "flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold"
                                                                )}
                                                            >
                                                                <span
                                                                    className={classNames(
                                                                        team.current
                                                                            ? "border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white"
                                                                            : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white",
                                                                        "flex w-6 h-6 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5"
                                                                    )}
                                                                >
                                                                    {
                                                                        team.initial
                                                                    }
                                                                </span>
                                                                <span className="truncate">
                                                                    {team.name}
                                                                </span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                            <li className="mt-auto">
                                                <a
                                                    href="#"
                                                    className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                                                >
                                                    <Cog6ToothIcon className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white" />
                                                    Settings
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div
                            className="w-14 flex-shrink-0"
                            aria-hidden="true"
                        />
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop sidebar */}
            <div
                className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10 transition-all duration-300 ${sidebarWidth}`}
            >
                <div className="flex flex-col flex-1 h-full">
                    <div className="flex items-center justify-center h-16 p-4">
                        <img
                            alt="Logo"
                            src="/images/logo.png"
                            className={`h-16 w-full dark:hidden ${sidebarText}`}
                        />
                        <img
                            alt="Logo"
                            src="/images/logo.png"
                            className={`h-16 w-full hidden dark:block ${sidebarText}`}
                        />
                    </div>
                    <hr className="my-3" />
                    <nav className="flex-1 overflow-y-auto p-2">
                        <ul className="space-y-1">
                            {navigation.map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? "bg-blue-700 text-white dark:bg-white/5 dark:text-white"
                                                : "text-gray-700 hover:text-blue-600 hover:bg-blue-200 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                                            "flex items-center py-3 gap-x-3 rounded-md p-2 text-sm font-semibold"
                                        )}
                                    >
                                        <item.icon
                                            className="w-6 h-6 shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className={sidebarText}>
                                            {item.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
