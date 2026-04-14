<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobRequisitionNotification extends Notification
{
    use Queueable;

    protected $jobRequisition;
    /**
     * Create a new notification instance.
     */
    public function __construct($jobRequisition)
    {
        $this->jobRequisition = $jobRequisition;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/accounts/administrator/talent_acquisition/job_requisition?id=' . $this->jobRequisition->id);

        return (new MailMessage)
            ->subject('Job Requisition Request')
            ->greeting('Hello HR Team,')
            ->line('A new job requisition request has been submitted.')
            ->action('View Job Requisition', $url)
            ->line('Please review and process this request.')
            ->salutation('Regards, Job Requisition System');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
