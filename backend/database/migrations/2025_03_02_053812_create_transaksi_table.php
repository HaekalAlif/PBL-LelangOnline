<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->bigIncrements('id_transaksi');
            $table->unsignedBigInteger('id_lelang');
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_seller');
            $table->unsignedBigInteger('id_penawaran');
            $table->string('kode_transaksi')->unique();
            $table->double('jumlah_dibayar');
            $table->double('biaya_admin');
            $table->string('midtrans_transaction_id')->nullable();
            $table->string('midtrans_payment_type')->nullable();
            $table->string('midtrans_status')->nullable();
            $table->enum('status_transaksi', ['Menunggu Pembayaran', 'Dibayar', 'Dibatalkan']);
            $table->timestamp('deadline_pembayaran');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            // Foreign key constraints
            $table->foreign('id_lelang')->references('id_lelang')->on('lelang')->onDelete('cascade');
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_seller')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_penawaran')->references('id_penawaran')->on('penawaran')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
