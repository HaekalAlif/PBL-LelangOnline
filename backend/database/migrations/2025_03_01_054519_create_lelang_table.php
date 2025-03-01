<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lelang', function (Blueprint $table) {
            $table->bigIncrements('id_lelang');  // Changed from bigInteger()->autoIncrement()
            $table->unsignedBigInteger('id_barang');
            $table->unsignedBigInteger('id_pemenang')->nullable();
            $table->unsignedBigInteger('id_penawaran_tertinggi')->nullable();
            $table->double('harga_pemenang')->nullable();
            $table->double('harga_minimal_bid');
            $table->timestamp('tanggal_mulai');
            $table->timestamp('tanggal_berakhir');
            $table->enum('status', ['Berlangsung', 'Selesai']);
            $table->integer('jumlah_bid')->default(0);
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->foreign('id_barang')->references('id_barang')->on('barang')->onDelete('cascade');
            $table->foreign('id_pemenang')->references('id_user')->on('users')->onDelete('set null');
            $table->foreign('created_by')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('updated_by')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('lelang');
    }
};
