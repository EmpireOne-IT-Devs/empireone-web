import React from "react";
import { FiInfo } from "react-icons/fi";
import Select from "@/app/_components/select";
import { CURRENCIES } from "./monitor-helpers";

export default function CurrencyStrip({ currency, setCurrency }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                    <FiInfo className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-teal-900">
                    All financial values are displayed in Philippine Pesos (₱).
                </span>
            </div>

            <div className="w-full sm:w-56">
                <Select
                    label="Currency"
                    name="display_currency"
                    options={CURRENCIES}
                    value={currency}
                    onChange={setCurrency}
                />
            </div>
        </div>
    );
}
