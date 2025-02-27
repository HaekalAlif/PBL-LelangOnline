<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('toko', function (Blueprint $table) {
            $table->integer('id_toko')->autoIncrement();
            $table->integer('id_user');
            $table->string('nama_toko');
            $table->text('deskripsi')->nullable();
            $table->string('alamat')->nullable();
            $table->string('kontak')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();

            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('created_by')->references('id_user')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id_user')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('toko');
    }
};