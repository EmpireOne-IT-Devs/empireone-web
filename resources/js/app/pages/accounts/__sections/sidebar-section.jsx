import { Fragment, useEffect, useState } from "react";
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
    FcShop,
    FcConferenceCall,
    FcCustomerSupport,
    FcPodiumWithAudience,
    FcOvertime,
    FcSalesPerformance,
} from "react-icons/fc";
import Tooltip from "@/app/_components/tooltip";
import { router, usePage } from "@inertiajs/react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa6";
import { FiPackage as PackageIcon } from "react-icons/fi";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SidebarSection() {
    const { desktopCollapsed, sidebarOpen, data } = useSelector(
        (store) => store.app,
    );
    const dispatch = useDispatch();
    const { url } = usePage();

    const currentPathname = (url || window.location.pathname).split("?")[0];
    const path = currentPathname.split("/")[3];
    const subPath = currentPathname.split("/")[4];
    const account_role = currentPathname.split("/")[2];
    const locationId = data?.user?.account_employee?.location_id;

    const [openDropdowns, setOpenDropdowns] = useState(() => ({
        "Performance Management": path === "performance_management",
        "Talent Acquisition": path === "talent_acquisition",
        "Human Resources": path === "human_resources",
    }));

    useEffect(() => {
        setOpenDropdowns((prev) => ({
            ...prev,
            ...(path === "performance_management"
                ? { "Performance Management": true }
                : {}),
            ...(path === "talent_acquisition"
                ? { "Talent Acquisition": true }
                : {}),
            ...(path === "human_resources" ? { "Human Resources": true } : {}),
        }));
    }, [path]);

    const toggleDropdown = (name) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const closeSidebar = () => {
        dispatch(setSidebarOpen());
    };

    const performanceChildren = [
        {
            name: "Dashboard",
            href: `/accounts/${account_role}/performance_management/dashboard`,
        },
        {
            name: "My Team",
            href: `/accounts/${account_role}/performance_management/my_team`,
        },
        {
            name: "PIP",
            href: `/accounts/${account_role}/performance_management/pip`,
        },
        {
            name: "Coaching",
            href: `/accounts/${account_role}/performance_management/reach`,
        },
        {
            name: "Corrective Action",
            href: `/accounts/${account_role}/performance_management/corrective_action`,
        },
        {
            name: "Evaluation",
            href: `/accounts/${account_role}/performance_management/evaluation`,
        },
    ].map((child) => ({
        ...child,
        current: currentPathname === child.href,
    }));

    const talentAcquisitionChildren = [
        {
            name: "Job Posting",
            subSlug: "job_posting",
            href: `/accounts/${account_role}/talent_acquisition/job_posting?location_id=${locationId}`,
        },
        {
            name: "Applicants",
            subSlug: "applicants",
            href: `/accounts/${account_role}/talent_acquisition/applicants?location_id=${locationId}`,
        },
        {
            name: "ERP",
            subSlug: "erp",
            href: `/accounts/${account_role}/talent_acquisition/erp?location_id=${locationId}`,
        },
        {
            name: "Calendar",
            subSlug: "calendar",
            href: `/accounts/${account_role}/talent_acquisition/calendar?location_id=${locationId}`,
        },
        {
            name: "Job Requisition",
            subSlug: "job_requisition",
            href: `/accounts/${account_role}/talent_acquisition/job_requisition?location_id=${locationId}`,
        },
    ].map((child) => ({
        ...child,
        current: path === "talent_acquisition" && subPath === child.subSlug,
    }));

    const humanResourcesChildren = [
        {
            name: "Employees",
            href: `/accounts/${account_role}/human_resources/employees?location_id=${locationId}`,
        },
        {
            name: "Leaders",
            href: `/accounts/${account_role}/human_resources/leaders?location_id=${locationId}`,
        },
        {
            name: "Employee Movements",
            href: `/accounts/${account_role}/human_resources/employee_movements?location_id=${locationId}`,
        },
        {
            name: "Separation",
            href: `/accounts/${account_role}/human_resources/separation?location_id=${locationId}`,
        },
        {
            name: "201Files",
            href: `/accounts/${account_role}/human_resources/201_files?location_id=${locationId}`,
        },
        {
            name: "Accounts",
            href: `/accounts/${account_role}/human_resources/sourcing/accounts`,
        },
        {
            name: "Departments",
            href: `/accounts/${account_role}/human_resources/sourcing/departments`,
        },
        {
            name: "Account Pendings",
            href: `/accounts/${account_role}/human_resources/account_pendings?location_id=${locationId}`,
        },
        {
            name: "Acknowledgements",
            href: `/accounts/${account_role}/human_resources/acknowledgements?location_id=${locationId}`,
        },
        {
            name: "COE Requests",
            href: `/accounts/${account_role}/human_resources/coe_requests?location_id=${locationId}`,
        },
    ].map((child) => ({
        ...child,
        current: currentPathname === child.href.split("?")[0],
    }));

    const mainNavigation = [
        { is_label: true, name: "Main Menu" },
        {
            name: "Dashboard",
            href: `/accounts/${account_role}/dashboard`,
            icon: FcBullish,
            current: path === "dashboard",
            is_incoming: false,
        },
        {
            name: "Job Offers",
            href: `/accounts/${account_role}/job_offers`,
            icon: FcFeedback,
            current: path === "job_offers",
            is_incoming: false,
        },
        {
            name: "Job Openings",
            href: `/accounts/${account_role}/job_openings`,
            icon: FcBriefcase,
            current: path === "job_openings",
            is_incoming: false,
        },
        {
            name: "My Applications",
            href: `/accounts/${account_role}/my_applications`,
            icon: FcDocument,
            current: path === "my_applications",
            is_incoming: false,
        },
        {
            name: "My Documents",
            href: `/accounts/${account_role}/my_documents`,
            icon: FcOpenedFolder,
            current: path === "my_documents",
            is_incoming: false,
        },
        {
            name: "Messages",
            href: `/accounts/${account_role}/messages`,
            icon: FcVoicePresentation,
            current: path === "messages",
            is_incoming: true,
        },

        // ------------------------------------
        // LEADER HUB
        // ------------------------------------
        ...([1].includes(data?.user?.role)
            ? [
                  {
                      name: "My Job Requisition",
                      href: `/accounts/${account_role}/my_requisition`,
                      icon: FcFeedback,
                      current: path === "my_requisition",
                      is_incoming: false,
                  },
                  { is_label: true, name: "Leader Hub" },
                  {
                      name: "Performance Management",
                      href: `/accounts/${account_role}/performance_management/dashboard`,
                      icon: FcConferenceCall,
                      current: path === "performance_management",
                      is_incoming: false,
                      children: performanceChildren,
                  },
              ]
            : []),

        // ------------------------------------
        // ADMINISTRATOR HUB
        // ------------------------------------
        ...(account_role === "administrator"
            ? [
                  { is_label: true, name: "Administration" },

                  ...([1, 2].includes(
                      data?.user?.account_employee?.department_id,
                  )
                      ? [
                            {
                                name: "Talent Acquisition",
                                href: `/accounts/${account_role}/talent_acquisition/job_posting?location_id=${locationId}`,
                                icon: FcPortraitMode,
                                current: path === "talent_acquisition",
                                is_incoming: false,
                                children: talentAcquisitionChildren,
                            },
                            {
                                name: "Human Resources",
                                href: `/accounts/${account_role}/human_resources/employees?location_id=${locationId}`,
                                icon: FcPodiumWithAudience,
                                current: path === "human_resources",
                                is_incoming: false,
                                children: humanResourcesChildren,
                            },
                            {
                                name: "Timekeeping",
                                href: `/accounts/${account_role}/time_keeping/attendance`,
                                icon: FcOvertime,
                                current: path === "time_keeping",
                                is_incoming: false,
                            },
                            {
                                name: "Asset & Inventory",
                                href: `/accounts/${account_role}/asset_inventory`,
                                icon: PackageIcon,
                                current: path === "asset_inventory",
                                is_incoming: false,
                            },
                        ]
                      : []),

                  ...([1, 11].includes(
                      data?.user?.account_employee?.department_id,
                  )
                      ? [
                            {
                                name: "Engagement Floor",
                                href: `/accounts/${account_role}/activities`,
                                icon: FcSportsMode,
                                current: path === "activities",
                                is_incoming: false,
                            },
                            {
                                name: "R & R",
                                href: `/accounts/${account_role}/rnr/peer_recognition`,
                                icon: FcDiploma1,
                                current: path === "rnr",
                                is_incoming: false,
                            },
                            {
                                name: "E-Store",
                                href: `/accounts/${account_role}/e_store/rewards_items`,
                                icon: FcShop,
                                current: path === "e_store",
                                is_incoming: true,
                            },
                        ]
                      : []),

                  {
                      name: "Ticketing",
                      href: `/accounts/${account_role}/ticketing`,
                      icon: FcCustomerSupport,
                      current: path === "ticketing",
                      is_incoming: true,
                  },

                  {
                      name: "Finance",
                      href: `/accounts/${account_role}/finance/dashboard`,
                      icon: FcSalesPerformance,
                      current: path === "finance",
                      is_incoming: true,
                  },
              ]
            : []),

        // ------------------------------------
        // EMPLOYEE HUB
        // ------------------------------------
        ...(account_role === "employee" ||
        ![1, 11].includes(data?.user?.account_employee?.department_id)
            ? [
                  { is_label: true, name: "Employee Hub" },
                  {
                      name: "Engagement Floor",
                      href: `/accounts/${account_role}/activities`,
                      icon: FcSportsMode,
                      current: path === "activities",
                      is_incoming: false,
                  },
                  {
                      name: "Timekeeping",
                      href: `/accounts/${account_role}/time_keeping/attendance`,
                      icon: FcOvertime,
                      current: path === "time_keeping",
                      is_incoming: false,
                  },
                  {
                      name: "HR Services",
                      href: `/accounts/${account_role}/hr_services`,
                      icon: FcPortraitMode,
                      current: path === "hr_services",
                      is_incoming: true,
                  },
                  {
                      name: "RNR",
                      href: `/accounts/${account_role}/rnr`,
                      icon: FcDiploma1,
                      current: path === "rnr",
                      is_incoming: false,
                  },
                  {
                      name: "Reward Store",
                      href: `/accounts/${account_role}/rewards_store`,
                      icon: FcShop,
                      current: path === "rewards_store",
                      is_incoming: true,
                  },
                  {
                      name: "Loan",
                      href: `/accounts/${account_role}/loan`,
                      icon: () => (
                          <FaMoneyBillWave className="text-purple-600 w-5 h-5 shrink-0" />
                      ),
                      current: path === "loan",
                      is_incoming: true,
                  },
                  {
                      name: "Payroll",
                      href: `/accounts/${account_role}/payroll`,
                      icon: () => (
                          <FaMoneyCheckAlt className="text-green-600 w-5 h-5 shrink-0" />
                      ),
                      current: path === "payroll",
                      is_incoming: true,
                  },
              ]
            : []),
    ];

    const bottomNavigation = [
        {
            name: "My Profile",
            href: `/accounts/${account_role}/my_profile/personal`,
            icon: FcBusinessman,
            current: path === "my_profile",
        },
        {
            name: "Settings",
            href: `/accounts/${account_role}/settings`,
            icon: FcSettings,
            current: path === "settings",
        },
    ];

    const renderNavItems = ({ isMobile = false }) => {
        const isCompact = !isMobile && desktopCollapsed;

        return mainNavigation.map((item, i) => {
            if (item.is_label) {
                if (isCompact) return null;

                return (
                    <li
                        key={`label-${i}`}
                        className="flex items-start justify-start pt-2"
                    >
                        <span className="px-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            {item.name}
                        </span>
                    </li>
                );
            }

            const hasChildren =
                Array.isArray(item.children) && item.children.length > 0;
            const isOpen = !!openDropdowns[item.name];
            const isParentActive =
                item.current ||
                (hasChildren && item.children.some((child) => child.current));

            const handleParentClick = () => {
                if (hasChildren && !isCompact) {
                    toggleDropdown(item.name);
                    return;
                }

                if (isMobile) {
                    closeSidebar();
                }
                router.visit(item.href);
            };

            const buttonContent = (
                <button
                    type="button"
                    disabled={item.is_incoming}
                    onClick={handleParentClick}
                    className={classNames(
                        isParentActive
                            ? "bg-purple-700 text-white"
                            : isOpen
                              ? "bg-purple-50 text-purple-700"
                              : "text-gray-700 hover:text-purple-600 hover:bg-purple-100",
                        isCompact ? "justify-center px-1.5" : "px-2.5",
                        "group flex items-center gap-x-2.5 rounded-md py-1.5 w-full text-[13px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                    )}
                >
                    <item.icon
                        aria-hidden="true"
                        className={classNames(
                            isParentActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-purple-600",
                            "w-5 h-5 shrink-0",
                        )}
                    />

                    {!isCompact && (
                        <span className="truncate text-left">{item.name}</span>
                    )}

                    {!isCompact && item.is_incoming && (
                        <span className="ml-auto inline-block py-0.5 px-2 text-[9px] font-medium rounded-full bg-gray-200 text-gray-500 shrink-0">
                            Coming Soon
                        </span>
                    )}

                    {!isCompact && hasChildren && !item.is_incoming && (
                        <svg
                            className={classNames(
                                "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                                isOpen ? "rotate-180" : "",
                                isParentActive
                                    ? "text-white"
                                    : "text-gray-400 group-hover:text-purple-600",
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    )}
                </button>
            );

            return (
                <li key={`${isMobile ? "m" : "d"}-${item.name}`}>
                    {isCompact ? (
                        <Tooltip text={item.name} position="right">
                            {buttonContent}
                        </Tooltip>
                    ) : (
                        buttonContent
                    )}

                    {hasChildren && isOpen && !isCompact && (
                        <ul className="relative mt-1 ml-4 space-y-0.5">
                            {item.children.map((child, idx) => {
                                const isLast = idx === item.children.length - 1;

                                return (
                                    <li
                                        key={child.href}
                                        className="relative flex items-center pl-6"
                                    >
                                        {!isLast && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute left-[7px] top-3.5 -bottom-1.5 w-[1.5px] bg-gray-200"
                                            />
                                        )}

                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                "absolute left-1 top-1/2 -translate-y-1/2 rounded-full transition-colors",
                                                child.current
                                                    ? "h-2 w-2 bg-purple-700 ring-2 ring-purple-100"
                                                    : "h-2 w-2 border-[1.5px] border-gray-300 bg-white",
                                            )}
                                        />

                                        <button
                                            type="button"
                                            disabled={child.is_incoming}
                                            onClick={() => {
                                                if (isMobile) {
                                                    closeSidebar();
                                                }
                                                router.visit(child.href);
                                            }}
                                            className={classNames(
                                                child.current
                                                    ? "text-purple-700 font-semibold"
                                                    : "text-gray-600 hover:text-purple-600 font-medium",
                                                "flex items-center justify-between rounded-md py-1 px-2 w-full text-[13px] transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed",
                                            )}
                                        >
                                            <span className="truncate">
                                                {child.name}
                                            </span>
                                            {child.is_incoming && (
                                                <span className="ml-2 inline-block py-0.5 px-1.5 text-[9px] font-medium rounded-full bg-gray-200 text-gray-500 shrink-0">
                                                    Soon
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </li>
            );
        });
    };

    const renderBottomItems = ({ isMobile = false }) => {
        const isCompact = !isMobile && desktopCollapsed;

        return bottomNavigation.map((item) => {
            const btn = (
                <button
                    type="button"
                    disabled={item.is_incoming}
                    onClick={() => {
                        if (isMobile) {
                            closeSidebar();
                        }
                        router.visit(item.href);
                    }}
                    className={classNames(
                        item.current
                            ? "bg-purple-700 text-white"
                            : "text-gray-700 hover:text-purple-600 hover:bg-purple-100",
                        isCompact ? "justify-center px-1.5" : "px-2.5",
                        "group flex items-center gap-x-2.5 rounded-md py-1.5 w-full text-[13px] font-semibold transition-colors",
                    )}
                >
                    <item.icon
                        aria-hidden="true"
                        className={classNames(
                            item.current
                                ? "text-white"
                                : "text-gray-400 group-hover:text-purple-600",
                            "w-5 h-5 shrink-0",
                        )}
                    />
                    {!isCompact && (
                        <span className="truncate">{item.name}</span>
                    )}
                </button>
            );

            return (
                <li key={`${isMobile ? "bm" : "bd"}-${item.name}`}>
                    {isCompact ? (
                        <Tooltip text={item.name} position="right">
                            {btn}
                        </Tooltip>
                    ) : (
                        btn
                    )}
                </li>
            );
        });
    };

    return (
        <>
            {/* Mobile Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden w-full"
                    onClose={closeSidebar}
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
                        <div className="fixed inset-0 w-full" />
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
                                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200">
                                    <img
                                        alt="Logo"
                                        src="/images/E1CXlogo.png"
                                        className="h-10 w-auto"
                                    />
                                    <button
                                        type="button"
                                        onClick={closeSidebar}
                                        className="text-gray-700 hover:text-gray-900 font-bold text-xl px-2"
                                        aria-label="Close sidebar"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="flex flex-col flex-1 overflow-hidden p-3.5">
                                    <nav className="flex-1 overflow-y-auto no-scrollbar">
                                        <ul className="space-y-1.5">
                                            {renderNavItems({ isMobile: true })}
                                        </ul>
                                    </nav>

                                    <div className="mt-auto pt-3.5 border-t border-gray-200">
                                        <ul className="space-y-1.5">
                                            {renderBottomItems({
                                                isMobile: true,
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Sidebar */}
            <aside
                className={classNames(
                    "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white border-r border-gray-200 transition-all duration-300",
                    desktopCollapsed ? "w-16" : "w-64",
                )}
            >
                <div className="flex h-14 shrink-0 items-center justify-center border-b border-gray-200 px-3">
                    <img
                        alt={desktopCollapsed ? "EmpireOne E1" : "EmpireOneCX"}
                        src={
                            desktopCollapsed
                                ? "/images/E1Icon.png"
                                : "/images/E1CXlogo.png"
                        }
                        className={classNames(
                            "object-contain transition-all duration-300",
                            desktopCollapsed ? "h-7 w-7" : "h-9 w-auto",
                        )}
                    />
                </div>

                <div className="flex flex-col flex-1 overflow-hidden p-2.5">
                    <nav className="flex-1 overflow-y-auto no-scrollbar">
                        <ul className="space-y-1.5">
                            {renderNavItems({ isMobile: false })}
                        </ul>
                    </nav>
                    <div className="mt-auto pt-2.5 border-t border-gray-200">
                        <ul className="space-y-1.5">
                            {renderBottomItems({ isMobile: false })}
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
}
