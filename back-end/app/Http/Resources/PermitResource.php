<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermitResource extends JsonResource
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
            'jenis_izin' => $this->permit_type,
            'tanggal' => $this->date,
            'alasan' => $this->reason,
            'alasan_atasan_(jika_di_tolak)' => $this->bod_reason,
            'status' => $this->status
        ];
    }
}
