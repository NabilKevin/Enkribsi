<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WfhScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'tanggal_awal' => $this->start_date,
            'tanggal_akhir' => $this->end_date,
            'deskripsi' => $this->description,
            'status' => $this->status
        ];
    }
}
