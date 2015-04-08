<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableProdutoCaracteristicaTipos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('produto_caracteristica_tipos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('descricao');
			$table->boolean('publicado');
			$table->integer('ordem')->unsigned();
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('produto_caracteristica_tipos');
	}

}
