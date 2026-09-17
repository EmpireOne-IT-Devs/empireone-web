import React, { useState } from 'react';
import { FcSettings, FcManager ,  FcPortraitMode } from 'react-icons/fc';
import Modal from '@/app/_components/modal';
import EmployeeInformationForm from './employee-information-form';
import PersonalInformationForm from './personal-information-form';

const TABS = [
    { id: 'employee', label: 'Employee Information', icon: FcManager  },
    { id: 'personal', label: 'Personal Information', icon: FcPortraitMode },
];

export default function UpdateEmployee({ props_data }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('employee');

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
                <FcSettings size={20} className="shrink-0 transition-transform group-hover:duration-300 group-hover:ease-in group-hover:rotate-45" />
                <span>EDIT EMPLOYEE</span>
            </button>

            {/* Update Employee Modal */}
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width="max-w-2xl"
                title="Update Employee Information"
            >
                <div className="w-full mt-2">
                    {/* Tab Navigation Header */}
                    <div className="relative border-b border-gray-200 bg-white rounded-t-xl px-2 pt-1">
                        <nav className="flex space-x-1 overflow-x-auto scrollbar-none" aria-label="Tabs" role="tablist">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        aria-selected={isActive}
                                        role="tab"
                                        className={`
                      relative flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ease-in-out select-none outline-none
                      hover:bg-black/[0.04] active:bg-black/[0.08]
                      focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-1
                      ${isActive ? 'text-purple-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}
                    `}
                                    >
                                        <Icon
                                            size={20}
                                            className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'opacity-80 group-hover:opacity-100'
                                                }`}
                                        />
                                        <span>{tab.label}</span>

                                        {/* Active Tab Indicator Bar */}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-200" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Interactive Tab Content Panels */}
                    <div className="bg-white rounded-b-xl py-4 shadow-sm min-h-[220px]">
                        {activeTab === 'employee' && (
                            <div className="animate-in fade-in duration-200">
                                <EmployeeInformationForm
                                    props_data={props_data}
                                    open={open}
                                    setOpen={setOpen}
                                />
                            </div>
                        )}

                        {activeTab === 'personal' && (
                            <div className="animate-in fade-in duration-200">
                                <PersonalInformationForm
                                    props_data={props_data}
                                    open={open}
                                    setOpen={setOpen}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}