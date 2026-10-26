import Checkbox from '@/app/_components/checkbox'
import Input from '@/app/_components/input'
import { router } from '@inertiajs/react'
import React, { useState, useEffect, useCallback, useRef } from 'react'

export default function SearchSection() {
    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const [search, setSearch] = useState(queryParams.get('search') || '')
    const [isChecked, setIsChecked] = useState(queryParams.get('all') === 'true')

    // Track component mount to prevent search on initial page load
    const isMounted = useRef(false)

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

    // Debounce search input by 1.5 seconds, skipping the initial mount/reload
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }

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