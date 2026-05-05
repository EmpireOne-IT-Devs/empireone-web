import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";
import SendJobOfferSection from "./send-job-offer-section";

export default function PoolingTableSection() {
    const { pools } = useSelector((store) => store.human_resourcess);
    console.log("pools", pools?.data);
    const columns = [
        { header: "Applicant ID", accessor: "id" },
        { header: "Fullname", accessor: "name" },
        { header: "Contact", accessor: "contact" },
        { header: "Location", accessor: "location" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];
    return (
        <div>
            <Table
                columns={columns}
                data={
                    pools?.data?.map((res) => ({
                        ...res,
                        employee_id: (
                            <Link
                                target="_blnak"
                                className="underline text-blue-500 hover:text-blue-600"
                                href={`/accounts/administrator/human_resources/${res?.user_id}/personal_information`}
                            >
                                {res?.employee_id}
                            </Link>
                        ),
                        name: `${res?.applicant?.personal_information?.first_name} ${res?.applicant?.personal_information?.middle_name} ${res?.applicant?.personal_information?.last_name}`,
                        contact: res?.applicant?.personal_information?.contact,
                        status: res?.final_status,
                        location:
                            res?.job_posting?.job_requisition?.location?.name,
                        action: res?.final_status == "Pooled" && (
                            <SendJobOfferSection data={res} />
                        ),
                    })) ?? []
                }
            />
        </div>
    );
}
