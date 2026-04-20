import Table from "@/app/_components/table";
import React from "react";
import { useSelector } from "react-redux";
// import ShowDetailsSection from "./show-details-section";
// import ResendJobOfferSection from "./resend-job-offer-section";
import Badge from "@/app/_components/badge";
import ResendJobOfferSection from "../../../../job_offers/_sections/resend-job-offer-section";
import SendDocumentsSection from "../../../../job_offers/_sections/send-documents-section";
import ShowDetailsSection from "../../../../job_offers/_sections/show-details-section";
// import SendDocumentsSection from "./send-documents-section";

export default function TableSection() {
    const { job_applications, search_applicant_status } = useSelector(
        (store) => store.job_postings,
    );

    const columns = [
        { header: "Applicant Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
        { header: "Position", accessor: "position" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];

    // Map status to badge variant
    const getBadgeVariant = (status) => {
        switch (status) {
            case "Pending":
                return "warning"; // yellow
            case "Accepted":
                return "success"; // green
            case "Re-Offered":
                return "secondary"; // blue/orange
            case "Declined":
                return "danger"; // red
            default:
                return "primary"; // default blue
        }
    };
    console.log(
        "job_applications",
        job_applications?.job_posting?.job_requisition?.title,
    );
    return (
        <div>
            <Table
                columns={columns}
                data={job_applications?.job_posting?.job_application?.job_offers?.map(
                    (res) => ({
                        name: res.user.name,
                        email: res.user.email,
                        role: res.role,
                        position:
                            job_applications?.job_posting?.job_requisition
                                ?.title,
                        status: (
                            <Badge
                                label={res.status}
                                variant={getBadgeVariant(res.status)}
                                className="rounded-md text-white"
                            />
                        ),
                        action: (
                            <div className="flex gap-3">
                                {res.status === "Declined Job Offer" && (
                                    <>
                                        <ResendJobOfferSection data={res} />
                                    </>
                                )}

                                {res?.job_application?.final_status ==
                                    "Accepted Job Offer" && (
                                    <>
                                        <SendDocumentsSection data={res} />
                                    </>
                                )}
                                <ShowDetailsSection data={res} />
                            </div>
                        ),
                    }),
                )}
            />
        </div>
    );
}
