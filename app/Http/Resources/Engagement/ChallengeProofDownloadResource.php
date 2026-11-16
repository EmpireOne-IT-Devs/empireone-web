<?php

namespace App\Http\Resources\Engagement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChallengeProofDownloadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'url' => $this['url'],
            'filename' => $this['filename'],
            'expires_at' => $this['expires_at'],
        ];
    }
}
