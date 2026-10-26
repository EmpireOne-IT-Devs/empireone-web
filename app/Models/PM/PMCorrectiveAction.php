<?php

namespace App\Models\PM;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PMCorrectiveAction extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'employee_id',
        'name',
        'first_name',
        'last_name',
        'eogs_email',
        'department_id',
        'supervisor_user_id',
        'supervisor_id',
        'supervisor_first_name',
        'supervisor_last_name',
        'supervisor_email',
        'manager_user_id',
        'manager_id',
        'manager_first_name',
        'manager_last_name',
        'manager_email',
        'category',
        'code_of_discipline_section',
        'date_of_occurrence',
        'description_of_infraction',
        'evidence_drive_url',
        'status',
        'date_issued',
        'employee_explanation',
        'final_sanction',
        'employee_commitment',
    ];
}
