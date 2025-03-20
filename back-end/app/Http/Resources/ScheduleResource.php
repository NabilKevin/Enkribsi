<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->office->name,
            'jam_masuk' => $this->check_in_time,
            'jam_pulang' => $this->check_out_time,
            'tanggal_expired' => $this->expired_date,
            'status' => $this->status
        ];
    }
}
