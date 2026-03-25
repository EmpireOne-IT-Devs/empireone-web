<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class AccountEmployee extends Model
{
    
    use  Notifiable;
    protected $fillable = [
        'user_id',
        'department_id',
        'site_id',
        'location_id',
        'work_type',
        'eogs_email',
        'employee_id',
        'with_bpo',
        'source',
        'position',
        'signature'
    ];

    
    public function routeNotificationForMail($notification)
    {
        return $this->eogs_email;
    }
}
