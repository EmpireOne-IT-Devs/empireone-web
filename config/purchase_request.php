<?php

$approver = env('PURCHASE_REQUEST_APPROVER_EMAIL');

return [
    // Set PURCHASE_REQUEST_APPROVER_EMAIL to the designated admin's verified email.
    // To assign different reviewers later, change the email for the relevant step.
    'steps' => [
        'department_head' => ['label' => 'Department Head', 'description' => 'Validates the business need and budget line', 'email' => $approver],
        'finance' => ['label' => 'Finance', 'description' => 'Confirms funds availability and cost center', 'email' => $approver],
        'procurement' => ['label' => 'Procurement', 'description' => 'Reviews supplier, pricing, and sourcing terms', 'email' => $approver],
        'general_manager' => ['label' => 'Admin / General Manager', 'description' => 'Final sign-off', 'email' => $approver],
    ],
    'departments' => ['IT Department' => 'IT', 'Human Resources' => 'HR', 'Administration' => 'ADMIN', 'Operations' => 'OPS'],
    'categories' => ['Computer Hardware', 'Furniture', 'Network Equipment', 'Software Licenses', 'Office Equipment'],
    'priorities' => ['Low', 'Normal', 'High', 'Urgent'],
];
