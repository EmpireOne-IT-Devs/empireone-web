import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePage } from "@inertiajs/react";
import {
  approve_account_pending_thunk,
  decline_account_pending_thunk,
} from "@/app/redux/account-pending-thunk";
import Layout from "../../../layout";
import store from "@/app/store/store";
import {
  get_account_pending_history_thunk,
  get_account_pendings_thunk,
} from "@/app/redux/employee-relation-thunk";
import EmployeeRelationLayout from "../layout";
import TableSection from "./sections/table-section";
import HistorySection from "./sections/history-section";
import Pagination from "@/app/_components/pagination";
import Button from "@/app/_components/button";
import { ClipboardList } from "lucide-react";
import Tabs from "@/app/_components/tabs";

export default function Page() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const { url } = usePage();
  const currentUrl = new URL(url, window.location.origin);
  const currentSearch = currentUrl.search;
  const activeTab =
    new URLSearchParams(currentSearch).get("view") === "history"
      ? "history"
      : "pending";
  const { accountPendings, accountPendingsLoading } = useSelector(
    (state) => state.human_resources,
  );
  const { accountPendingHistory, accountPendingHistoryLoading } = useSelector(
    (state) => state.human_resources,
  );
  const {
    approvingUuid,
    approvalError,
    approvalErrorUuid,
    decliningUuid,
    declineError,
    declineErrorUuid,
  } = useSelector((state) => state.account_pendings);
  const hasNoPendingAccounts =
    !accountPendingsLoading &&
    !errorMessage &&
    accountPendings?.data?.length === 0;
  const currentList =
    activeTab === "history" ? accountPendingHistory : accountPendings;
  const currentListLoading =
    activeTab === "history"
      ? accountPendingHistoryLoading
      : accountPendingsLoading;
  const historyUrl = new URLSearchParams(currentSearch);
  historyUrl.delete("page");
  historyUrl.set("view", "history");
  const pendingUrl = new URLSearchParams(currentSearch);
  pendingUrl.delete("page");
  pendingUrl.delete("view");
  const tabPath = (params) =>
    `${currentUrl.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  const tabs = [
    {
      label: "Pending",
      path: tabPath(pendingUrl),
      active: activeTab === "pending",
    },
    {
      label: "History",
      path: tabPath(historyUrl),
      active: activeTab === "history",
    },
  ];
  const loadCurrentList = () =>
    store.dispatch(
      activeTab === "history"
        ? get_account_pending_history_thunk()
        : get_account_pendings_thunk(),
    );

  const handleRefresh = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setWarningMessage("");
    loadCurrentList().catch((error) => {
      setErrorMessage(
        error.response?.data?.message ||
          `Unable to load ${activeTab === "history" ? "account history" : "pending accounts"}.`,
      );
    });
  };

  const handleReviewAction = async (
    pendingAccount,
    reviewThunk,
    successMessage,
  ) => {
    setErrorMessage("");
    setSuccessMessage("");
    setWarningMessage("");

    let reviewResult;
    try {
      reviewResult = await store
        .dispatch(reviewThunk(pendingAccount.uuid))
        .unwrap();
    } catch {
      return false;
    }

    if (reviewResult?.email_sent === false) {
      setWarningMessage(
        "The account was approved, but its credentials email could not be sent. Check mail delivery settings and contact the employee about their sign-in details.",
      );
    } else {
      setSuccessMessage(successMessage);
    }

    try {
      await store.dispatch(get_account_pendings_thunk());
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "The registration was reviewed, but the pending list could not be refreshed.",
      );
    }

    return true;
  };

  const handleApprove = (pendingAccount) =>
    handleReviewAction(
      pendingAccount,
      approve_account_pending_thunk,
      `${pendingAccount.full_name} was approved. They can sign in using their email or EID and the configured initial password, then complete setup 1 and setup 2.`,
    );

  const handleDecline = (pendingAccount) =>
    handleReviewAction(
      pendingAccount,
      decline_account_pending_thunk,
      `${pendingAccount.full_name}'s registration was declined and retained in the audit history.`,
    );

  useEffect(() => {
    async function loadAccounts() {
      setErrorMessage("");
      try {
        await loadCurrentList();
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            `Unable to load ${activeTab === "history" ? "account history" : "pending accounts"}.`,
        );
      }
    }

    loadAccounts();
  }, [currentSearch, activeTab]);

  return (
    <Layout>
      <EmployeeRelationLayout>
        <Tabs tabs={tabs} />
        <div className="p-3">
          {successMessage && activeTab === "pending" && (
            <p
              role="status"
              className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {successMessage}
            </p>
          )}
          {warningMessage && activeTab === "pending" && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
            >
              {warningMessage}
            </p>
          )}
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              <span>{errorMessage}</span>
              <Button
                size="sm"
                outlined
                onClick={handleRefresh}
                loading={currentListLoading}
              >
                Retry
              </Button>
            </div>
          )}
          {errorMessage ? null : activeTab === "history" ? (
            <HistorySection
              data={accountPendingHistory?.data}
              loading={accountPendingHistoryLoading}
              pendingUrl={tabPath(pendingUrl)}
            />
          ) : hasNoPendingAccounts ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
              <ClipboardList
                aria-hidden="true"
                className="mx-auto mb-3 h-8 w-8 text-purple-500"
              />
              <h2 className="text-lg font-semibold text-gray-900">
                No pending accounts
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                There are no registrations awaiting review for this location.
              </p>
              <Button
                className="mt-4"
                loading={accountPendingsLoading}
                onClick={handleRefresh}
              >
                Refresh list
              </Button>
            </div>
          ) : (
            <TableSection
              data={accountPendings?.data}
              loading={accountPendingsLoading}
              onApprove={handleApprove}
              onDecline={handleDecline}
              approvingUuid={approvingUuid}
              approvalError={approvalError}
              approvalErrorUuid={approvalErrorUuid}
              decliningUuid={decliningUuid}
              declineError={declineError}
              declineErrorUuid={declineErrorUuid}
            />
          )}
          {currentList?.meta && (
            <div className="mt-4">
              <Pagination data={currentList.meta} />
            </div>
          )}
        </div>
      </EmployeeRelationLayout>
    </Layout>
  );
}
