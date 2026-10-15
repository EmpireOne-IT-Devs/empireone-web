<?php

namespace App\Http\Requests\Engagement\Concerns;

use Carbon\Carbon;

trait ValidatesChallengeDuration
{
    protected function durationDaysRule(?string $startDate, ?string $deadline): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail) use ($startDate, $deadline) {
            if (
                $attribute !== 'duration_days'
                || ! $value
                || ! $startDate
                || ! $deadline
            ) {
                return;
            }

            $maxDays = Carbon::parse($startDate)->diffInDays(Carbon::parse($deadline)) + 1;

            if ($value > $maxDays) {
                $fail("Duration days cannot exceed the {$maxDays} day(s) available between the start date and deadline.");
            }
        };
    }
}
