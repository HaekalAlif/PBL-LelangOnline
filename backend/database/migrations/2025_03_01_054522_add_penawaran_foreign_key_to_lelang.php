<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lelang', function (Blueprint $table) {
            $table->foreign('id_penawaran_tertinggi')
                ->references('id_penawaran')
                ->on('penawaran')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('lelang', function (Blueprint $table) {
            $table->dropForeign(['id_penawaran_tertinggi']);
        });
    }
};
