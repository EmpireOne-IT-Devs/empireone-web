import Button from '@/app/_components/button'
import { router } from '@inertiajs/react'
import { Download } from 'lucide-react'
import React from 'react'

export default function ExportERPSection() {
    return (
        <div className='py-3'>
            <a
                href={`/api/job/export_erp${window.location.search}`}
                className="
                                 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white 
                                 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 
                                 shadow-sm hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap
                             "
            >
                <Download size={18} strokeWidth={2.5} />
                EXPORT ERP
            </a>

        </div>
    )
}
