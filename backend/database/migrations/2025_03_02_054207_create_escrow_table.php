<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('escrow', function (Blueprint $table) {
            $table->bigIncrements('id_escrow');
            $table->unsignedBigInteger('id_transaksi');
            $table->double('jumlah_saldo');
            $table->enum('status_escrow', [
                'menunggu_konfirmasi_buyer',
                'menunggu_pencairan',
                'dicairkan',
                'dikembalikan'
            ]);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            // Foreign key constraint
            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksi')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('escrow');
    }
};
