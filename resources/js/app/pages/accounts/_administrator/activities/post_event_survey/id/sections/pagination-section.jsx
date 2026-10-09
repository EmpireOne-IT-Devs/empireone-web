import React from "react";
import Pagination from "@/app/_components/pagination";

export default function PaginationSection({ data, onPageChange }) {
    if (!data?.last_page || data.last_page <= 1) {
        return null;
    }

    return (
        <>
            <Pagination data={data} onPageChange={onPageChange} />
        </>
    );
}
