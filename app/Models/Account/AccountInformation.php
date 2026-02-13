<?php

namespace App\Models\Account;

use App\Models\Department;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AccountInformation extends Model
{
    protected $fillable = [
        // employee information
        'user_id',
        'department_id',
        'site_id',
        'location_id',
        'work_type',
        'eogs_email',
        'employee_id',

        // personal information
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'gender',
        'date_of_birth',
        'birth_place',
        'nationality',
        'marital_status',

        // address
        'region',
        'province',
        'city',
        'barangay',
        'street',
        'zip_code',
        'village',

        // government information
        'government_type',
        'id_number',
        'sss',
        'tin',
        'philhealth',
        'pagibig',

        // education background
        'highest_level_of_education',
        'school_name',
        'course',
        'year_graduated',
        'awards',
        'status',

        // contact information
        'phone_number1',
        'phone_number2',
        'emergency_contact_name',
        'emergency_contact_number',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
