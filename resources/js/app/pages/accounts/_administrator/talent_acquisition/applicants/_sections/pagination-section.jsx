import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { applicants } = useSelector((store) => store.job_postings);
    return (
        <>
            <Pagination data={applicants} />
        </>
    );
}
