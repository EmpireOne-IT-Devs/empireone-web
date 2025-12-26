import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "@/app/redux/app-slice";
import {
    FcViewDetails,
    FcBullish,
    FcDocument,
    FcOvertime,
    FcSalesPerformance,
    FcConferenceCall,
    FcBarChart,
    FcSettings,
    FcVoicePresentation,
    FcSportsMode,
    FcDiploma1,
    FcCustomerSupport,
    FcPortraitMode,
    FcShop,
    FcCloseUpMode,
    FcCancel,
} from "react-icons/fc";
import Tooltip from "@/app/_components/tooltip";
import { Link } from "@inertiajs/react";



function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function SidebarSection() {
    const { desktopCollapsed, sidebarOpen } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    const path = window.location.pathname.split("/")[2];
        const navigation = [
            { name: "Dashboard", href: "/administrator/dashboard", icon: FcBullish, current: path == "dashboard" },
            { name: "Users", href: "/administrator/users", icon: FcConferenceCall, current: path == "users" },
            { name: "Acivities", href: "/administrator/activities/view", icon: FcSportsMode, current: path == "activities" },
            { name: "Ticketing", href: "/administrator/ticketing/dashboard", icon: FcCustomerSupport, current: path == "ticketing" },
            { name: "Job Posting", href: "/administrator/job_posting/dashboard", icon: FcDocument, current: path == "job_posting" },
            { name: "HR Central", href: "/administrator/hr_central/overview", icon: FcPortraitMode, current: path == "hr_central" },
            { name: "RnR", href: "/administrator/rnr/grand_rewards", icon: FcDiploma1, current: path == "rnr" },
            { name: "Store Admin", href: "/administrator/store_admin/rewards_item", icon: FcShop, current: path == "store_admin" },
            { name: "Decorations", href: "/administrator/decoration/avatar_decorations", icon: FcCloseUpMode, current: path == "decoration" },
            { name: "Time Keeping", href: "/administrator/time_keeping/dashboard", icon: FcOvertime, current: path == "time_keeping" },
            { name: "Finance", href: "/administrator/finance/dashboard", icon: FcSalesPerformance, current: path == "finance" },
            { name: "Reports", href: "/administrator/reports", icon: FcBarChart, current: path == "reports" },
            { name: "Analytics", href: "/administrator/analytics", icon: FcViewDetails, current: path == "analytics" },
            { name: "Messages", href: "/administrator/messages", icon: FcVoicePresentation, current: path == "messages" },
            { name: "Settings", href: "/administrator/settings", icon: FcSettings, current: path == "settings" },
        ];

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
                                <div className="flex items-end justify-end top-0 right-0 pt-4 pr-4">
                                    <button
                                        type="button"
                                        onClick={() => open_sidebar()}
                                        className="text-gray-700 dark:text-white font-bold text-xl"
                                    >
                                        X
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
                                                    <Link
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
                                                    </Link>
                                                </li>
                                            ))}
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
                    <div className="flex items-center mt-3 justify-center h-16 p-4">
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
                                <li key={i}  >
                                    <Tooltip
                                        position="right"
                                        title={item.name}
                                        className="w-full"
                                        isShow={desktopCollapsed}
                                    >
                                        <Link
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? "bg-blue-700 text-white dark:bg-white/5 dark:text-white"
                                                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-200 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                                                "flex items-center py-3 gap-x-3 rounded-md p-2 w-full text-sm font-semibold"
                                            )}
                                        >
                                            <div className="flex gap-3 items-start justify-start w-full">
                                                <item.icon
                                                    className="w-6 h-6 shrink-0"
                                                    aria-hidden="true"
                                                />
                                                <span className={sidebarText}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        </Link>
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
