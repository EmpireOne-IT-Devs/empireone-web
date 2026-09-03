import React from 'react';
import { useSelector } from 'react-redux';
import Button from "@/app/_components/button";

export default function ExportJobPosting() {
    const { job_postings } = useSelector((state) => state.job_postings);

    // Format date string to DD-MMM-YY (e.g. 17-Aug-26)
    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = String(date.getFullYear()).slice(-2);

        return `${day}-${month}-${year}`;
    };

    const handleExportCSV = () => {
        if (!job_postings || job_postings.length === 0) {
            alert('No job postings available to export.');
            return;
        }

        // CSV Headers matching table structure
        const headers = [
            'REQ NO.',
            'ACCOUNT',
            'LOCATION',
            'WAVE',
            'START DATE',
            'FTE REQUIREMENT',
            'TOTAL APPLICATIONS',
            'HIRING TYPE'
        ];

        let totalFteRequirement = 0;
        let totalApplicationsCount = 0;

        // Map through data rows
        const rows = job_postings.map((item) => {
            const req = item?.job_requisition || {};

            const reqNo = req.id || item.id || '';
            const account = req.account?.name || req.account?.description || req.title || '';
            const location = req.location?.name || '';
            const wave = item.wave || req.wave || '';
            const startDate = formatDate(req.target_start_date);
            
            const fteRequirement = Number(req.number_of_positions) || 0;
            const totalApplications = Array.isArray(item.applications) ? item.applications.length : 0;
            const hiringType = req.category || '';

            totalFteRequirement += fteRequirement;
            totalApplicationsCount += totalApplications;

            return [
                reqNo,
                account,
                location,
                wave,
                startDate,
                fteRequirement,
                totalApplications,
                hiringType
            ];
        });

        // Add OVERALL TOTAL row
        const totalRow = [
            'OVERALL TOTAL',
            '',
            '',
            '',
            '',
            totalFteRequirement,
            totalApplicationsCount,
            ''
        ];

        const csvRows = [headers, ...rows, totalRow];

        // Format CSV content with proper quotes
        const csvContent = csvRows
            .map((row) =>
                row
                    .map((field) => {
                        const StringVal = String(field ?? '').replace(/"/g, '""');
                        return `"${StringVal}"`;
                    })
                    .join(',')
            )
            .join('\n');

        // Create and trigger CSV download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const filename = `Job_Requisitions_Report_${new Date().toISOString().slice(0, 10)}.csv`;

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button onClick={handleExportCSV}>
            Export CSV
        </Button>
    );
}