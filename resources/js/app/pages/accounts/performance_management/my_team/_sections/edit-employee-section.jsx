import React, { useState } from 'react';
import { FcSettings } from 'react-icons/fc';
import Modal from '@/app/_components/modal';
import EmployeeInformationForm from './employee-information-form';

export default function EditEmployeeSection({ props_data }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Trigger Button */}
            <a
                className="group flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-black/[0.04] active:bg-black/[0.08] hover:text-gray-900 transition-colors duration-150 cursor-pointer"
                onClick={() => setOpen(true)}
            >

                <FcSettings size={20} className="shrink-0 transition-transform group-hover:duration-300 group-hover:ease-in group-hover:rotate-45" />
                <span>EDIT EMPLOYEE</span>
            </a>


            {/* Update Employee Modal */}
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width="max-w-2xl"
                title="Update Employee Information"
            >
                <div className="w-full mt-2">
                    <EmployeeInformationForm
                        props_data={props_data}
                        open={open}
                        setOpen={setOpen}
                    />
                </div>
            </Modal>
        </>
    );
}