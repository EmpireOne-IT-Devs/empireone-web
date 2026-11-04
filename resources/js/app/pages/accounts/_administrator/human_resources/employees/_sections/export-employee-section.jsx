import React, { useState } from 'react';
import Button from '@/app/_components/button';
import { FiDownload } from 'react-icons/fi';
import axios from 'axios';

export default function ExportEmployeeSection({
    locationId = null,
    apiUrl = '/api/accounts/export_employee',
    defaultFilename = 'employee_report.xls',
}) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            let queryLocationId = null;
            if (typeof window !== 'undefined') {
                const searchParams = new URLSearchParams(window.location.search);
                queryLocationId = searchParams.get('location_id');
            }

            const finalLocationId = locationId ?? queryLocationId;

            const payload = {
                location_id: finalLocationId || null,
            };

            const response = await axios.post(apiUrl, payload, {
                responseType: 'blob',
            });

            let downloadFilename = defaultFilename;
            const disposition = response.headers['content-disposition'];
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches != null && matches[1]) {
                    downloadFilename = matches[1].replace(/['"]/g, '');
                }
            }

            const blob = new Blob([response.data], {
                type: 'application/vnd.ms-excel;charset=utf-8;'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadFilename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export employee records. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex items-center">
            <Button
                onClick={handleExport}
                loading={isExporting}
                className="flex items-center gap-2"
            >
                <FiDownload />
                Export Excel
            </Button>
        </div>
    );
}