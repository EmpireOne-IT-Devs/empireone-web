import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "@/app/redux/app-slice";
import {
    FcBullish,
    FcDocument,
    FcSettings,
    FcVoicePresentation,
    FcBriefcase,
    FcBusinessman,
    FcFeedback,
    FcOpenedFolder
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
        {
            name: "Dashboard",
            href: "/applicant/dashboard",
            icon: FcBullish,
            current: path == "dashboard",
        },
        {
            name: "Job Openings",
            href: "/applicant/job_openings",
            icon: FcBriefcase,
            current: path == "job_openings",
        },
        {
            name: "My Applications",
            href: "/applicant/my_applications",
            icon: FcDocument,
            current: path == "my_applications",
        },
        {
            name: "Job Offers",
            href: "/applicant/job_offers",
            icon: FcFeedback,
            current: path == "job_offers",
        },
        {
            name: "My Profile",
            href: "/applicant/my_profile",
            icon: FcBusinessman,
            current: path == "my_profile",
        },

          {
            name: "My Documents",
            href: "/applicant/my_documents",
            icon: FcOpenedFolder,
            current: path == "my_documents",
        },

        {
            name: "Messages",
            href: "/applicant/messages",
            icon: FcVoicePresentation,
            current: path == "messages",
        },
        {
            name: "Settings",
            href: "/applicant/settings",
            icon: FcSettings,
            current: path == "settings",
        },
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
                                                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                                                        )}
                                                    >
                                                        <item.icon
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                item.current
                                                                    ? "text-indigo-600 dark:text-white"
                                                                    : "text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white",
                                                                "w-6 h-6 shrink-0",
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
                                <li key={i}>
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
                                                "flex items-center py-3 gap-x-3 rounded-md p-2 w-full text-sm font-semibold",
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
