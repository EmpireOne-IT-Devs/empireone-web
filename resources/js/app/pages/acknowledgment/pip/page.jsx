import React, { useEffect, useState } from "react";
import PIPEnrollmentFormSection from "./_sections/pip-enrollment-form-section";
import { useDispatch, useSelector } from "react-redux";
import { get_pip_by_id_thunk } from "@/app/redux/employee-relation-thunk";
import NoticeToExplainSkeleton from "./_sections/pip-skeleton";

export default function Page() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const { pip } = useSelector((state) => state.human_resources);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const pathSegments = window.location.pathname
                .split("/")
                .filter(Boolean);
            const id = pathSegments[2] || pathSegments[pathSegments.length - 1];

            if (id) {
                try {
                    await dispatch(get_pip_by_id_thunk(id));
                } catch (error) {
                    console.error("Failed to load PIP record:", error);
                } finally {
                    if (isMounted) setIsLoading(false);
                }
            } else {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    // Show interactive skeleton while data is fetching
    if (isLoading && !pip?.id) {
        return <NoticeToExplainSkeleton />;
    }
    return (
        <>
            <PIPEnrollmentFormSection />
        </>
    );
}
