<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ERExitClearance extends Model
{
    protected $fillable = [
        'e_r_employee_attrition_id',
        'clearance_date',
        'supervisor_signature',
        'supervisor_date_signed',
        'supervisor_payables',
        'dept_head_signature',
        'dept_head_date_signed',
        'dept_head_payables',
        'it_signature',
        'it_date_signed',
        'it_payables',
        'hr_signature',
        'hr_date_signed',
        'hr_payables',
        'company_assets_and_retrieval',
        'computer_or_devices',
        'keys',
        'communications_and_equipment',
        'employee_signature',
    ];

    protected $casts = [
        'clearance_date'                => 'date',
        'supervisor_date_signed'        => 'date',
        'supervisor_payables'           => 'decimal:2',
        'dept_head_date_signed'         => 'date',
        'dept_head_payables'            => 'decimal:2',
        'it_date_signed'                => 'date',
        'it_payables'                   => 'decimal:2',
        'hr_date_signed'                => 'date',
        'hr_payables'                   => 'decimal:2',
        'company_assets_and_retrieval'  => 'array',
        'computer_or_devices'           => 'array',
        'keys'                          => 'array',
        'communications_and_equipment' => 'array',
    ];

    /**
     * Get the attrition record associated with the exit clearance.
     */
    public function attrition(): BelongsTo
    {
        return $this->belongsTo(EREmployeeAttrition::class, 'e_r_employee_attrition_id');
    }
}
