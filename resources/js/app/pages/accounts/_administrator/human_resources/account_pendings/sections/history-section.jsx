import Badge from "@/app/_components/badge";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import moment from "moment";
import { History } from "lucide-react";

export default function HistorySection({ data, loading, pendingUrl }) {
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
        <Badge
          label={row.status}
          variant={row.status === "approved" ? "success" : "danger"}
          showDot
        />
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
      header: "Reviewed",
      render: (row) => {
        const reviewedAt =
          row.status === "approved" ? row.approved_at : row.declined_at;

        return reviewedAt
          ? moment(reviewedAt).format("MMM DD, YYYY hh:mm A")
          : "";
      },
    },
  ];

  const hasHistory = data?.length > 0;

  return (
    <section aria-labelledby="account-history-heading">
      <div className="mb-4">
        <h2
          id="account-history-heading"
          className="text-lg font-semibold text-gray-900"
        >
          Account review history
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Approved and declined registrations for this location.
        </p>
      </div>
      {!loading && !hasHistory ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
          <History
            aria-hidden="true"
            className="mx-auto mb-3 h-8 w-8 text-purple-500"
          />
          <h3 className="text-lg font-semibold text-gray-900">
            No account review history
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Approved and declined registrations will appear here.
          </p>
          <Link
            href={pendingUrl}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Return to pending accounts
          </Link>
        </div>
      ) : (
        <Table columns={columns} data={data} isloading={loading} />
      )}
    </section>
  );
}