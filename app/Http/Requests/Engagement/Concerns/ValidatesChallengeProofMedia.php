<?php

namespace App\Http\Requests\Engagement\Concerns;

use Illuminate\Validation\Validator;

/**
 * Shared proof-media rules for Individual, Daily and Team submissions:
 * up to 3 images, or one video when the challenge allows video proof.
 */
trait ValidatesChallengeProofMedia
{
    protected function proofMediaRules(): array
    {
        return [
            'photos' => ['nullable', 'array', 'min:1', 'max:3'],
            'photos.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'photo' => ['required_without_all:photos,video', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'video' => ['required_without_all:photos,photo', 'file', 'mimes:mp4,mov,webm', 'max:1048576'],
            'challenge_description' => ['required', 'string', 'max:1000'],
        ];
    }

    protected function proofMediaMessages(): array
    {
        return [
            'photos.max' => 'You can upload a maximum of 3 images per submission. Please remove the extra images to continue.',
            'video.max' => 'Videos must be no larger than 1 GB.',
        ];
    }

    protected function validateProofMedia(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $challenge = $this->route('engagementRewardChallenge');
            $allowsVideo = ($challenge?->proof_type ?? 'photo_only') === 'photo_or_video';
            $hasImages = $this->hasFile('photos') || $this->hasFile('photo');

            if (($this->hasFile('photos') && $this->hasFile('photo'))
                || ($hasImages && $this->hasFile('video'))) {
                $validator->errors()->add('photos', 'Upload images or one video, not both.');
            }

            if ($this->hasFile('video') && ! $allowsVideo) {
                $validator->errors()->add('video', 'This challenge only accepts photo proof.');
            }
        });
    }
}
