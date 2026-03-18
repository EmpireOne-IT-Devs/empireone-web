import { useState, Fragment } from "react";
import { Transition, Menu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "@inertiajs/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function TopbarSection() {
    const { data } = useSelector((store) => store.app);
    const dispatch = useDispatch();

    return (
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-x-3">
                {/* EmpireOne Logo */}
                <div className="flex items-center">
                   <img
                       src="/images/eo-full-logo.png"
                       alt="EmpireOne Logo"
                       className="h-8 w-auto object-contain"
                   />
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: "1px",
                        height: "20px",
                        backgroundColor: "#d1d5db",
                    }}
                />

                {/* Job Portal text */}
                <span
                   className="font-bold "
                >
                    Job Portal
                </span>
            </div>

            {/* Right: Bell + User */}
            <div className="flex items-center gap-x-5">
                {/* Bell Icon with red dot */}
                <div className="relative">
                    <BellIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    <span
                        style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#ef4444",
                            borderRadius: "50%",
                            border: "1.5px solid white",
                        }}
                    />
                </div>

                {/* User Menu */}
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-x-2">
                        {/* Orange avatar */}
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#f97316",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "600",
                                flexShrink: 0,
                            }}
                        >
                            {data?.user?.name
                                ? data.user.name.charAt(0).toUpperCase()
                                : "A"}
                        </div>

                        {/* Name + Email */}
                        <div className="hidden lg:flex flex-col items-start leading-tight">
                            <span
                                style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#111827",
                                    lineHeight: "1.3",
                                }}
                                className="dark:text-white"
                            >
                                {data?.user?.name ?? "Applicant"}
                            </span>
                            <span
                                style={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    lineHeight: "1.3",
                                }}
                                className="dark:text-gray-400"
                            >
                                {data?.user?.email ?? "maria.garcia@email.com"}
                            </span>
                        </div>

                        <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 dark:bg-gray-800">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? "bg-gray-100 dark:bg-gray-700" : "",
                                            "block px-4 py-2 text-sm text-gray-700 dark:text-white"
                                        )}
                                    >
                                        Profile
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        method="post"
                                        href={route("logout")}
                                        as="button"
                                        className={classNames(
                                            active ? "bg-gray-100 dark:bg-gray-700" : "",
                                            "block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white"
                                        )}
                                    >
                                        Sign Out
                                    </Link>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
}