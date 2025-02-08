<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class DeleteExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:delete-expired-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghapus token yang sudah kedaluwarsa dari tabel personal_access_tokens';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $deletedCount = PersonalAccessToken::where('expires_at', '<', now())->delete();

        $this->info("Berhasil menghapus {$deletedCount} token yang sudah kedaluwarsa.");
    }
}
