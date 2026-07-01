import React from 'react';
import { TbFileText } from "react-icons/tb";
import { router } from "@inertiajs/react";

export default function OpenSurveySection({ survey }) {
  const handleOpen = () => {
    router.visit(`/accounts/administrator/activities/post_event_survey/${survey?.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-orange-600"
    >
      <TbFileText className="text-base" />
      Open Survey
    </button>
  );
}