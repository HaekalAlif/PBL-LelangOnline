<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('penawaran', function (Blueprint $table) {
            $table->bigIncrements('id_penawaran');  // Changed from integer to bigIncrements
            $table->unsignedBigInteger('id_lelang'); // Changed from integer to unsignedBigInteger
            $table->unsignedBigInteger('id_user');   // Changed from integer to unsignedBigInteger
            $table->double('harga_bid');
            $table->timestamp('waktu_bid');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            
            $table->foreign('id_lelang')->references('id_lelang')->on('lelang')->onDelete('cascade');
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('penawaran');
    }
};
