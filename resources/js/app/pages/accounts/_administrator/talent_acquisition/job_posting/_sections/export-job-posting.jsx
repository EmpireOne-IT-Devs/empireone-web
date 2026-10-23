import React from 'react';
import Button from "@/app/_components/button";
import { export_job_requisition_service } from '@/app/services/job-posting-service';

export default function ExportJobPosting() {
    // Format date string to MMM DD (e.g. Sep 14 or Oct 05)
    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];

        return `${month} ${day}`;
    };

    // Safely extract full name from a recruiter item in interviewer_users
    const extractRecruiterName = (userObj) => {
        if (!userObj) return '';
        const rec = userObj.recruiter || userObj.interviewer?.recruiter || userObj;
        const firstName = rec.first_name || '';
        const lastName = rec.last_name || '';
        return `${firstName} ${lastName}`.trim();
    };

    const handleExportCSV = async () => {
        try {
            const response = await export_job_requisition_service();
            const job_postings = response?.data;

            if (!job_postings || job_postings.length === 0) {
                alert('No job postings available to export.');
                return;
            }

            // Sort job postings alphabetically by Site name (location.name)
            const sortedJobPostings = [...job_postings].sort((a, b) => {
                const siteA = (a?.job_requisition?.location?.name || '').toLowerCase();
                const siteB = (b?.job_requisition?.location?.name || '').toLowerCase();
                return siteA.localeCompare(siteB);
            });

            // Determine maximum number of recruiters across all job requisitions
            let maxRecruiters = 0;
            sortedJobPostings.forEach((item) => {
                const interviewerUsers = item?.job_requisition?.interviewer_users;
                if (Array.isArray(interviewerUsers)) {
                    maxRecruiters = Math.max(maxRecruiters, interviewerUsers.length);
                }
            });

            // Ensure at least 2 recruiter columns exist by default
            const recruiterColumnCount = Math.max(2, maxRecruiters);

            // Generate dynamic recruiter headers (RECRUITER 1, RECRUITER 2, ...)
            const recruiterHeaders = Array.from(
                { length: recruiterColumnCount },
                (_, i) => `RECRUITER ${i + 1}`
            );

            // Construct CSV headers matching the Ramp Fulfillment table structure
            const headers = [
                'ACCOUNT',
                'SITE',
                'WAVE',
                'Type',
                'Placement',
                'ROLE',
                'FTE REQ',
                'BUFFER',
                'SUPPORT',
                'REQ',
                'START DATE',
                'ROSTER LOCK',
                ...recruiterHeaders,
                'TOTAL APPLICATIONS'
            ];

            let totalFteRequirement = 0;
            let totalApplicationsCount = 0;

            const rows = sortedJobPostings.map((item) => {
                const req = item?.job_requisition || {};

                const account = req.account?.name || req.account?.description || item.title || '';
                const site = req.location?.name || '';
                const wave = item.wave || req.wave || '';
                const type = req.type || '';
                const placement = item.target_audience || req.target_audience || '';
                const role = req.title || '';

                const fteReq = Number(req.number_of_positions) || 0;
                const buffer = req.buffer || '';
                const support = req.support || '';
                const reqCount = req.req || '';

                const startDate = formatDate(req.target_start_date);
                const rosterLock = req.roster_lock ? formatDate(req.roster_lock) : '';

                // Extract recruiter names from interviewer_users array
                const interviewerUsers = Array.isArray(req.interviewer_users) ? req.interviewer_users : [];
                const recruiterNames = interviewerUsers
                    .map(extractRecruiterName)
                    .filter(Boolean);

                // Populate recruiter columns corresponding to header count
                const recruiterCells = [];
                for (let i = 0; i < recruiterColumnCount; i++) {
                    recruiterCells.push(recruiterNames[i] || '');
                }

                const totalApplications = Array.isArray(item.applications) ? item.applications.length : 0;

                totalFteRequirement += fteReq;
                totalApplicationsCount += totalApplications;

                return [
                    account,
                    site,
                    wave,
                    type,
                    placement,
                    role,
                    fteReq,
                    buffer,
                    support,
                    reqCount,
                    startDate,
                    rosterLock,
                    ...recruiterCells,
                    totalApplications
                ];
            });

            // Empty slots for recruiter columns in OVERALL TOTAL row
            const emptyRecruiterTotalSlots = Array(recruiterColumnCount).fill('');

            const totalRow = [
                'OVERALL TOTAL',
                '',
                '',
                '',
                '',
                '',
                totalFteRequirement,
                '',
                '',
                '',
                '',
                '',
                ...emptyRecruiterTotalSlots,
                totalApplicationsCount
            ];

            const csvRows = [headers, ...rows, totalRow];

            // Format CSV content with double-quote escaping
            const csvContent = csvRows
                .map((row) =>
                    row
                        .map((field) => {
                            const stringVal = String(field ?? '').replace(/"/g, '""');
                            return `"${stringVal}"`;
                        })
                        .join(',')
                )
                .join('\n');

            // Download CSV file using browser ObjectURL API
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const createObjectURL = window.URL?.createObjectURL || window.webkitURL?.createObjectURL;

            if (!createObjectURL) {
                alert('Your browser does not support file downloading.');
                return;
            }

            const url = createObjectURL(blob);
            const link = document.createElement('a');
            const filename = `Ramp_Fulfillment_Report_${new Date().toISOString().slice(0, 10)}.csv`;

            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export CSV:', error);
            alert('An error occurred while generating the CSV export.');
        }
    };

    return (
        <Button onClick={handleExportCSV}>
            Export CSV
        </Button>
    );
}