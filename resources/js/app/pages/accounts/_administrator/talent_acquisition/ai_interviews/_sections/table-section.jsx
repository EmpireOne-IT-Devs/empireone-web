import Table from "@/app/_components/table";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { interviews } = useSelector((store) => store.talent_acquisitions);

    console.log('interviews', interviews)
    const columns = [
        { header: "Applicant Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Position", accessor: "position" },
        { header: "Status", accessor: "status" },
        { header: "Q & A", accessor: "qa" },
        { header: "Action", accessor: "action" },
    ];

    // Map status to badge variant
    const getBadgeVariant = (status) => {
        switch (status) {
            case "Pending":
                return "warning"; // yellow
            case "Accepted Job Offer":
                return "success"; // green
            case "Re-Offered":
                return "secondary"; // blue/orange
            case "Declined Job Offer":
                return "danger"; // red
            default:
                return "primary"; // default blue
        }
    };

    return (
        <div>
            <Table
                columns={columns}
                data={interviews?.map((res) => ({
                    name: `${res.applicant.first_name} ${res.applicant.last_name}`,
                    email: res.applicant.user.email,
                    position: res.job_title,
                    status: res.status,
                    qa: <div className="flex gap-3">
                        {
                            res?.answers?.map((res, i) => {
                                return <a
                                    target="_blank"
                                    href={res.answer_video_url}
                                >Answer{i + 1}</a>
                            })
                        }
                    </div>
                    // role: res.role,
                    // position:
                    //     res?.job_application?.job_posting?.job_requisition
                    //         ?.title,
                    // status: (
                    //     <Badge
                    //         label={res.status}
                    //         variant={getBadgeVariant(res.status)}
                    //         className="rounded-md text-white"
                    //     />
                    // ),
                    // action: (
                    //     <div className="flex gap-3">
                    //         {res.job_application.final_status !== 'Transferred' && res.status === "Declined Job Offer" && (
                    //             <>
                    //                 <ResendJobOfferSection data={res} />
                    //             </>
                    //         )}
                    //         {res.status == "Accepted Job Offer" &&
                    //             res?.job_application?.final_status ==
                    //             "Accepted Job Offer" && (
                    //                 <>
                    //                     <SendDocumentsSection data={res} />
                    //                 </>
                    //             )}
                    //         <ShowDetailsSection data={res} />
                    //     </div>
                    // ),
                }))}
            />
        </div>
    );
}
