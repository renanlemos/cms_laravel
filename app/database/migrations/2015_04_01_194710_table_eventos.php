<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('eventos', function(Blueprint $table) {
			$table->increments('id');
			$table->string('titulo');
			$table->string('apelido');
			$table->string('subtitulo');
			$table->string('local');
			$table->date('data_inicio');
			$table->date('data_fim');
			$table->boolean('publicado');
			$table->boolean('formulario');
			$table->integer('evento_categoria_id');
			$table->index('evento_categoria_id');
			$table->integer('evento_contato_id');
			$table->index('evento_contato_id');
			$table->boolean('status');
			$table->integer('ordem')->unsigned();
			$table->string('meta_title');
			$table->text('meta_description');
			$table->text('meta_keywords');
			$table->string('meta_author');
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
		Schema::drop('eventos');
	}

}
