<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('barang', function (Blueprint $table) {
            $table->bigIncrements('id_barang');
            $table->unsignedBigInteger('id_kategori');  // This now matches kategori's id_kategori
            $table->unsignedBigInteger('id_toko');
            $table->string('nama_barang');
            $table->text('deskripsi_barang')->nullable();
            $table->double('harga_awal');
            $table->string('gambar_barang')->nullable();
            $table->string('grade')->comment('Grading barang: Seperti Baru, Bekas Layak Pakai, Rusak Ringan, Rusak Berat');
            $table->enum('status_barang', ['Tersedia', 'Dalam Lelang', 'Terjual'])->default('Tersedia');
            $table->text('kondisi_detail')->nullable();
            $table->decimal('berat_barang', 10, 2);
            $table->string('dimensi')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->foreign('id_kategori')->references('id_kategori')->on('kategori')->onDelete('cascade');
            $table->foreign('id_toko')->references('id_toko')->on('toko')->onDelete('cascade');
            $table->foreign('created_by')->references('id_user')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id_user')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('barang');
    }
};