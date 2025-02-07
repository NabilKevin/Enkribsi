<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $guarded = ['id'];

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'office_id', 'id');
    }
}
