import React, { useEffect, useMemo } from "react";
import { CalendarDays, MapPin, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Select from "@/app/_components/select";
import { setWorkAnniversaryFilters } from "@/app/redux/engagement-slice";
import { get_location_thunk } from "@/app/redux/app-thunk";

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((label, index) => ({ label, value: index + 1 }));

export default function FilterWorkAnniversarySection() {
  const dispatch = useDispatch();
  const { workAnniversaryFilters } = useSelector((state) => state.engagement);
  const locations = useSelector((state) => state.app.locations ?? []);

  useEffect(() => {
    dispatch(get_location_thunk());
  }, [dispatch]);

  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => currentYear - 10 + i).map((year) => ({
        label: String(year),
        value: year,
      })),
    [currentYear],
  );

  const siteOptions = useMemo(
    () => [
      { label: "All Sites", value: "" },
      ...locations.map((location) => ({
        label: location.name,
        value: location.id,
      })),
    ],
    [locations],
  );

  const defaultFilters = {
    year: currentYear,
    month: new Date().getMonth() + 1,
    location_id: null,
  };

  const isFiltered =
    workAnniversaryFilters?.year !== defaultFilters.year ||
    workAnniversaryFilters?.month !== defaultFilters.month ||
    !!workAnniversaryFilters?.location_id;

  const handleYearChange = (value) => {
    dispatch(setWorkAnniversaryFilters({ year: Number(value) }));
  };

  const handleMonthChange = (value) => {
    dispatch(setWorkAnniversaryFilters({ month: Number(value) }));
  };

  const handleSiteChange = (value) => {
    dispatch(setWorkAnniversaryFilters({ location_id: value ? Number(value) : null }));
  };

  const handleReset = () => {
    dispatch(setWorkAnniversaryFilters(defaultFilters));
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-end gap-3 px-1">
      <div className="w-full sm:w-40">
        <Select
          label="Month"
          name="work_anniversary_month"
          iconLeft={<CalendarDays size={14} />}
          options={MONTH_OPTIONS}
          value={workAnniversaryFilters?.month}
          onChange={handleMonthChange}
        />
      </div>

      <div className="w-full sm:w-32">
        <Select
          label="Year"
          name="work_anniversary_year"
          options={yearOptions}
          value={workAnniversaryFilters?.year}
          onChange={handleYearChange}
        />
      </div>

      <div className="w-full sm:w-48">
        <Select
          label="Site"
          name="work_anniversary_site"
          iconLeft={<MapPin size={14} />}
          options={siteOptions}
          value={workAnniversaryFilters?.location_id ?? ""}
          onChange={handleSiteChange}
        />
      </div>

      {isFiltered && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 h-[42px] px-3 text-xs font-semibold text-slate-500 hover:text-indigo-700 transition-colors shrink-0"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      )}
    </div>
  );
}
