import React, { useState } from 'react';
import { TbFileText, TbCopy, TbCheck } from "react-icons/tb";
import { router } from "@inertiajs/react";

export default function OpenSurveySection({ survey }) {
  const account_role = window.location.pathname.split("/")[2];
  const [copied, setCopied] = useState(false);

  const surveyPath = `/accounts/${account_role}/activities/post_event_survey/${survey?.id}`;

  const handleOpen = () => {
    router.visit(surveyPath);
  };

  const handleCopyLink = async () => {
    const surveyUrl = `${window.location.origin}${surveyPath}`;
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy survey link:", surveyUrl);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-orange-600"
      >
        <TbFileText className="text-base" />
        Open Survey
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
      >
        {copied ? <TbCheck className="text-base text-green-600" /> : <TbCopy className="text-base" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}