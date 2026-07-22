<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;

class EngagementPostEventSurvey extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'user_id',
        'title',
        'description',
        'status',
        'sentiment_overview',
        'published_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'closed_at'    => 'datetime',
            'sentiment_overview' => 'array',
        ];
    }

    public function post()
    {
        return $this->belongsTo(EngagementPostEvent::class, 'engagement_post_event_id');
    }

    public function questions()
    {
        return $this->hasMany(EngagementPostEventQuestion::class, 'engagement_post_event_survey_id')
            ->orderBy('sort_order');
    }

    public function responses()
    {
        return $this->hasMany(EngagementPostEventSurveyResponse::class, 'engagement_post_event_survey_id');
    }

    public function refreshSentimentOverview(): array
    {
        $responses = $this->responses()->with(['answers.question'])->get();
        $overview = $this->calculateSentimentOverview($responses);

        $this->update(['sentiment_overview' => $overview]);

        return $overview;
    }

    public function calculateSentimentOverview($responses): array
    {
        $totalResponses = $responses->count();
        $sentimentCounts = [
            'positive' => 0,
            'neutral' => 0,
            'negative' => 0,
        ];
        $ratingSum = 0;
        $ratingResponses = 0;

        foreach ($responses as $response) {
            $ratings = [];

            foreach ($response->answers as $answer) {
                if ($answer->question?->type !== 'rating') {
                    continue;
                }

                $rating = $this->normalizeRating($answer->answer);
                if ($rating === null) {
                    continue;
                }

                $ratings[] = $rating;
            }

            if ($ratings === []) {
                $sentimentCounts['neutral']++;
                continue;
            }

            $responseAverage = round(array_sum($ratings) / count($ratings), 1);
            $ratingSum += $responseAverage;
            $ratingResponses++;

            if ($responseAverage >= 4) {
                $sentimentCounts['positive']++;
            } elseif ($responseAverage <= 2) {
                $sentimentCounts['negative']++;
            } else {
                $sentimentCounts['neutral']++;
            }
        }

        return [
            'average_rating' => $ratingResponses > 0 ? round($ratingSum / $ratingResponses, 1) : 0.0,
            'positive' => [
                'count' => $sentimentCounts['positive'],
                'percentage' => $totalResponses > 0 ? round(($sentimentCounts['positive'] / $totalResponses) * 100, 1) : 0,
            ],
            'neutral' => [
                'count' => $sentimentCounts['neutral'],
                'percentage' => $totalResponses > 0 ? round(($sentimentCounts['neutral'] / $totalResponses) * 100, 1) : 0,
            ],
            'negative' => [
                'count' => $sentimentCounts['negative'],
                'percentage' => $totalResponses > 0 ? round(($sentimentCounts['negative'] / $totalResponses) * 100, 1) : 0,
            ],
        ];
    }

    private function normalizeRating(mixed $answer): ?int
    {
        if (is_numeric($answer)) {
            $value = (int) $answer;
            return $value >= 1 && $value <= 5 ? $value : null;
        }

        if (is_string($answer)) {
            if (preg_match('/(\d+)/', $answer, $matches)) {
                $value = (int) $matches[1];
                return $value >= 1 && $value <= 5 ? $value : null;
            }
        }

        return null;
    }
}
