<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoCategorias extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_categorias', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('titulo');
			$table->string('apelido');
			$table->boolean('publicado');
			$table->text('descricao');
			$table->string('meta_title');
			$table->text('meta_description');
			$table->text('meta_keywords');
			$table->string('meta_author');
			$table->text('parametros');
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
		Schema::drop('evento_categorias');
	}

}
