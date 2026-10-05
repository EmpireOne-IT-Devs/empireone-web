import React, { useState } from "react";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";

const VALUE_FORMAT = "YYYY-MM-DD";
const DISPLAY_FORMAT = "MM/DD/YYYY";

export default function FilterLogDate({ startDate, endDate, onSearch }) {
    const [draftStart, setDraftStart] = useState(startDate);
    const [draftEnd, setDraftEnd] = useState(endDate);

    return (
        <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-500">
                <b>Cutoff Date:</b>
            </span>

            <div className="flex items-center gap-2">
                <DatePicker
                    format={DISPLAY_FORMAT}
                    placeholder="MM/DD/YYYY"
                    allowClear={false}
                    value={draftStart ? dayjs(draftStart, VALUE_FORMAT) : null}
                    onChange={(v) => v && setDraftStart(v.format(VALUE_FORMAT))}
                />

                <span className="text-sm text-gray-500">-</span>

                <DatePicker
                    format={DISPLAY_FORMAT}
                    placeholder="MM/DD/YYYY"
                    value={draftEnd ? dayjs(draftEnd, VALUE_FORMAT) : null}
                    disabledDate={(d) =>
                        draftStart && d.isBefore(dayjs(draftStart, VALUE_FORMAT), "day")
                    }
                    onChange={(v) => setDraftEnd(v ? v.format(VALUE_FORMAT) : "")}
                />

                <Button type="primary" onClick={() => onSearch(draftStart, draftEnd)}>
                    Search
                </Button>
            </div>
        </div>
    );
}
