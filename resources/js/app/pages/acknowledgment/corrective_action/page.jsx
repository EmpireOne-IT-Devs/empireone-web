import React, { useEffect, useState } from 'react';
import CorrectiveActionForm from './_sections/corrective-action-form';
import { useDispatch, useSelector } from 'react-redux';
import { get_corrective_action_by_id_thunk } from '@/app/redux/employee-relation-thunk';
import NoticeToExplainSkeleton from './_sections/notice-to-explain-skeleton';

export default function Page() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const { corrective_action } = useSelector((store) => store.human_resources);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const pathSegments = window.location.pathname.split('/');
            const id = pathSegments[3] || pathSegments.pop();

            if (id) {
                try {
                    await dispatch(get_corrective_action_by_id_thunk(id));
                } catch (error) {
                    console.error("Failed to load corrective action:", error);
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
    if (isLoading && !corrective_action?.id) {
        return <NoticeToExplainSkeleton />;
    }

    return (
        <>
            <CorrectiveActionForm />
        </>
    );
}

