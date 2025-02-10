<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wfa_wfh_schedules', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('type', ['wfh', 'wfa']);
            $table->unsignedBigInteger('office_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wfa_wfh_schedules');
    }
};
