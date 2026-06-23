import React, { useEffect, useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import ActivitiesLayout from "../../layout";
import { useDispatch, useSelector } from "react-redux";
import {
    get_poll_details_thunk,
    get_poll_vote_records_thunk,
} from "@/app/redux/activities-slice";
import HeaderSection from "./sections/header-section";
import PollInfoSection from "./poll-info-section";
import PollResultsSection from "./poll-results-section";
import VoteRecordsSection from "./vote-records-section";
import Skeleton from "@/app/_components/skeleton";


export default function Page() {
    const id = window.location.pathname.split("/")[5];
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("results");

    const { selectedPoll, selectedPollLoading } = useSelector(
        (state) => state.activities,
    );

    useEffect(() => {
        dispatch(get_poll_details_thunk(id));
        dispatch(get_poll_vote_records_thunk(id));
    }, [dispatch, id]);

    const isLoading = selectedPollLoading || !selectedPoll?.poll_information;

    if (isLoading) {
        return (
            <Layout>
                <ActivitiesLayout>
                    <HeaderSection />
                    <Skeleton lines={8} className="mt-4 px-4" />
                </ActivitiesLayout>
            </Layout>
        );
    }

    return (
        <Layout>
            <ActivitiesLayout>
                <HeaderSection />
                <PollInfoSection pollId={id} />

                <div className="mb-4 flex gap-2 ">
                    <button
                        type="button"
                        onClick={() => setActiveTab("results")}
                        className={`px-3 py-2 rounded-md text-sm ${activeTab === "results" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                        Poll Results
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("records")}
                        className={`px-3 py-2 rounded-md text-sm ${activeTab === "records" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                        Vote Records
                    </button>
                </div>

                <div>
                    {activeTab === "results" ? (
                        <PollResultsSection />
                    ) : (
                        <VoteRecordsSection />
                    )}
                </div>
            </ActivitiesLayout>
        </Layout>
    );
}
