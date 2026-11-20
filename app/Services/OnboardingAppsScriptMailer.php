<?php

namespace App\Services;

use App\Models\Account\AccountEmployee;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OnboardingAppsScriptMailer
{
    public function sendAll(string $recipientEmail, array $data = []): array
    {
        $webAppUrl = config('services.apps_script.url');

        if (blank($webAppUrl)) {
            throw new \RuntimeException('APPS_SCRIPT_WEB_APP_URL is not configured.');
        }

        $recipientName = $data['recipientName'] ?? 'Colleague';
        $employeeId    = $data['employeeId'] ?? '';
        $deadline      = $data['deadline'] ?? now('Asia/Manila')->format('F j, Y, \a\t g:i A (\M\N\L).');

        $templates = [
            [
                'key'     => 'hris_welcome',
                'subject' => 'Welcome to EmpireOne – HRIS Account Creation',
                'html'    => view('emails.welcome_kit.hris-welcome', array_merge([
                    'recipientName' => $recipientName,
                    'deadline'      => $deadline,
                    'formUrl'       => 'https://empireone-hris.com/online_application',
                ], $data))->render(),
            ],
            [
                'key'     => 'onboarding_compliance',
                'subject' => 'Onboarding Compliance: Acknowledgment of Employee Handbook, Code of Discipline and Code of Ethics & Business Conduct',
                'html'    => view('emails.welcome_kit.onboarding-compliance', array_merge([
                    'recipientName'   => $recipientName,
                    'deadline'        => $deadline,
                    'hrisUrl'         => 'https://empireone-hris.com',
                    'defaultPassword' => 'Business12',
                ], $data))->render(),
            ],
            [
                'key'     => 'nda_acknowledgment',
                'subject' => 'Action Required: Acknowledge Non-Disclosure Agreement NDA',
                'html'    => view('emails.welcome_kit.nda-acknowledgment', array_merge([
                    'recipientName'  => $recipientName,
                    'deadline'       => $deadline,
                    'role'           => 'both',
                    'adminNdaUrl'    => 'https://empireone-hris.com/admin/nda',
                    'employeeNdaUrl' => 'https://empireone-hris.com/employee/nda',
                ], $data))->render(),
            ],
            [
                'key'     => 'eogs_gmail_creation',
                'subject' => 'EOGS Gmail Account Creation',
                'html'    => view('emails.welcome_kit.eogs-gmail-creation', array_merge([
                    'recipientName'  => $recipientName,
                    'exampleName'    => 'Juan Dela Cruz',
                    'suggestedEmail' => 'eogs.jdelacruz@gmail.com',
                    'gmailSignupUrl' => 'https://accounts.google.com/signup',
                ], $data))->render(),
            ],
            [
                'key'     => 'ticketing_welcome',
                'subject' => 'Welcome to EmpireOne – Unified Ticketing System Account Creation',
                'html'    => view('emails.welcome_kit.ticketing-welcome', array_merge([
                    'recipientName' => $recipientName,
                    'ticketingUrl'  => 'https://eo-unified-ims.com/',
                ], $data))->render(),
            ],
            [
                'key'     => 'system_credentials',
                'subject' => 'System Tools & Access Credentials',
                'html'    => view('emails.welcome_kit.system-credentials', array_merge([
                    'recipientName' => $recipientName,
                    'employeeId'    => $employeeId,
                    'hrisUrl'       => 'https://empireone-hris.com',
                    'hrisPassword'  => 'Business12',
                    'kasociusUrl'   => 'https://empireone.kasocius.com/#/',
                ], $data))->render(),
            ],
            [
                'key'     => 'bdo_payroll_onboarding',
                'subject' => 'Onboarding Requirement – Payroll Account Opening with BDO Unibank',
                'html'    => view('emails.welcome_kit.bdo-payroll-onboarding', array_merge([
                    'recipientName' => $recipientName,
                    'deadline'      => $deadline,
                    'branchName'    => 'BDO San Carlos City Branch',
                    'kasociusUrl'   => 'https://empireone.kasocius.com/#/account/accountProfile',
                ], $data))->render(),
                'attachments' => $this->bdoGuideAttachment(),
            ],
            [
                'key'     => 'company_id_request',
                'subject' => 'Action Required: Company ID Request – EmpireOneCX Community',
                'html'    => view('emails.welcome_kit.company-id-request', array_merge($data, [
                    'recipientName' => $data['recipientName'] ?? $recipientName,
                    'deadline'      => $data['deadline'] ?? $deadline,
                    'idFormUrl'     => $data['idFormUrl'] ?? 'https://forms.gle/ZYwttJ3NGmneuru86',
                    'employeeId'    => $data['employeeId'] ?? ($employeeId !== '' ? $employeeId : 'Kasocius ID'),
                    'accountName'   => $data['accountName'] ?? 'Latham',
                    'designation'   => $data['designation'] ?? 'Customer Service Representative',
                    'hireDate'      => $data['hireDate'] ?? 'November 16, 2026',
                ]))->render(),
            ],
        ];

        $payload = [
            'emails' => array_map(function ($email) use ($recipientEmail) {
                return [
                    'key'         => $email['key'],
                    'to'          => $recipientEmail,
                    'from_name'   => 'Human Resources Department',
                    'reply_to'    => 'EmpireOne.HRD@empireonegroup.com',
                    'subject'     => $email['subject'],
                    'html'        => $email['html'],
                    'attachments' => $email['attachments'] ?? [],
                ];
            }, $templates),
        ];

        $response = Http::timeout(60)
            ->acceptJson()
            ->post($webAppUrl, $payload);

        $response->throw();

        $decoded = $response->json();

        if (!is_array($decoded)) {
            throw new \RuntimeException(
                'Apps Script returned a non-JSON response (HTTP ' . $response->status() . '): ' .
                    mb_substr(trim($response->body()), 0, 500)
            );
        }

        if (($decoded['ok'] ?? false) === true && ((int) ($decoded['sent_count'] ?? 0)) > 0) {
            $this->markKitSent($recipientEmail, $data);
        }

        return $decoded;
    }

    private function markKitSent(string $recipientEmail, array $data): void
    {
        try {
            $query = AccountEmployee::query();

            if (!empty($data['userId'])) {
                $query->where('user_id', $data['userId']);
            } elseif (!empty($data['employeeId'])) {
                $query->where('employee_id', $data['employeeId']);
            } else {
                $query->where('eogs_email', $recipientEmail);
            }

            $query->update(['is_kit_sent' => 1]);
        } catch (\Throwable $e) {
            Log::warning('Unable to update is_kit_sent on AccountEmployee', [
                'recipient_email' => $recipientEmail,
                'error'           => $e->getMessage(),
            ]);
        }
    }

    private function bdoGuideAttachment(): array
    {
        $pdfPath = storage_path('app/public/guides/BDO_ONLINE_APPLICATION_GUIDE.pdf');

        if (!file_exists($pdfPath)) {
            return [];
        }

        return [
            [
                'filename'  => 'BDO ONLINE APPLICATION GUIDE.pdf',
                'mime_type' => 'application/pdf',
                'base64'    => base64_encode(file_get_contents($pdfPath)),
            ],
        ];
    }
}
