<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TodayPermitsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_username' => $this->user->username,
            'leader_username' => $this->leader->user->username,
            'office_name' => $this->office ? $this->office->name : null,
            'date' => $this->date,
            'permit_type' => $this->permit_type,
            'reason' => $this->reason,
            'leader_reason' => $this->bod_reason,
            'status' => $this->status,
        ];
    }
}
