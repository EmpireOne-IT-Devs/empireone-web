import React from "react";
import AssetInventory from "../layout";
import Layout from "../../../layout";
import HeaderSection from "./sections/header-section";
import CardSection from "./sections/card-section";
import AssetsValueSection from "./sections/assets-value-section";
import TransactionHistorySection from "./sections/transaction-history-section";
import StatisticCardSection from "./sections/statistic-card-section";
import AlertInventorySection from "./sections/alert-inventory-section";
import TotalAssetCardSection from "./sections/total-asset-card-section";

export default function Page() {
    return (
        <Layout>
            <AssetInventory>
                <div className="space-y-3">
                    <HeaderSection />
                    <CardSection />
                    <AssetsValueSection />
                    <StatisticCardSection />
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 items-stretch">
      {/* Left Column */}
      <div className="lg:col-span-2">
        <TransactionHistorySection />
      </div>

      {/* Right Column: Stretches full height to align flush with bottom */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-1">
          <TotalAssetCardSection />
        </div>
        <div>
          <AlertInventorySection />
        </div>
      </div>
    </div>
                </div>
            </AssetInventory>
        </Layout>
    );
}
