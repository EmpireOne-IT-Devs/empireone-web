import Sidetabs from './sidetabs'
import React from 'react'
import {
    Book,
    ShieldCheck,
    Scale,
    Video,
    FileSignature,
    Folder,
} from 'lucide-react';
import AddAcknowledgementSection from './add-acknowledgement-section';
import { useSelector } from 'react-redux';

export default function SidebarTabsSection() {
    const { acknowledgements } = useSelector((store) => store.human_resources)

    const navItems = acknowledgements?.acknowledgements?.map((res, i) => ({
        id: res.id + 100000,
        acknowledgement_id: res.id,
        acknowledgement_item_id: res.e_r_acknowledgement_item_id,
        label: res.title,
        content: res.file,
        icon: Book,
        ...(res.items?.length > 0 && {
            children: res.items.map((result) => ({
                id: result.id,
                acknowledgement_id: res.id,
                acknowledgement_item_id: result.id,
                label: result.title,
                content: result.file,
            }))
        })
    })) || [];

    console.log('navItemsnavItems', acknowledgements?.user_acknowledgements)

    return (
        <>
            {/* App Logo / Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                <span className="text-lg font-semibold text-purple-800 flex-1">Company Resources</span>
            </div>
            <Sidetabs
                navItems={navItems}
                user_acknowledgements={acknowledgements?.user_acknowledgements}

            />
        </>
    )
}
