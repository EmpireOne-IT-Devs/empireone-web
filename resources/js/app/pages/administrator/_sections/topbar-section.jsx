import { useState, Fragment } from "react";
import { Transition, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { setDesktopCollapsed, setSidebarOpen } from "@/app/redux/app-slice";

const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function TopbarSection() {
    const dispatch = useDispatch();
   
    return (
        <>
            <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-gray-900">
                <button
                    className="hidden lg:block p-2  items-center justify-center text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    onClick={() =>dispatch(setDesktopCollapsed())}
                >
                    <Bars3Icon className="w-5 h-5" />
                </button>
                <button
                    type="button"
                    onClick={() => dispatch(setSidebarOpen())}
                    className="lg:hidden p-2 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                <div className="flex-1 flex items-center gap-x-4">
                    <form className="flex-1 relative  mx-5">
                        <input
                            name="search"
                            placeholder="Search"
                            className="block w-full pl-8 pr-2 py-2 text-gray-900 bg-white border rounded dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                        />
                        <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </form>

                    <div className="flex items-center gap-x-4">
                        <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-white">
                            <BellIcon className="w-6 h-6" />
                        </button>

                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center">
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                                <span className="ml-2 hidden lg:block text-sm font-semibold text-gray-900 dark:text-white">
                                    Tom Cook
                                </span>
                                <ChevronDownIcon className="ml-1 w-5 h-5 text-gray-400 dark:text-gray-500" />
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
                                <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg dark:bg-gray-800">
                                    {userNavigation.map((item) => (
                                        <Menu.Item key={item.name}>
                                            {({ active }) => (
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 dark:bg-white/5"
                                                            : "",
                                                        "block px-3 py-1 text-sm text-gray-900 dark:text-white"
                                                    )}
                                                >
                                                    {item.name}
                                                </a>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </>
    );
}
