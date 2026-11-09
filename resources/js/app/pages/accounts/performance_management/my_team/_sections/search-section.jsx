import Input from '@/app/_components/input'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

export default function SearchSection() {
    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const { data } = useSelector((store) => store.app)

    // State initialization from current URL query params
    const [search, setSearch] = useState(queryParams.get('search') || '')
    const [accountId, setAccountId] = useState(queryParams.get('account_id') || '')
    const [month, setMonth] = useState(queryParams.get('month') || '')
    const [year, setYear] = useState(queryParams.get('year') || '')

    // Month options array
    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ]

    // Generate year range (current year down 5 years and up 1 year)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i)

    // Triggered only when the user clicks Search or presses Enter
    const handleSubmit = (e) => {
        e.preventDefault()

        const currentParams = new URLSearchParams(window.location.search)

        const fields = {
            search: search.trim(),
            account_id: accountId,
            month,
            year,
        }

        Object.entries(fields).forEach(([key, value]) => {
            if (value) {
                currentParams.set(key, String(value))
            } else {
                currentParams.delete(key)
            }
        })

        router.get(
            `${window.location.pathname}?${currentParams.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        )
    }

    // Reset all inputs and clear filters from the URL
    const handleReset = () => {
        setSearch('')
        setAccountId('')
        setMonth('')
        setYear('')

        const currentParams = new URLSearchParams(window.location.search)
        currentParams.delete('search')
        currentParams.delete('account_id')
        currentParams.delete('month')
        currentParams.delete('year')

        router.get(
            `${window.location.pathname}?${currentParams.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Account Selector */}
            <div className="w-full md:w-44">
                <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="" disabled selected>All Accounts</option>
                    {data?.accounts?.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                            {acc?.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 min-w-[180px]">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Month Dropdown */}
            <div className="w-full md:w-36">
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">All Months</option>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Year Dropdown */}
            <div className="w-full md:w-28">
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">All Years</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    className="h-10 px-4 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 active:scale-95 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="h-10 px-3 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    Reset
                </button>
            </div>
        </form>
    )
}