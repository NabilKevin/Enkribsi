<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'judul' => $this->title,
            'slug' => $this->slug,
            'isi_pengumuman'=> $this->content,
            'target_audiens' => isset($this->target_audience) ? ['id' => $this->target_audience ,'username' => $this->user->username] : null,
            'status' => $this->status
        ];
    }
}
