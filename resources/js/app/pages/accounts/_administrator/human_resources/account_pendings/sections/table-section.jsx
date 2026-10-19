import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import moment from "moment";
import ApproveSection from "./approve-section";

export default function TableSection({
  data,
  loading,
  onApprove,
  onDecline,
  approvingUuid,
  approvalError,
  approvalErrorUuid,
  decliningUuid,
  declineError,
  declineErrorUuid,
}) {
  const columns = [
    {
      header: "EID",
      accessor: "eid",
    },
    {
      header: "Full Name",
      accessor: "full_name",
    },
    {
      header: "Employee Email",
      accessor: "employee_email",
    },
    {
      header: "Position",
      accessor: "position",
    },
    {
      header: "Location",
      accessor: "location_name",
    },
    {
      header: "Status",
      render: (row) => (
        <Badge label={row.status || "pending"} variant="warning" showDot />
      ),
    },
    {
      header: "Registered",
      render: (row) =>
        row.created_at
          ? moment(row.created_at).format("MMM DD, YYYY hh:mm A")
          : "",
    },
    {
      header: "Action",
      render: (row) => {
        const isReviewing = Boolean(approvingUuid || decliningUuid);

        return (
          <ApproveSection
            row={row}
            onApprove={onApprove}
            onDecline={onDecline}
            approvingUuid={approvingUuid}
            decliningUuid={decliningUuid}
            isReviewing={isReviewing}
            approvalError={
              approvalErrorUuid === row.uuid ? approvalError : null
            }
            declineError={declineErrorUuid === row.uuid ? declineError : null}
          />
        );
      },
    },
  ];

  return (
    <Table columns={columns} data={data} isloading={loading} />
  );
}
