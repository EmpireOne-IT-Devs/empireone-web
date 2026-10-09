<div style="font-family: Arial, sans-serif; font-size: 14px; color: #0f172a;">
    <h2 style="margin: 0 0 12px;">New application received</h2>
    <p style="margin: 0 0 12px;">
        <strong>Applicant:</strong> {{ $applicantName }}<br>
        <strong>Email:</strong> {{ $applicantEmail }}<br>
        <strong>Position:</strong> {{ $position }}
    </p>

    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e2e8f0;">
        @foreach ([
            'Lead source' => 'lead_source',
            'utm_source' => 'utm_source',
            'utm_medium' => 'utm_medium',
            'utm_campaign' => 'utm_campaign',
        ] as $label => $key)
            <tr>
                <td style="border: 1px solid #e2e8f0; font-weight: bold;">{{ $label }}</td>
                <td style="border: 1px solid #e2e8f0;">{{ $attribution[$key] ?? '' ?: '-' }}</td>
            </tr>
        @endforeach
    </table>
</div>
