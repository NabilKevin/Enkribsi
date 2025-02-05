<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $data; // Data yang akan dikirim ke view

    /**
     * Create a new message instance.
     *
     * @param array $data Data yang akan digunakan di email
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Reset Password') // Subjek email
                    ->view('emails.reset_password') // View untuk konten email
                    ->with(['data' => $this->data]); // Kirim data ke view
    }
}
