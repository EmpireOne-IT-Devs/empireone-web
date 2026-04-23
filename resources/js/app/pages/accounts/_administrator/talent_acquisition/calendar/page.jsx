import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import CalendarSection from "./_sections/calendar-section";
import InterviewerSection from "./_sections/interviewer-section";
import SelectedDateSection from "./_sections/selected-date-section";

export default function Page() {
    const [selectedDate, setSelectedDate] = useState(null);
    return (
        <Layout>
            <JobPostingLayout>
                <div className="flex flex-col lg:flex-row gap-6 w-full mt-5">
                    <CalendarSection
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                    <div className="flex flex-col gap-5">
                        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-auto self-start sticky top-6">
                            <InterviewerSection />
                        </div>
                        <SelectedDateSection
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </div>
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
