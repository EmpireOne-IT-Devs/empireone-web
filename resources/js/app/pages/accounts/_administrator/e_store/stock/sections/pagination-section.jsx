import React from "react";
import Pagination from "@/app/_components/pagination";

export default function PaginationSection() {
    // Static sample pagination data (UI only for now, not wired to real data yet)
    const data = {
        current_page: 1,
        last_page: 5,
    };

    return (
        <div className="pagination-section">
            <Pagination data={data} />
        </div>
    );
}
