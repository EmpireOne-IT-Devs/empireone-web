import Table from "@/app/_components/table";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ShowApplicantDetailsSection from "./show-applicant-details-section";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import { Calendar } from "lucide-react";

export default function TableSection() {
    const { applications } = useSelector((store) => store.applicants);

    const [openModal, setOpenModal] = useState(false);
    console.log("applications", applications);
    const columns = [
        {
            header: "Applicant Name",
            accessor: "name",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Contact #",
            accessor: "contact",
        },
        {
            header: "Applied At",
            accessor: "applied_at",
        },
        {
            header: "Screening Status",
            accessor: "screening_status",
        },
        {
            header: "Interview Status",
            accessor: "interview_status",
        },
        {
            header: "Final Status",
            accessor: "final_status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    const getStatusBadge = (status) => {
        if (!status) return <Badge label="N/A" variant="secondary" />;

        const normalized = status.toLowerCase();

        // Screening Status
        if (["new", "conducted", "no response"].includes(normalized)) {
            return <Badge label={status} variant="warning" />;
        }
        if (["screened passed"].includes(normalized)) {
            return <Badge label={status} variant="success" />;
        }
        if (["screened failed"].includes(normalized)) {
            return <Badge label={status} variant="danger" />;
        }

        // Interview Status
        if (["scheduled"].includes(normalized)) {
            return <Badge label={status} variant="info" />;
        }
        if (["not scheduled", "no show"].includes(normalized)) {
            return <Badge label={status} variant="warning" />;
        }
        if (["passed"].includes(normalized)) {
            return <Badge label={status} variant="success" />;
        }
        if (["failed"].includes(normalized)) {
            return <Badge label={status} variant="danger" />;
        }

        // Final Status
        if (["passed", "accepted job offer", "hired"].includes(normalized)) {
            return <Badge label={status} variant="success" />;
        }
        if (
            ["failed", "declined job offer", "rejected", "withdrawn"].includes(
                normalized,
            )
        ) {
            return <Badge label={status} variant="danger" />;
        }
        if (["pooled", "sent job offer"].includes(normalized)) {
            return <Badge label={status} variant="info" />;
        }

        // fallback
        return <Badge label={status} variant="secondary" />;
    };

    const tableData = applications?.map((res) => ({
        name: res?.applicant?.name,
        email: res?.applicant?.email,
        contact: res?.applicant?.personal_information?.contact,
        applied_at: moment(res.created_at).format("LLL"),
        screening_status: getStatusBadge(res.screening_status),

        interview_status: getStatusBadge(res.interview_status),
        final_status: getStatusBadge(res.final_status),
        action: (
            <div className="flex items-center gap-2">
                <ShowApplicantDetailsSection data={res} />
            </div>
        ),
    }));
    return (
        <div>
            <div>
                <Table columns={columns} data={tableData} />
            </div>
        </div>
    );
}
