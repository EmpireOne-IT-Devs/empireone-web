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
       
        'user_id',
        'app_id',
        // personal information
        'profile_picture',
        'first_name', // required
        'middle_name', // required
        'last_name', // required
        'suffix',
        'gender', // required
        'date_of_birth', // required
        'birth_place', // required
        'nationality',
         'department_id',
        'previous_employee_status',
        'marital_status',
        'contact', //required

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
