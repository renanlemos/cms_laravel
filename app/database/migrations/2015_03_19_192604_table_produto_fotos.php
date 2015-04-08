<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableProdutoFotos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('produto_fotos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('imagem');
			$table->string('alt');
			$table->boolean('capa');
			$table->boolean('publicado');
			$table->string('titulo');
			$table->text('legenda');
			$table->integer('ordem');
			$table->integer('produto_id');
			$table->index('produto_id');
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
		Schema::drop('produto_fotos');
	}

}
