import Drawer from '@/app/_components/drawer';
import React, { useState } from 'react';
import FIlesTableSection from './files-table-section';



export default function DrawerSection({props_data}) {

    return (
        <Drawer
            width="w-full"
            trigger={
                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-blue-600 font-semibold bg-blue-50/50 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                    SHOW 
                </button>
            }
        >
            <FIlesTableSection props_data={props_data}/>
        </Drawer>
    );
}