<?php

namespace App\Http\Resources\Timekeeping;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamRequestResource extends JsonResource
{
    private const CORRECTION_LABELS = [
        'time_in_correction' => 'Time In',
        'time_out_correction' => 'Time Out',
        'clock_in_correction' => 'Clock In',
        'clock_out_correction' => 'Clock Out',
        'break_start_correction' => 'Break Start',
        'break_end_correction' => 'Break End',
        'break1_start' => 'Break 1 Start',
        'break1_end' => 'Break 1 End',
        'break2_start' => 'Break 2 Start',
        'break2_end' => 'Break 2 End',
        'break3_start' => 'Break 3 Start',
        'break3_end' => 'Break 3 End',
        'time_in_2_correction' => 'Time In 2',
        'time_out_2_correction' => 'Time Out 2',
        'clock_in_2_correction' => 'Clock In 2',
        'clock_out_2_correction' => 'Clock Out 2',
        'shift2_break1_start' => 'Shift 2 Break 1 Start',
        'shift2_break1_end' => 'Shift 2 Break 1 End',
        'shift2_break2_start' => 'Shift 2 Break 2 Start',
        'shift2_break2_end' => 'Shift 2 Break 2 End',
        'shift2_break3_start' => 'Shift 2 Break 3 Start',
        'shift2_break3_end' => 'Shift 2 Break 3 End',
    ];

    public function toArray(Request $request): array
    {
        $type = $this->request_type;

        return [
            'id' => $this->id,
            'type' => $type,
            'employee' => $this->employee_info,
            'date' => Carbon::parse($this->date)->toDateString(),
            'details' => $this->details($type),
            'reason' => match ($type) {
                'overtime' => $this->remark,
                default => $this->reason,
            },
            'status' => $this->status,
            'status_label' => $this->statusLabel(),
            'can_review' => $this->status === 'pending',
            'supervisor_note' => $this->supervisor_note,
        ];
    }

    private function details(string $type): array
    {
        return match ($type) {
            'overtime' => [
                ['label' => 'Start', 'value' => $this->formatDateTime($this->start_at)],
                ['label' => 'End', 'value' => $this->formatDateTime($this->end_at)],
                ['label' => 'Duration', 'value' => $this->formatMinutes((int) $this->overtime_minutes)],
            ],
            'leave' => [
                ['label' => 'Leave Type', 'value' => $this->leave_type],
            ],
            default => collect(self::CORRECTION_LABELS)
                ->filter(fn ($label, $field) => $this->{$field} !== null)
                ->map(fn ($label, $field) => [
                    'label' => $label,
                    'value' => $this->formatDateTime($this->{$field}),
                ])
                ->values()
                ->all(),
        };
    }

    private function statusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'endorsed' => 'Approved by Leader',
            'approved' => 'Approved',
            'granted' => 'Approved',
            'declined' => 'Declined',
            default => ucfirst((string) $this->status),
        };
    }

    private function formatDateTime($value): ?string
    {
        return $value ? Carbon::parse($value)->format('m/d/Y h:i A') : null;
    }

    private function formatMinutes(int $minutes): string
    {
        return sprintf('%dh %02dm', intdiv($minutes, 60), $minutes % 60);
    }
}
