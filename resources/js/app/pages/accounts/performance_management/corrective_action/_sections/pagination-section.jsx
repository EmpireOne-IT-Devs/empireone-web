import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {

    const { corrective_actions } = useSelector((store) => store.human_resources);
    console.log('corrective_actions',corrective_actions)
    return (
        <>
            <Pagination data={corrective_actions} />
        </>
    );
}
