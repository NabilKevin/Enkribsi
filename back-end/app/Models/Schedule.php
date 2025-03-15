<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $guarded = ['id'];
    public $timestamps = false;

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id', 'id');
    }
}
