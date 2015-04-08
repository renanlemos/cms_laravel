<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class Modulos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('modulos', function(Blueprint $table) {
			$table->increments('id');
			$table->string('titulo');
			$table->string('apelido');
			$table->boolean('publicado');
			$table->string('tipo');
			$table->boolean('mostrar_titulo');
			$table->string('tag_titulo');
			$table->text('conteudo');
			$table->text('parametros');
			$table->integer('ordem')->unsigned();;
			$table->integer('modulo_posicao_id')->unsigned();
			$table->index('posicao_id');
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
		Schema::drop('modulos');
	}

}
