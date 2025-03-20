<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HrAttendanceResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'username' => isset($this->user) ? $this->user->username : null,
            'tanggal' => $this->date,
            'status' => $this->status,
            'jenis_kerja' => $this->work_type,
            'tanggal_masuk_kerja' => $this->check_in_date,
            'tanggal_pulang_kerja' => $this->check_out_date,
            'jam_masuk_kerja' => $this->check_in_time,
            'jam_pulang_kerja' => $this->check_out_time,
            'latitude_masuk_kerja' => $this->check_in_latitude,
            'longitude_masuk_kerja' => $this->check_in_longitude,
            'latitude_pulang_kerja' => $this->check_out_latitude,
            'longitude_pulang_kerja' => $this->check_out_longitude,
            'kantor' => isset($this->office) ? $this->office->username : null
        ];
    }
}
