import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import CardSection from "./sections/card-secrtion";
import TableSection from "./sections/table-section";
import Layout from "../../../layout";
import RnrLayout from "../layout";
import { get_engagement_reward_challenge_employee_profiles_thunk } from "@/app/redux/engagement-thunk";

export default function Page() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_employee_profiles_thunk());
    }, [dispatch]);

    return (
        <Layout>  
            <RnrLayout>
                <div className="space-y-4">
                    <CardSection />
                    <TableSection />
                </div>
            </RnrLayout>
        </Layout>
    );
}
