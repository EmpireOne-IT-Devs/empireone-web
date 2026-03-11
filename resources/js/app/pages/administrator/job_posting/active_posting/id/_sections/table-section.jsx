import Table from "@/app/_components/table";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { TbEye } from "react-icons/tb";
import ApplicationDetailSection from "./application-detail-section";
import { router } from "@inertiajs/react";

export default function TableSection() {
    const { job_applications } = useSelector((store) => store.job_postings);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedApplicant, setSelectedApplicant] = React.useState(null);

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
            header: "Status",
            accessor: "status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                data={job_applications?.job_application?.applicants?.map((res) => ({
                    name: res.applicant.name,
                    email: res.applicant.email,
                    contact: res.personal_information.contact,
                    applied_at: moment(res.created_at).format("LLL"),
                    status: res.status,
                    action: (
                        <button
                            onClick={() => {
                                setSelectedApplicant(res);
                                setModalOpen(true);
                            }}
                            className="p-2 rounded-md hover:bg-gray-100 transition"
                        >
                            <TbEye className="w-5 h-5 text-gray-600" />
                        </button>
                    ),
                }))}
            />
            {modalOpen && (
                <ApplicationDetailSection
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    applicant={selectedApplicant}
                />
            )}
        </div>
    );
}