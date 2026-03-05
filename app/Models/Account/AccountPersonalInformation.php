<?php

namespace App\Models\Account;

use App\Models\Department;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class AccountPersonalInformation extends Model
{
    
    protected $fillable = [
        // employee information
        'user_id',
        'department_id',
        'site_id',  // required
        'location_id',
        'work_type',
        'eogs_email',
        'employee_id',
        'position',
        'contact',
        'source', // required

        // personal information
        'first_name', // required
        'middle_name', // required
        'last_name', // required
        'suffix',
        'gender', // required
        'date_of_birth', // required
        'birth_place', // required
        'nationality',
        'marital_status',

        // address
        'region', // required
        'province', // required
        'city', // required
        'barangay', // required
        'street', // required
        'zip_code', // required
        'village',

        // government information
        'government_type',
        'id_number',
        'sss',
        'tin',
        'philhealth',
        'pagibig',

        // education background 
        'highest_level_of_education', // required
        'school_name',
        'course',
        'year_graduated',
        'awards',
        'status',
        'degree',

        // contact information
        'contact_name',
        'contact_address',
        'contact_relationship',
        'contact_number',
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
