<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('komplain', function (Blueprint $table) {
            $table->bigIncrements('id_komplain');
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_transaksi');
            $table->enum('alasan_komplain', [
                'Barang Tidak Sesuai',
                'Barang Rusak',
                'Barang Tidak Sampai',
                'Lainnya'
            ]);
            $table->text('isi_komplain');
            $table->enum('status_komplain', ['menunggu', 'diproses', 'selesai']);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            // Foreign key constraints
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksi')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('komplain');
    }
};
