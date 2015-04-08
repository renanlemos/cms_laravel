<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class Aritgos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('artigos', function(Blueprint $table) {
			$table->increments('id');
			$table->string('titulo');
			$table->string('apelido');
			$table->integer('artigo_categoria_id')->unsigned();
			$table->index('artigo_categoria_id');
			$table->boolean('publicado');
			$table->boolean('destaque');
			$table->boolean('mostrar_titulo');
			$table->string('tag_titulo');
			$table->text('mini_descricao');
			$table->text('descricao');
			$table->string('meta_title');
			$table->text('meta_description');
			$table->text('meta_keywords');
			$table->string('meta_author');
			$table->text('parametros');
			$table->integer('ordem')->undigned();
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
		Schema::drop('artigos');
	}

}
