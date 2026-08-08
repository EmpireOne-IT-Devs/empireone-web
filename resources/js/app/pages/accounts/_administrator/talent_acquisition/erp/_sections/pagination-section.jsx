import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { erps } = useSelector(
        (store) => store.job_postings,
    );

    console.log('erps',erps)

    return (
        <>
            <Pagination data={erps} />
        </>
    );
}
