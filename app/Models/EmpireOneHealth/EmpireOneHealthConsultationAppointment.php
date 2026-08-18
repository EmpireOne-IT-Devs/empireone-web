<?php


namespace App\Models\EmpireOneHealth;

use Illuminate\Database\Eloquent\Model;

class EmpireOneHealthConsultationAppointment extends Model
{
    protected $table = 'empire_one_health_consultation_appointment';
    protected $fillable = [
        'name',
        'company_name',
        'email',
        'phone',
        'source',
        'help_with',
        'notes',
    ];
}
