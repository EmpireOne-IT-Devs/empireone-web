import React, { useState, useEffect } from 'react';
import { ChevronDown, FileText, Menu, X, CheckCircle2 } from 'lucide-react'; // Added CheckCircle2
import AcceptAcknowledgementSection from './accept-acknowledgement-section';

const SidebarItem = ({
    item,
    activeTab,
    expandedMenus,
    toggleMenu,
    setActiveTab
}) => {
    // ... (SidebarItem remains unchanged)
    const Icon = item.icon;
    const hasChildren = !!item.children;
    const isExpanded = expandedMenus[item.id];
    const isActive = !hasChildren && activeTab === item.id;
    const isChildActive = hasChildren && item.children.some(child => child.id === activeTab);

    return (
        <div className="flex flex-col space-y-1">
            <button
                onClick={() => hasChildren ? toggleMenu(item.id) : setActiveTab(item.id)}
                className={`
          w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
          ${isActive
                        ? 'bg-purple-50 text-purple-600'
                        : isChildActive
                            ? 'text-purple-600'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
        `}
            >
                <div className="flex items-center">
                    {Icon && (
                        <Icon
                            size={20}
                            className={`mr-3 transition-colors duration-200 flex-shrink-0
                ${(isActive || isChildActive) ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}
              `}
                        />
                    )}
                    <span className="font-medium text-sm text-left">{item.label}</span>
                </div>

                {hasChildren ? (
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                ) : isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
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
                                        ? 'bg-purple-50 text-purple-600 font-medium'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                `}
                            >
                                <FileText size={14} className={`mr-2 flex-shrink-0 ${isChildCurrent ? 'text-purple-600' : 'text-gray-400'}`} />
                                <span className="text-sm text-left truncate">{child.label}</span>
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

const Sidebar = ({ items, activeTab, setActiveTab, isOpen, setIsOpen }) => {
    // ... (Sidebar remains unchanged)
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    return (
        <div
            className={`
                w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm h-full shrink-0 
                absolute md:relative z-40 
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
        >
            <div className="md:hidden flex justify-end p-4 border-b border-gray-100">
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {items.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        activeTab={activeTab}
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
// 3. Main Export
// ==========================================
export default function Sidetabs({ navItems, user_acknowledgements }) {
    const initialTabId = navItems?.[0]?.children?.[0]?.id || navItems?.[0]?.id || '';

    const [activeTab, setActiveTab] = useState(initialTabId);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!activeTab && navItems?.length > 0) {
            const firstId = navItems[0].children?.[0]?.id || navItems[0].id;
            setActiveTab(firstId);
        }
    }, [navItems, activeTab]);

    const allTabs = navItems?.flatMap(tab => tab.children ? [tab, ...tab.children] : tab) || [];
    const activeTabContent = allTabs.find(t => t.id === activeTab);

    // 1. Check if the active tab has already been acknowledged
    const isAlreadyAcknowledged = user_acknowledgements?.some(
        (ack) => ack.e_r_acknowledgement_id === activeTabContent?.acknowledgement_id
    );

    const isAlreadyAcknowledgedItem = user_acknowledgements?.some(
        (ack) => ack.e_r_acknowledgement_item_id === activeTabContent?.acknowledgement_item_id
    );

    const handleTabSelect = (id) => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
    };

    // console.log('activeTabContent',activeTabContent)
    return (
        <div className="flex relative h-[74vh] bg-gray-50 font-sans overflow-hidden w-full">

            {isMobileMenuOpen && (
                <div
                    className="absolute inset-0 bg-black/40 z-30 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar
                items={navItems || []}
                activeTab={activeTab}
                setActiveTab={handleTabSelect}
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            <div className="flex-1 p-4 overflow-y-auto flex flex-col w-full">
                <div className="md:hidden flex items-center mb-4 pb-2 border-b border-gray-200">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-gray-600 hover:text-purple-600 transition-colors p-1"
                    >
                        <Menu size={26} />
                    </button>
                    <h2 className="ml-3 font-semibold text-gray-800 line-clamp-1">
                        {activeTabContent?.label || 'Documents'}
                    </h2>
                </div>

                <div className="opacity-100 translate-y-0 block transition-all duration-300 ease-in-out flex-1 flex flex-col">
                    {activeTabContent?.content ? (
                        <iframe
                            src={activeTabContent.content}
                            className="w-full flex-1 min-h-[60vh] rounded-md border"
                            title="PDF Viewer"
                        >
                            <p>Your browser does not support PDFs.
                                <a href={activeTabContent.content}>Download the PDF</a>.
                            </p>
                        </iframe>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-400 min-h-[60vh]">
                            No document selected or available.
                        </div>
                    )}

                    {/* 2. Conditionally render the button based on acknowledgement status */}
                    {activeTabContent && (!isAlreadyAcknowledged && !isAlreadyAcknowledgedItem) && (
                        <AcceptAcknowledgementSection data={activeTabContent} />
                    )}

                    {/* Optional: Show a nice "Completed" badge if they have acknowledged it */}
                    {activeTabContent && (isAlreadyAcknowledged || isAlreadyAcknowledgedItem) && (
                        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full shadow-md font-medium border border-green-200">
                            <CheckCircle2 size={20} />
                            <span>Acknowledged</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}