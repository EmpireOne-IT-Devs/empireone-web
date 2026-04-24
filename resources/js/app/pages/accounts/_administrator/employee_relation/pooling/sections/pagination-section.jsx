import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { employees } = useSelector((store) => store.employee_relations);
    return (
        <>
            <Pagination data={employees} />
        </>
    );
}
