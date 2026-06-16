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
    FcOpenedFolder,
    FcSportsMode,
    FcPortraitMode,
    FcDiploma1,
    FcCloseUpMode,
    FcShop,
    FcConferenceCall,
    FcCustomerSupport,
    FcSurvey,
    FcPodiumWithAudience,
    FcOvertime,
    FcSalesPerformance,
} from "react-icons/fc";
import Tooltip from "@/app/_components/tooltip";
import { Link, router } from "@inertiajs/react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa6";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SidebarSection() {
    const { desktopCollapsed, sidebarOpen, data } = useSelector(
        (store) => store.app,
    );
    const dispatch = useDispatch();
    const path = window.location.pathname.split("/")[3];
    const account_role = window.location.pathname.split("/")[2];
    console.log("datadata", data?.user?.leader != null);
    // 1. We split the main navigation items and include labels...
    const mainNavigation = [
        { is_label: true, name: "Main Menu" },
        {
            name: "Dashboard",
            href: `/accounts/${account_role}/dashboard`,
            icon: FcBullish,
            current: path == "dashboard",
            is_incoming: false,
        },
        {
            name: "Job Offers",
            href: `/accounts/${account_role}/job_offers`,
            icon: FcFeedback,
            current: path == "job_offers",
            is_incoming: false,
        },
        {
            name: "Job Openings",
            href: `/accounts/${account_role}/job_openings`,
            icon: FcBriefcase,
            current: path == "job_openings",
            is_incoming: false,
        },
        {
            name: "My Applications",
            href: `/accounts/${account_role}/my_applications`,
            icon: FcDocument,
            current: path == "my_applications",
            is_incoming: false,
        },
        {
            name: "My Documents",
            href: `/accounts/${account_role}/my_documents`,
            icon: FcOpenedFolder,
            current: path == "my_documents",
            is_incoming: false,
        },
        {
            name: "My Job Requisition",
            href: `/accounts/${account_role}/my_requisition`,
            icon: FcFeedback,
            current: path == "my_requisition",
            is_incoming: false,
        },
        {
            name: "Messages",
            href: `/accounts/${account_role}/messages`,
            icon: FcVoicePresentation,
            current: path == "messages",
            is_incoming: true,
        },
        ...(data?.user?.leader != null
            ? [
                  { is_label: true, name: "Leader Hub" },
                  {
                      name: "My Team",
                      href: `/accounts/${account_role}/my_team`,
                      icon: FcConferenceCall,
                      current: path === "my_team",
                      is_incoming: false,
                  },
              ]
            : []),
        ...(account_role == "administrator"
            ? [
                  { is_label: true, name: "Administration" },
                  //   {
                  //       name: "Users",
                  //       href: `/accounts/${account_role}/users`,
                  //       icon: FcConferenceCall,
                  //       current: path == "users",
                  //       is_incoming: true,
                  //   },
                  {
                      name: "Talent Acquisition",
                      href: `/accounts/${account_role}/talent_acquisition/dashboard`,
                      icon: FcPortraitMode,
                      current: path == "talent_acquisition",
                      is_incoming: false,
                  },

                  {
                      name: "Human Resources",
                      href: `/accounts/${account_role}/human_resources/employees`,
                      icon: FcPodiumWithAudience,
                      current: path == "human_resources",
                      is_incoming: false,
                  },
                  {
                      name: "Ticketing",
                      href: `/accounts/${account_role}/ticketing`,
                      icon: FcCustomerSupport,
                      current: path == "ticketing",
                      is_incoming: true,
                  },
                  {
                      name: "Activities",
                      href: `/accounts/${account_role}/activities`,
                      icon: FcSportsMode,
                      current: path == "activities",
                      is_incoming: true,
                  },

                  {
                      name: "R & R",
                      href: `/accounts/${account_role}/rnr/grand_rewards`,
                      icon: FcDiploma1,
                      current: path == "rnr",
                      is_incoming: true,
                  },
                  {
                      name: "E-Store",
                      href: `/accounts/${account_role}/e_store/rewards_items`,
                      icon: FcShop,
                      current: path == "e_store",
                      is_incoming: true,
                  },
                  {
                      name: "Time Keeping",
                      href: `/accounts/${account_role}/time_keeping/dashboard`,
                      icon: FcOvertime,
                      current: path == "time_keeping",
                      is_incoming: true,
                  },
                  {
                      name: "Finance",
                      href: `/accounts/${account_role}/finance/dashboard`,
                      icon: FcSalesPerformance,
                      current: path == "finance",
                      is_incoming: true,
                  },
              ]
            : []),

        ...(account_role == "employee"
            ? [
                  { is_label: true, name: "Employee Hub" },
                  {
                      name: "Activities",
                      href: `/accounts/${account_role}/activities`,
                      icon: FcSportsMode,
                      current: path == "activities",
                      is_incoming: true,
                  },
                  {
                      name: "HR Services",
                      href: `/accounts/${account_role}/hr_services`,
                      icon: FcPortraitMode,
                      current: path == "hr_services",
                      is_incoming: true,
                  },
                  {
                      name: "RNR",
                      href: `/accounts/${account_role}/rnr`,
                      icon: FcCloseUpMode,
                      current: path == "rnr",
                      is_incoming: true,
                  },
                  {
                      name: "Reward Store",
                      href: `/accounts/${account_role}/rewards_store`,
                      icon: FcShop,
                      current: path == "rewards_store",
                      is_incoming: true,
                  },
                  {
                      name: "Loan",
                      href: `/accounts/${account_role}/loan`,
                      icon: () => (
                          <FaMoneyBillWave className="text-purple-600" />
                      ),
                      current: path == "loan",
                      is_incoming: true,
                  },
                  {
                      name: "Payroll",
                      href: `/accounts/${account_role}/payroll`,
                      icon: () => (
                          <FaMoneyCheckAlt className="text-green-600" />
                      ),
                      current: path == "payroll",
                      is_incoming: true,
                  },
              ]
            : []),
    ];

    // 2. ...from the bottom navigation items.
    const bottomNavigation = [
        {
            name: "My Profile",
            href: `/accounts/${account_role}/my_profile`,
            icon: FcBusinessman,
            current: path == "my_profile",
        },
        {
            name: "Settings",
            href: `/accounts/${account_role}/settings`,
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
                        <div className="fixed inset-0 bg-gray-900 " />
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
                            <Dialog.Panel className="relative flex w-full flex-1 flex-col bg-white">
                                <div className="flex items-start justify-between top-0 right-0 px-5 pt-5 border-b border-gray-300 pb-2">
                                    <div className="flex h-16 items-center">
                                        <img
                                            alt="Logo"
                                            src="/images/eologo.png"
                                            className="h-16 w-full "
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => open_sidebar()}
                                        className="text-gray-700 font-bold text-xl"
                                    >
                                        X
                                    </button>
                                </div>
                                <div className="flex flex-col h-full p-6 pb-4">
                                    {/* Main Mobile Navigation */}
                                    <nav className="flex-1 overflow-y-auto no-scrollbar">
                                        <ul className="space-y-4">
                                            {mainNavigation.map((item, i) =>
                                                item.is_label ? (
                                                    <li
                                                        key={`label-${i}`}
                                                        className="flex items-center justify-center"
                                                    >
                                                        <span className="px-3 text-xs font-black text-red-400 uppercase tracking-wider">
                                                            ----- {item.name}
                                                            -----
                                                        </span>
                                                    </li>
                                                ) : (
                                                    <li key={item.name}>
                                                        <button
                                                            disabled={
                                                                item.is_incoming
                                                            }
                                                            onClick={(e) => {
                                                                dispatch(
                                                                    setSidebarOpen(),
                                                                );
                                                                router.visit(
                                                                    `${item.href}`,
                                                                );
                                                            }}
                                                            className={classNames(
                                                                item.current
                                                                    ? "bg-purple-700 text-white "
                                                                    : "text-gray-700 hover:text-puple-600 hover:bg-purple-200 ",
                                                                "flex items-center gap-x-3 rounded-md p-2 w-full text-sm font-semibold",
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={classNames(
                                                                    item.current
                                                                        ? "text-purple-600 "
                                                                        : "text-gray-400 group-hover:text-purple-600 ",
                                                                    "w-6 h-6 shrink-0",
                                                                )}
                                                            />
                                                            {item.name}
                                                            {!desktopCollapsed &&
                                                                item.is_incoming && (
                                                                    <span className="ml-auto inline-block py-0.5 px-2 text-[10px] font-medium rounded-full bg-red-500 text-white dark:bg-red-900 dark:text-red-200">
                                                                        incoming
                                                                    </span>
                                                                )}
                                                        </button>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </nav>

                                    {/* Bottom Mobile Navigation */}
                                    <div className="mt-auto pt-4 border-t border-gray-200 mb-20">
                                        <ul className="space-y-4">
                                            {bottomNavigation.map((item) => (
                                                <li key={item.name}>
                                                    <button
                                                        disabled={
                                                            item.is_incoming
                                                        }
                                                        onClick={(e) => {
                                                            dispatch(
                                                                setSidebarOpen(),
                                                            );
                                                            router.visit(
                                                                `${item.href}`,
                                                            );
                                                        }}
                                                        className={classNames(
                                                            item.current
                                                                ? "bg-purple-700 text-white "
                                                                : "text-gray-700 hover:text-purple-600 hover:bg-purple-200 ",
                                                            "flex items-center gap-x-3 rounded-md p-2 w-full text-sm font-semibold",
                                                        )}
                                                    >
                                                        <item.icon
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                item.current
                                                                    ? "text-purple-600 "
                                                                    : "text-gray-400 group-hover:text-purple-600 ",
                                                                "w-6 h-6 shrink-0",
                                                            )}
                                                        />
                                                        {item.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop sidebar */}
            <div
                className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white border-r border-gray-200 transition-all duration-300 ${sidebarWidth}`}
            >
                <div className="flex flex-col flex-1 h-full">
                    <div className="flex items-center mt-3 justify-center h-16 p-4">
                        <img
                            alt="Logo"
                            src="/images/eologo.png"
                            className={`h-16 w-full ${sidebarText}`}
                        />
                        <img
                            alt="Logo"
                            src="/images/eologo.png"
                            className={`h-16 w-full hidden ${sidebarText}`}
                        />
                    </div>
                    <hr className="my-3 border-gray-200" />

                    {/* Main Desktop Navigation */}
                    <nav className="flex-1 overflow-y-auto no-scrollbar  p-2">
                        <ul className="space-y-1">
                            {mainNavigation.map((item, i) =>
                                item.is_label ? (
                                    <li
                                        key={`label-${i}`}
                                        className="flex items-center justify-center"
                                    >
                                        {desktopCollapsed ? (
                                            <hr className="border-gray-200 mx-2" />
                                        ) : (
                                            <span className="px-3 text-xs font-black text-red-400 uppercase tracking-wider">
                                                ----- {item.name} -----
                                            </span>
                                        )}
                                    </li>
                                ) : (
                                    <li key={i}>
                                        <Tooltip
                                            position="right"
                                            title={item.name}
                                            className="w-full"
                                            isShow={desktopCollapsed}
                                        >
                                            <Link
                                                href={
                                                    item.is_incoming
                                                        ? "#"
                                                        : item.href
                                                }
                                                onClick={(e) => {
                                                    if (item.is_incoming)
                                                        e.preventDefault();
                                                }}
                                                className={classNames(
                                                    item.current
                                                        ? "bg-purple-700 text-white "
                                                        : "text-gray-700 hover:text-purple-600 hover:bg-purple-200 ",
                                                    "flex items-center py-3 gap-x-3 rounded-md p-2 w-full text-sm font-semibold",
                                                )}
                                            >
                                                <div className="flex gap-3 items-start justify-start w-full">
                                                    <item.icon
                                                        className="w-6 h-6 shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    <span
                                                        className={sidebarText}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    {!desktopCollapsed &&
                                                        item.is_incoming && (
                                                            <span className="ml-auto inline-block py-0.5 px-2 text-[10px] font-medium rounded-full bg-red-500 text-white dark:bg-red-900 dark:text-red-200">
                                                                incoming
                                                            </span>
                                                        )}
                                                </div>
                                            </Link>
                                        </Tooltip>
                                    </li>
                                ),
                            )}
                        </ul>
                    </nav>

                    {/* Bottom Desktop Navigation */}
                    <div className="mt-auto p-2 pt-3 border-t border-gray-200">
                        <ul className="space-y-1">
                            {bottomNavigation.map((item, i) => (
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
                                                    ? "bg-purple-700 text-white "
                                                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-200 ",
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
                    </div>
                </div>
            </div>
        </>
    );
}
