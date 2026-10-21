import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const VALUE_FORMAT = "YYYY-MM-DD";
const DISPLAY_FORMAT = "MM/DD/YYYY";

export default function FilterAttendanceDate({ startDate, endDate, onChange }) {
    return (
        <div className="flex items-center gap-2">
            <DatePicker
                size="large"
                format={DISPLAY_FORMAT}
                placeholder="From"
                aria-label="Date from"
                value={startDate ? dayjs(startDate, VALUE_FORMAT) : null}
                disabledDate={(d) =>
                    endDate && d.isAfter(dayjs(endDate, VALUE_FORMAT), "day")
                }
                onChange={(v) =>
                    onChange(v ? v.format(VALUE_FORMAT) : "", endDate)
                }
            />

            <span className="text-sm text-gray-500">-</span>

            <DatePicker
                size="large"
                format={DISPLAY_FORMAT}
                placeholder="To"
                aria-label="Date to"
                value={endDate ? dayjs(endDate, VALUE_FORMAT) : null}
                disabledDate={(d) =>
                    startDate &&
                    d.isBefore(dayjs(startDate, VALUE_FORMAT), "day")
                }
                onChange={(v) =>
                    onChange(startDate, v ? v.format(VALUE_FORMAT) : "")
                }
            />
        </div>
    );
}
