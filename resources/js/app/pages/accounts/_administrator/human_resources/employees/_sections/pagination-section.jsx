import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { employees } = useSelector((store) => store.human_resources);
    return (
        <>
            <Pagination data={employees} />
        </>
    );
}
