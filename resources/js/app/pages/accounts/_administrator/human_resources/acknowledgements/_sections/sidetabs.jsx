import React, { useState, useEffect, Fragment } from "react";
import { ChevronDown, FileText, Menu, X } from "lucide-react";
import { Transition } from "@headlessui/react";
import { FaRegWindowClose } from "react-icons/fa";
import AddSubAknowledgementSection from "./add-sub-acknowledgement-section";

// ==========================================
// 1. Full-Screen Modal Component
// ==========================================
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    width = "max-w-md",
    closeOnClickOutside = true,
}) {
    const handleOverlayClick = () => {
        if (closeOnClickOutside) {
            onClose();
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={handleOverlayClick}
                    />
                </Transition.Child>

                {/* Centering Wrapper */}
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95 translate-y-2 sm:translate-y-0"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-2 sm:translate-y-0"
                    >
                        <div
                            className={`relative transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all w-full ${width} max-h-[90vh] flex flex-col my-8`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex flex-none items-center justify-between pb-4 border-b border-gray-100">
                                {title && (
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {title}
                                    </h3>
                                )}
                                <button
                                    onClick={onClose}
                                    className="text-red-600 hover:text-red-700 transition-colors p-1 rounded-lg hover:bg-red-50 ml-auto"
                                    type="button"
                                >
                                    <FaRegWindowClose size={28} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="min-h-0 flex-1 overflow-y-auto pt-4">
                                {children}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
}

// ==========================================
// 2. Sidebar Item Component
// ==========================================
const SidebarItem = ({
    item,
    activeTab,
    expandedMenus,
    toggleMenu,
    setActiveTab,
    activeTabContent,
}) => {

    const hasChildren = !!item.children;
    const isExpanded = expandedMenus[item.id];
    const isActive = !hasChildren && activeTab === item.id;
    const isChildActive =
        hasChildren && item.children.some((child) => child.id === activeTab);
    console.log('badodo', item)
    return (
        <div className="flex flex-col space-y-1">
            <button
                onClick={() =>
                    hasChildren ? toggleMenu(item.id) : setActiveTab(item.id)
                }
                className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
                    ${isActive
                        ? "bg-purple-50 text-purple-600"
                        : isChildActive
                            ? "text-purple-600"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                `}
            >
                <div className="flex items-center">
                    {
                        hasChildren && <AddSubAknowledgementSection props_data={item} />
                    }

                    {/* Render AddSubAknowledgementSection or custom content here if needed */}
                    <span className="font-medium text-sm text-left ml-3 flex">
                        <FileText
                            size={18}
                            className={`mr-2 flex-shrink-0 text-purple-600`}
                        />   {item.label}
                    </span>
                </div>

                {hasChildren ? (
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                            }`}
                    />
                ) : (
                    isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                    )
                )}
            </button>

            {hasChildren && isExpanded && (
                <div className="pl-10 pr-2 space-y-1 mt-1 border-l-2 border-gray-100 ml-5">
                    {item.children.map((child) => {
                        const isChildCurrent = activeTab === child.id;

                        return (
                            <button
                                key={child.id}
                                onClick={() => setActiveTab(child.id)}
                                className={`
                                    w-full flex items-center px-3 py-2 rounded-md transition-all duration-200
                                    ${isChildCurrent
                                        ? "bg-purple-50 text-purple-600 font-medium"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <FileText
                                    size={14}
                                    className={`mr-2 flex-shrink-0 ${isChildCurrent
                                        ? "text-purple-600"
                                        : "text-gray-400"
                                        }`}
                                />
                                <span className="text-sm text-left truncate">
                                    {child.label}
                                </span>
                                {isChildCurrent && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 3. Sidebar Container Component
// ==========================================
const Sidebar = ({
    items,
    activeTab,
    setActiveTab,
    isOpen,
    setIsOpen,
    activeTabContent,
}) => {
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menuId) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }));
    };

    return (
        <div
            className={`
                w-80 bg-white border-r z-20 border-gray-200 flex flex-col shadow-sm h-full shrink-0 
                absolute md:relative inset-y-0 left-0
                ${isOpen ? "block" : "hidden md:flex"}
            `}
        >
            <div className="md:hidden flex justify-end p-4 border-b border-gray-100">
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {items.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        activeTab={activeTab}
                        activeTabContent={activeTabContent}
                        expandedMenus={expandedMenus}
                        toggleMenu={toggleMenu}
                        setActiveTab={setActiveTab}
                    />
                ))}
            </nav>
        </div>
    );
};

// ==========================================
// 4. Main Exported Layout Component
// ==========================================
export default function Sidetabs({ navItems, user_acknowledgements }) {
    const initialTabId =
        navItems?.[0]?.children?.[0]?.id || navItems?.[0]?.id || "";

    const [activeTab, setActiveTab] = useState(initialTabId);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!activeTab && navItems?.length > 0) {
            const firstId = navItems[0].children?.[0]?.id || navItems[0].id;
            setActiveTab(firstId);
        }
    }, [navItems, activeTab]);

    const allTabs =
        navItems?.flatMap((tab) =>
            tab.children ? [tab, ...tab.children] : tab
        ) || [];
    const activeTabContent = allTabs.find((t) => t.id === activeTab);

    const handleTabSelect = (id) => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
    };
    return (
        <div className="flex relative h-[74vh] bg-gray-50 font-sans overflow-hidden w-full">
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="absolute inset-0 bg-black/40 md:hidden z-10 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <Sidebar
                items={navItems || []}
                activeTab={activeTab}
                activeTabContent={activeTabContent}
                setActiveTab={handleTabSelect}
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col w-full">
                <div className="md:hidden flex items-center mb-4 pb-2 border-b border-gray-200">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-gray-600 hover:text-purple-600 transition-colors p-1"
                    >
                        <Menu size={26} />
                    </button>
                    <h2 className="ml-3 font-semibold text-gray-800 line-clamp-1">
                        {activeTabContent?.label || "Documents"}
                    </h2>
                </div>

                <div className="flex-1 flex flex-col">
                    {activeTabContent?.content ? (
                        <iframe
                            src={activeTabContent.content}
                            className="w-full flex-1 min-h-[60vh] rounded-md border"
                            title="PDF Viewer"
                        >
                            <p>
                                Your browser does not support PDFs.{" "}
                                <a href={activeTabContent.content}>
                                    Download the PDF
                                </a>
                                .
                            </p>
                        </iframe>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-400 min-h-[60vh]">
                            No document selected or available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}