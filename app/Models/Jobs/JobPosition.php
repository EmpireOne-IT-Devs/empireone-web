<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobPosition extends Model
{
  protected $fillable = [
        'title',
        'department_id',
        'description',
        'is_active'
    ];
}
