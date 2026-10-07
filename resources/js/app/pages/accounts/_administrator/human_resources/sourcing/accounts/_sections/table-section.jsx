import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
import EditAccountSection from "./edit-account-section";

export default function TableSection( { loading }) {
    const { data } = useSelector((store) => store.app);

    // Columns configured specifically for Accounts
    const columns = [
        { header: "Account ID", accessor: "id" },
        { header: "Account Name", accessor: "name" },
        { header: "Description", accessor: "description" },
        { header: "Created At", accessor: "created_at" },
        { header: "Action", accessor: "action" },
    ];

    // Map through the account objects directly
    const formattedData = useMemo(() => {
        if (!Array.isArray(data?.accounts)) return [];

        return data.accounts.map((account) => ({
            ...account,
            id: account?.id ?? "N/A",
            name: account?.name || "N/A",
            description: account?.description || "N/A",
            created_at: account?.created_at
                ? new Date(account.created_at).toLocaleDateString()
                : "N/A",
                action:<EditAccountSection props_data={account} />
        }));
    }, [data?.accounts]);

    return <Table columns={columns} data={formattedData} isloading={loading} />;
}