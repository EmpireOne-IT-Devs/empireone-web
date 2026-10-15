import Pagination from "@/app/_components/pagination";
import React from "react";

export default function PaginationSection({ data, onPageChange }) {
    if (!data?.last_page || data.last_page < 1) {
        return null;
    }

    return <Pagination data={data} onPageChange={onPageChange} />;
}
