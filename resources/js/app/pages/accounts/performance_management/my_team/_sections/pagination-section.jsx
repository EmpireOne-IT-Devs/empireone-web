import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {

    const { teams } = useSelector((store) => store.departments);
    console.log('teams',teams)
    return (
        <>
            <Pagination data={teams} />
        </>
    );
}
