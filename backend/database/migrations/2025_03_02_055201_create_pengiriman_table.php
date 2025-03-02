<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengiriman', function (Blueprint $table) {
            $table->bigIncrements('id_pengiriman');
            $table->unsignedBigInteger('id_transaksi');
            $table->string('nomor_resi')->nullable();
            $table->double('biaya_kirim');
            $table->timestamp('estimasi_sampai')->nullable();
            $table->string('bukti_pengiriman')->nullable();
            $table->text('alamat_pengiriman');
            $table->enum('status_pengiriman', ['dikirim', 'dalam_perjalanan', 'diterima']);
            $table->timestamp('tanggal_pengiriman')->nullable();
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            // Foreign key constraint
            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksi')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengiriman');
    }
};
