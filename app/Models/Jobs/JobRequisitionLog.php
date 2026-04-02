<?php

namespace App\Models\Jobs;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobRequisitionLog extends Model
{
    //

    protected $fillable = [
        'job_requisitions_id',
        'user_id',
        'notes',
    ];

     public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
