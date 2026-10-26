import moment from "moment";

const VALUE_FORMAT = "YYYY-MM-DD";

// Payroll periods: 1st-15th (cutoff on the 25th) and 16th-end of month (cutoff on the 10th of next month).
export function get_cutoff_period(date = moment()) {
    const day = moment(date);
    let start;
    let end;
    let cutoffDate;

    if (day.date() <= 15) {
        start = day.clone().date(1);
        end = day.clone().date(15);
        cutoffDate = day.clone().date(25);
    } else {
        start = day.clone().date(16);
        end = day.clone().endOf("month");
        cutoffDate = day.clone().add(1, "month").date(10);
    }

    return {
        start: start.format(VALUE_FORMAT),
        end: end.format(VALUE_FORMAT),
        label: `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`,
        cutoffDate: cutoffDate.format("MMM D, YYYY"),
    };
}

export function get_previous_cutoff_period(period) {
    return get_cutoff_period(moment(period.start).subtract(1, "day"));
}

export function get_next_cutoff_period(period) {
    return get_cutoff_period(moment(period.end).add(1, "day"));
}
