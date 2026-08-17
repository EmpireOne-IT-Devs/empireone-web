<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f7fa;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f7fa;
            padding: 40px 0;
        }

        .card {
            max-width: 500px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }

        .content {
            padding: 40px;
            text-align: center;
            color: #374151;
        }

        .action-buttons {
            margin-top: 25px;
            text-align: center;
        }

        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 14px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px 5px;
            border: 2px solid #4f46e5;
        }

        .button-secondary {
            background-color: #ffffff;
            color: #4f46e5 !important;
            border: 2px solid #4f46e5;
        }

        .button.disabled {
            background-color: #9ca3af !important;
            border-color: #9ca3af !important;
            color: #ffffff !important;
            cursor: not-allowed;
        }

        .info-box {
            background-color: #f9fafb;
            border: 1px dashed #d1d5db;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }

        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }

        .logo {
            max-width: 120px;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <img
                    src="{{ $message->embed(public_path('images/E1CXlogo.png')) }}"
                    alt="EmpireOne Logo"
                    style="width: 180px; height: auto; display: block; margin: 0 auto 20px;">
                <h2 style="margin:0;">Account Created!</h2>
            </div>

            <div class="content">
                <h1 style="font-size: 24px;">Hi, {{ $user->name }}!</h1>
                <p>Your journey starts here. We've set up everything for you. Click the interactive buttons below to jump into your dashboard or meeting.</p>

                @php
                $dateString = is_array($schedule)
                ? ($schedule['start_time'] ?? $schedule['start']['dateTime'] ?? now())
                : ($schedule->start_time ?? now());

                $scheduleDate = \Carbon\Carbon::parse($dateString);
                $isPast = $scheduleDate->isPast();

                // Safely get meeting link
                $meetingLink = is_array($schedule)
                ? ($schedule['meet_link'] ?? '#')
                : ($schedule->meeting_link ?? '#');
                @endphp

                <div class="info-box">

                    <p style="margin: 0; font-size: 14px;"><strong>Website:</strong>https://careers.empireonecx.com/auth/login</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Username:</strong> {{ $user->email }}</p>
                    <p style="margin: 5px 0 0; font-size: 14px;"><strong>Password:</strong> <code style="background: #eee; padding: 2px 6px; border-radius: 4px; color: #111827;">Business12</code></p>
                    <p style="margin: 5px 0 0; font-size: 14px;"><strong>Initial Interview On:</strong> <span style="color: #4f46e5; font-weight: 500;">{{ $scheduleDate->format('F j, Y, g:i A') }}</span></p>
                </div>

                <div class="action-buttons">
                    @if($isPast)
                    <span class="button disabled">Link Expired</span>
                    @else
                    <a href="{{ $meetingLink }}" class="button">Join Meet Link</a>
                    @endif
                    <!-- <div>
                        Or
                    </div>
                    {{-- FIXED: Added missing quote and helper check --}}
                    <a href="{{ $schedule['job_interview_id'] ?? '#' }}" class="button">
                        Join AI Interview
                    </a> -->

                    <a href="{{ $url }}" class="button button-secondary">
                        Get Started →
                    </a>
                </div>

                @if($isPast)
                <p style="margin-top: 15px; font-size: 12px; color: #ef4444; font-weight: bold;">Your scheduled time has passed.</p>
                @endif

                <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
                    For your security, please change your password after logging in.
                </p>
            </div>
        </div>
        <div class="footer">
            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>

</html>