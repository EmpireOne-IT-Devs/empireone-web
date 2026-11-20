<?php

$approver = env('ITEM_REQUEST_APPROVER_EMAIL');

return [
    'steps' => [
        'department_head' => ['label' => 'Department Head', 'description' => 'Confirms the request is needed for the role', 'email' => $approver],
        'asset_custodian' => ['label' => 'Asset Custodian', 'description' => 'Checks stock availability and reserves the unit', 'email' => $approver],
        'general_manager' => ['label' => 'Admin / General Manager', 'description' => 'Final sign-off to release the item', 'email' => $approver],
    ],
    'types' => ['New Assignment', 'Replacement', 'Temporary Loan', 'Return & Reassign'],
    'priorities' => ['Low', 'Normal', 'High', 'Urgent'],
];
