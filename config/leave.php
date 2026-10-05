<?php

return [
    // Months from hire date until an employee is regularized.
    'regularization_months' => 6,

    // Annual leave days by completed years of service (highest matching key wins).
    'annual_days_by_service_years' => [
        0 => 5,
        3 => 7,
        5 => 10,
    ],

    // Leave types that consume 1 credit per day filed.
    'deductible_types' => [
        'Emergency Leave',
        'Sick Leave',
        'Vacation Leave',
    ],
];
