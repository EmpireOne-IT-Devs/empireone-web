import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {

    const { reaches } = useSelector((store) => store.human_resources);
    console.log('reaches',reaches)
    return (
        <>
            <Pagination data={reaches} />
        </>
    );
}
