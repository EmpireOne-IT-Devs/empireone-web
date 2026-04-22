import Table from "@/app/_components/table";
import React from "react";
import { useSelector } from "react-redux";
// import ShowDetailsSection from "./show-details-section";
// import ResendJobOfferSection from "./resend-job-offer-section";
import Badge from "@/app/_components/badge"; // import your Badge component
// import AcceptJobOfferSection from "../id/jo_documents/accept-job-offer-section";

export default function TableSection() {
    const { job_offers } = useSelector((store) => store.applicants);
    const role_path = window.location.pathname.split("/")[2];
    const columns = [
        { header: "Applicant Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
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
    console.log("job_offersjob_offers", job_offers?.data);

    return (
        <div>
            <Table
                columns={columns}
                data={job_offers?.data?.map((res, i) => ({
                    name: res.user.name,
                    email: res.user.email,
                    role: res.role,
                    status: (
                        <Badge
                            label={res.status}
                            variant={getBadgeVariant(res.status)}
                            className="rounded-md text-white"
                        />
                    ),
                    action: (
                        <div className="flex gap-3">
                            {/* {res.status === "Pending" && (
                                <AcceptJobOfferSection data={res} />
                            )} */}

                            {/* {res.status === "Declined" && (
                                <ResendJobOfferSection data={res} />
                            )} */}
                            {/* <ShowDetailsSection data={res} /> */}
                            {res.status !== "Declined Job Offer" && (
                                <a
                                    href={`/accounts/${role_path}/job_offers/${res.id}`}
                                    target="_blank"
                                >
                                    Show Job Offer
                                </a>
                            )}
                        </div>
                    ),
                }))}
            />
        </div>
    );
}
