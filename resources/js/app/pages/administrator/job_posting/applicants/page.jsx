import React,{useEffect} from "react";
import Layout from "../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import SearchSection from "./_sections/search-section";
import ApplicantCardSection from "./_sections/applicant-card-section";
import store from "../../../../store/store";
import { get_applicants_thunk } from "@/app/redux/job-posting-thunk";

export default function Page() {

    useEffect(() => {
        store.dispatch(get_applicants_thunk())
    }, [])
    
    return (
        <Layout>
            <JobPostingLayout>
                <div>
                    <HeaderSection />
                    <CardSection />
                    <div className="mt-6">
                        <SearchSection />
                    </div>

                    <div className="mt-6">
                        <ApplicantCardSection />
                    </div>
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
