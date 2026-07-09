<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class EngagementPostEvent extends Model
{
    public function index() {
        return 'hello world';
    }
    public function store(Request $request) {
         return 'hello world';
    }
    public function show() {}

    public function put() {}
}
