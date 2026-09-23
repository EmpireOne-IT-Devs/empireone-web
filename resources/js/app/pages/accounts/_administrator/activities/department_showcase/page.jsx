import React from "react";
import Layout from "../../../layout";
import ActivitiesLayout from "../layout";
import HeaderSection from "./sections/header-section";
import UpcomingBirthdaySection from "./sections/upcoming-birthday-section";
import WorkAnniversarySection from "./sections/work-anniversary-section";
import RecentActivitySection from "../company_newsfeed/sections/recent-activity-section";

export default function Page() {
  return (
    <Layout>
      <ActivitiesLayout>
        {/* Outer wrapper: fills the slot, puts scrollbar on the outside edge */}
        <div className="relative flex h-full min-h-0 overflow-hidden rounded-2xl">

          {/* Scrollable content area — scrollbar sits between this and the outer edge */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-indigo-200 hover:[&::-webkit-scrollbar-thumb]:bg-indigo-400">

            {/* Page background with vibrant gradient */}
            <div className="min-h-full rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 border border-white/60 shadow-xl shadow-indigo-100/40 p-5 flex flex-col gap-6">

              {/* Decorative background blobs */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl -z-10">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-16 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl" />
              </div>

              {/* Header */}
              <div className="shrink-0">
                <HeaderSection />
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent shrink-0" />

              {/* Birthday Section */}
              <section className="shrink-0">
                <UpcomingBirthdaySection />
              </section>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent shrink-0" />

              {/* Work Anniversary Section */}
              <section className="shrink-0">
                <WorkAnniversarySection />
              </section>

            </div>
          </div>
        </div>
      </ActivitiesLayout>
    </Layout>
  );
}