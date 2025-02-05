<?php

use App\Mail\SendEmail;
use Illuminate\Support\Facades\Mail;

function sendEmail($to, $data)
{
    return Mail::to($to)->send(new SendEmail($data));
}
