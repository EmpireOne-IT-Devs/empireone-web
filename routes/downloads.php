<?php

use App\Http\Controllers\API\AssetInventory\AssetLiabilityFormController;
use Illuminate\Support\Facades\Route;

Route::get('/asset-accountability/{liabilityForm}/paper-scan', [AssetLiabilityFormController::class, 'paperScan'])
    ->middleware('auth')->whereUuid('liabilityForm')->name('asset-liability-forms.paper.scan');
