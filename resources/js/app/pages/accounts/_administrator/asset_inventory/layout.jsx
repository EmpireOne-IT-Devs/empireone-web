import Tabs from "@/app/_components/tabs";
import React from "react";
import HeaderSection from "./_sections/header-section";
import { LayoutDashboard, ClipboardList, Package, BarChart2, ShoppingCart, PackagePlus, FileText, Laptop, Cpu, Monitor, Mouse, Wrench, Archive, RotateCcw } from "lucide-react";

const TabLabel = ({ icon: Icon, text }) => (
    <span className="flex items-center gap-1.5">
        <Icon size={15} />
        {text}
    </span>
);

export default function AssetInventory({ children }) {
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: <TabLabel icon={LayoutDashboard} text="Dashboard" />,
            path: "/accounts/administrator/asset_inventory/dashboard",
            active: path === "dashboard",
        },

        {
            label: <TabLabel icon={ClipboardList} text="Request Asset" />,
            active: [
                "purchase_request",
                "item_request",
                "liability_form",
            ].includes(path),
            children: [
                {
                    label: <TabLabel icon={ShoppingCart} text="Purchase Request" />,
                    path: "/accounts/administrator/asset_inventory/purchase_request",
                },
                {
                    label: <TabLabel icon={PackagePlus} text="Item Request" />,
                    path: "/accounts/administrator/asset_inventory/item_request",
                },
                {
                    label: <TabLabel icon={FileText} text="Liability Form" />,
                    path: "/accounts/administrator/asset_inventory/liability_form",
                },
            ],
        },
        {
            label: <TabLabel icon={Package} text="Assets" />,
            active: [
                "devices",
                "system_unit",
                "monitors",
                "peripherals",
                "parts_and_accessories",
                "other_assets",
                "device_return",
            ].includes(path),
            children: [
                {
                    label: <TabLabel icon={Laptop} text="Devices" />,
                    path: "/accounts/administrator/asset_inventory/devices",
                },
                {
                    label: <TabLabel icon={Cpu} text="System Unit" />,
                    path: "/accounts/administrator/asset_inventory/system_unit",
                },
                {
                    label: <TabLabel icon={Monitor} text="Monitors" />,
                    path: "/accounts/administrator/asset_inventory/monitors",
                },
                {
                    label: <TabLabel icon={Mouse} text="Peripherals" />,
                    path: "/accounts/administrator/asset_inventory/peripherals",
                },
                {
                    label: <TabLabel icon={Wrench} text="Parts & Accessories" />,
                    path: "/accounts/administrator/asset_inventory/parts_and_accessories",
                },
                {
                    label: <TabLabel icon={Archive} text="Other Assets" />,
                    path: "/accounts/administrator/asset_inventory/other_assets",
                },
                {
                    label: <TabLabel icon={RotateCcw} text="Device Return" />,
                    path: "/accounts/administrator/asset_inventory/device_return",
                },
            ],
        },
        {
            label: <TabLabel icon={BarChart2} text="Report" />,
            path: "/accounts/administrator/asset_inventory/report",
            active: path === "report",
        },
    ];
    return (
        <div>
            <HeaderSection />

            <div className=" ">
                <Tabs tabs={tabs} />
            </div>

            <div className="p-3">{children}</div>
        </div>
    );
}
