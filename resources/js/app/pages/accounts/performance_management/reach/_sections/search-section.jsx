import Checkbox from '@/app/_components/checkbox'
import Input from '@/app/_components/input'
import { router } from '@inertiajs/react'
import React, { useState, useEffect, useCallback } from 'react'

export default function SearchSection() {
    const [search, setSearch] = useState('')
    const [isChecked, setIsChecked] = useState(false)

    const updateQueryParams = useCallback((key, value) => {
        const currentParams = new URLSearchParams(window.location.search)

        if (value || value === true) {
            currentParams.set(key, String(value))
        } else {
            currentParams.delete(key)
        }

        router.get(
            `${window.location.pathname}?${currentParams.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        )
    }, [])

    // Debounce search routing by 2 seconds (2000 ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            updateQueryParams('search', search)
        }, 1500)

        return () => clearTimeout(timer)
    }, [search, updateQueryParams])

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked
        setIsChecked(checked)
        updateQueryParams('all', checked)
    }

    return (
        <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="shrink-0">
                <Checkbox
                    label="All"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
            </div>
            <Input
                label="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
            />
        </div>
    )
}