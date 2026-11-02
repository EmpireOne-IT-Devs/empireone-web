import React from "react";
import { useSelector } from "react-redux";
import Pagination from "@/app/_components/pagination";

export default function PaginationSection({ onPageChange }) {
    const { adminEStoreStockMeta } = useSelector((state) => state.engagement);

    if (!adminEStoreStockMeta || adminEStoreStockMeta.last_page <= 1) return null;

    return (
        <div className="pagination-section">
            <Pagination data={adminEStoreStockMeta} onPageChange={onPageChange} />
        </div>
    );
}
