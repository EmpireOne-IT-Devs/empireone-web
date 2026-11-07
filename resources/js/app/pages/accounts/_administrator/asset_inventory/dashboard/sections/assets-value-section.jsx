import React, { useState } from 'react'
import Card from '@/app/_components/card'
import { Info, ChevronDown } from 'lucide-react'

export default function AssetsValueSection() {
  const [currency, setCurrency] = useState('PHP')

  const currencyConfig = {
    PHP: {
      label: 'Php - Philippine Peso',
      message: 'All financial values are displayed in Philippine Pesos (₱).',
    },
    USD: {
      label: 'Usd - US Dollar',
      message: 'All financial values are displayed in US Dollars ($).',
    },
  }

  return (
    <div className="">
      <Card padding="p-4" className="rounded-2xl bg-emerald-50/60 border-emerald-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Info Icon & Message */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-teal-900">
              {currencyConfig[currency].message}
            </span>
          </div>

          {/* Currency Dropdown Control */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Currency
            </span>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-full px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="PHP">Php - Philippine Peso</option>
                <option value="USD">Usd - US Dollar</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}